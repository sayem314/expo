import chalk from 'chalk';

import Git from '../Git';
import * as GitHub from '../GitHub';
import logger from '../Logger';
import { COMMENT_HEADER, generateReportFromOutputs } from './reports';
import checkMissingChangelogs from './reviewers/checkMissingChangelogs';
import reviewChangelogEntries from './reviewers/reviewChangelogEntries';
import reviewForbiddenFiles from './reviewers/reviewForbiddenFiles';
import { ReviewEvent, ReviewComment, ReviewInput, ReviewOutput, ReviewStatus } from './types';

/**
 * An array with functions whose purpose is to check and review the diff.
 */
const REVIEWERS = [checkMissingChangelogs, reviewChangelogEntries, reviewForbiddenFiles];

enum Label {
  PASSED_CHECKS = 'bot: passed checks',
  SUGGESTIONS = 'bot: suggestions',
  NEEDS_CHANGES = 'bot: needs changes',
}

/**
 * Goes through the changes included in given pull request and checks if they meet basic requirements.
 */
export async function reviewPullRequestAsync(prNumber: number) {
  const pr = await GitHub.getPullRequestAsync(prNumber);
  const user = await GitHub.getAuthenticatedUserAsync();

  logger.info('👾 Fetching head commit', chalk.yellow.bold(pr.head.sha));
  await Git.fetchAsync({
    remote: 'origin',
    ref: pr.head.sha,
    depth: pr.commits + 1,
  });

  // Get the diff of the pull request.
  const diff = await GitHub.getPullRequestDiffAsync(prNumber);

  const input: ReviewInput = {
    pullRequest: pr,
    diff,
  };

  // Run all the checks asynchronously and collects their outputs.
  logger.info('🕵️‍♀️  Reviewing changes');
  const outputs = (await Promise.all(REVIEWERS.map((reviewer) => reviewer(input)))).filter(
    Boolean
  ) as ReviewOutput[];

  // Only active (non-passive) outputs will be reported in the review body.
  const activeOutputs = outputs.filter(
    (output) => output.title && output.body && output.status !== ReviewStatus.PASSIVE
  );

  // Gather comments that will be part of the review.
  const reviewComments = getReviewCommentsFromOutputs(outputs);

  // Get lists of existing reports and reviews. We'll delete them once the new ones are submitted.
  const outdatedReports = await findExistingReportsAsync(prNumber, user.id);
  const outdatedReviews = await findExistingReviewsAsync(prNumber, user.id);

  // Submit a report if there is any non-passive output.
  if (activeOutputs.length > 0) {
    const report = generateReportFromOutputs(activeOutputs, pr.head.sha);
    await submitReportAsync(pr.number, report);
  }

  // Submit a review if there is any review comment (usually suggestion).
  if (reviewComments.length > 0) {
    await submitReviewWithCommentsAsync(pr.number, reviewComments);
  }

  // Log the success if there is nothing to complain.
  if (!activeOutputs.length && !reviewComments.length) {
    logger.success(
      '🥳 Everything looks good to me! There is no need to submit a report nor a review.'
    );
  }

  // Delete outdated reports and reviews and update labels.
  await deleteOutdatedReportsAsync(outdatedReports);
  await deleteOutdatedReviewsAsync(pr.number, outdatedReviews);
  await updateLabelsAsync(pr, getLabelFromOutputs(activeOutputs));

  logger.success("🥳 I'm done!");
}

/**
 * Concats comments from all review outputs.
 */
function getReviewCommentsFromOutputs(outputs: ReviewOutput[]): ReviewComment[] {
  return ([] as ReviewComment[]).concat(...outputs.map((output) => output.comments ?? []));
}

/**
 * Returns GitHub's label based on outputs' final status.
 */
function getLabelFromOutputs(outputs: ReviewOutput[]): Label {
  const finalStatus = outputs.reduce(
    (acc, output) => Math.max(acc, output.status),
    ReviewStatus.PASSIVE
  );
  switch (finalStatus) {
    case ReviewStatus.ERROR:
      return Label.NEEDS_CHANGES;
    case ReviewStatus.WARN:
      return Label.SUGGESTIONS;
    default:
      return Label.PASSED_CHECKS;
  }
}

/**
 * Updates bot's labels of the PR so that only given label is assigned.
 */
async function updateLabelsAsync(pr: GitHub.PullRequest, newLabel: Label) {
  const prLabels = pr.labels.map((label) => label.name);
  const botLabels = Object.values(Label);

  // Get an array of bot's labels that are already assigned to the PR.
  const labelsToRemove = botLabels.filter(
    (label) => label !== newLabel && prLabels.includes(label)
  );

  for (const labelToRemove of labelsToRemove) {
    logger.info(`🏷  Removing ${chalk.yellow(labelToRemove)} label`);
    await GitHub.removeIssueLabelAsync(pr.number, labelToRemove);
  }
  if (!prLabels.includes(newLabel)) {
    logger.info(`🏷  Adding ${chalk.yellow(newLabel)} label`);
    await GitHub.addIssueLabelsAsync(pr.number, [newLabel]);
  }
}

/**
 * Finds all reports made by me and this expotools command in given pull request.
 */
async function findExistingReportsAsync(prNumber: number, userId: number) {
  return (await GitHub.listAllCommentsAsync(prNumber)).filter((comment) => {
    return comment.user?.id === userId && comment.body?.startsWith(COMMENT_HEADER);
  });
}

/**
 * Finds all reviews submitted by me and this expotools command in given pull request.
 */
async function findExistingReviewsAsync(prNumber: number, userId: number) {
  return (await GitHub.listPullRequestReviewsAsync(prNumber)).filter(
    (review) => review.user?.id === userId
  );
}

/**
 * Submits a pull request comment with the report.
 */
async function submitReportAsync(prNumber: number, reportBody: string) {
  logger.info(`🗣  Submitting the report`);

  const comment = await GitHub.createCommentAsync(prNumber, reportBody);

  logger.info('🎤 Submitted the report at:', chalk.blue(comment.html_url));
}

/**
 * Submits a pull request review if there are any review comments.
 */
async function submitReviewWithCommentsAsync(prNumber: number, comments: ReviewComment[]) {
  if (comments.length === 0) {
    return;
  }

  logger.info(`🗣  Submitting the review`);

  // Create new pull request review. The body must remain empty,
  // otherwise it won't be possible to delete the entire review by deleting its comments.
  const review = await GitHub.createPullRequestReviewAsync(prNumber, {
    body: '',
    event: ReviewEvent.COMMENT,
    comments,
  });

  logger.info('📝 Submitted the review at:', chalk.blue(review.html_url));
}

/**
 * Deletes bot's reports from PR's history.
 */
async function deleteOutdatedReportsAsync(reports: GitHub.IssueComment[]) {
  logger.info('💥 Deleting outdated reports');
  await Promise.all(reports.map((report) => GitHub.deleteCommentAsync(report.id)));
}

/**
 * Deletes bot's reviews from PR's history.
 */
async function deleteOutdatedReviewsAsync(prNumber: number, reviews: GitHub.PullRequestReview[]) {
  logger.info('💥 Deleting outdated reviews');
  await Promise.all(
    reviews.map((review) => GitHub.deleteAllPullRequestReviewCommentsAsync(prNumber, review.id))
  );
}
