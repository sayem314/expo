import { css } from '@emotion/react';
import { theme } from '@expo/styleguide';
import * as React from 'react';

import { UL, LI } from '~/components/base/list';
import Bug from '~/components/icons/Bug';
import ChatBoxes from '~/components/icons/ChatBoxes';
import Pencil from '~/components/icons/Pencil';
import Spectacles from '~/components/icons/Spectacles';
import { Url } from '~/types/common';

const STYLES_FOOTER = css`
  border-top: 1px solid ${theme.border.default};
  padding: 24px 0 24px 0;
`;

const STYLES_FOOTER_LINK = css`
  font-size: 16px;
  display: block;
  text-decoration: none;
  color: ${theme.link.default};
  display: flex;
  align-items: center;
`;

const STYLES_FOOTER_ICON = css`
  display: flex;
  align-items: center;
  margin-right: 8px;
  margin-bottom: 1px;
`;

// Remove trailing slash and append .md
export function githubUrl(path: string) {
  if (path === '/versions/latest' || path === '/versions/unversioned') {
    path = '/versions/unversioned/index';
  }

  if (path.includes('/versions/latest/')) {
    path = path.replace('/versions/latest/', '/versions/unversioned/');
  } else if (path.match(/v\d+\.\d+\.\d+\/?$/) || path === '/') {
    if (path[path.length - 1] === '/') {
      path = `${path}index`;
    } else {
      path = `${path}/index`;
    }
  }

  let pathAsMarkdown = path.replace(/\/$/, '') + '.md';
  if (pathAsMarkdown.startsWith('/versions/latest')) {
    pathAsMarkdown = pathAsMarkdown.replace('/versions/latest', '/versions/unversioned');
  }

  return `https://github.com/expo/expo/edit/master/docs/pages${pathAsMarkdown}`;
}

// Add any page in the /sdk/ section that is not an actual Expo API
const SDK_BLACKLIST = ['Overview'];

type Props = {
  asPath: string;
  url?: Url;
  title: string;
  sourceCodeUrl?: string;
};

export default class DocumentationFooter extends React.PureComponent<Props> {
  render() {
    return (
      <footer css={STYLES_FOOTER}>
        <UL hideBullets>
          {this.renderForumsLink()}
          {this.maybeRenderIssuesLink()}
          {this.maybeRenderSourceCodeLink()}
          {this.maybeRenderGithubUrl()}
        </UL>
      </footer>
    );
  }

  private renderForumsLink() {
    if (!this.props.asPath.includes('/sdk/') || SDK_BLACKLIST.includes(this.props.title)) {
      return (
        <LI>
          <a
            css={STYLES_FOOTER_LINK}
            target="_blank"
            rel="noopener"
            href="https://forums.expo.dev/">
            <span css={STYLES_FOOTER_ICON}>
              <ChatBoxes fillColor="currentColor" />
            </span>
            Ask a question on the forums
          </a>
        </LI>
      );
    }

    return (
      <LI>
        <a
          css={STYLES_FOOTER_LINK}
          target="_blank"
          rel="noopener"
          href={'https://forums.expo.dev/tag/' + this.props.title}>
          <span css={STYLES_FOOTER_ICON}>
            <ChatBoxes fillColor="currentColor" />
          </span>
          Get help from the community and ask questions about {this.props.title}
        </a>
      </LI>
    );
  }

  private maybeRenderGithubUrl() {
    if (this.props.url) {
      return (
        <LI>
          <a
            css={STYLES_FOOTER_LINK}
            target="_blank"
            rel="noopener"
            href={githubUrl(this.props.url.pathname)}>
            <span css={STYLES_FOOTER_ICON}>
              <Pencil fillColor="currentColor" />
            </span>
            Edit this page
          </a>
        </LI>
      );
    }
  }

  private maybeRenderIssuesLink = () => {
    if (!this.props.asPath.includes('/sdk/') || SDK_BLACKLIST.includes(this.props.title)) {
      return;
    }

    return (
      <LI>
        <a
          css={STYLES_FOOTER_LINK}
          target="_blank"
          href={`https://github.com/expo/expo/labels/${this.props.title}`}>
          <span css={STYLES_FOOTER_ICON}>
            <Bug fillColor="currentColor" />
          </span>
          View open bug reports for {this.props.title}
        </a>
      </LI>
    );
  };

  private maybeRenderSourceCodeLink = () => {
    if (!this.props.asPath.includes('/sdk/') || !this.props.sourceCodeUrl) {
      return;
    }

    return (
      <LI>
        <a css={STYLES_FOOTER_LINK} target="_blank" href={`${this.props.sourceCodeUrl}`}>
          <span css={STYLES_FOOTER_ICON}>
            <Spectacles fillColor="currentColor" />
          </span>
          View source code for {this.props.title}
        </a>
      </LI>
    );
  };
}
