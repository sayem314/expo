import { render } from '@testing-library/react';
import * as React from 'react';

import DocumentationFooter, { githubUrl } from './DocumentationFooter';

describe('DocumentationFooter', () => {
  test('displays default links', () => {
    const { container } = render(
      <DocumentationFooter asPath="/" url={{ pathname: '/example/' }} title="test-title" />
    );

    expect(container).toHaveTextContent('Ask a question on the forums');
    expect(container).toHaveTextContent('Edit this page');
  });

  test('displays forums link with tag', () => {
    const { container } = render(<DocumentationFooter asPath="/sdk/" title="test-title" />);

    expect(container).toHaveTextContent(
      'Get help from the community and ask questions about test-title'
    );
  });

  test('displays issues link', () => {
    const { container } = render(<DocumentationFooter asPath="/sdk/" title="test-title" />);

    expect(container).toHaveTextContent('View open bug reports for test-title');
  });

  test('displays source code link', () => {
    const { container } = render(
      <DocumentationFooter asPath="/sdk/" title="test-title" sourceCodeUrl="/" />
    );

    expect(container).toHaveTextContent('View source code for test-title');
  });
});

describe('githubUrl', () => {
  const EDIT_URL_PREFIX = 'https://github.com/expo/expo/edit/master/docs/pages';

  test('non-versioned page', () => {
    expect(githubUrl('/guides')).toBe(EDIT_URL_PREFIX + '/guides.md');
  });

  test('nested non-versioned page', () => {
    expect(githubUrl('/build/introduction')).toBe(EDIT_URL_PREFIX + '/build/introduction.md');
  });

  test('versioned index page', () => {
    expect(githubUrl('/versions/v42.0.0')).toBe(EDIT_URL_PREFIX + '/versions/v42.0.0/index.md');
  });

  test('nested versioned page', () => {
    expect(githubUrl('/versions/v42.0.0/sdk/av')).toBe(
      EDIT_URL_PREFIX + '/versions/v42.0.0/sdk/av.md'
    );
  });

  test('latest index page', () => {
    expect(githubUrl('/versions/latest')).toBe(EDIT_URL_PREFIX + '/versions/unversioned/index.md');
  });

  test('nested latest page', () => {
    expect(githubUrl('/versions/latest/sdk/av')).toBe(
      EDIT_URL_PREFIX + '/versions/unversioned/sdk/av.md'
    );
  });

  test('unversioned index page', () => {
    expect(githubUrl('/versions/unversioned')).toBe(
      EDIT_URL_PREFIX + '/versions/unversioned/index.md'
    );
  });

  test('nested unversioned page', () => {
    expect(githubUrl('/versions/unversioned/sdk/av')).toBe(
      EDIT_URL_PREFIX + '/versions/unversioned/sdk/av.md'
    );
  });
});
