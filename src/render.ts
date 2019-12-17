import mdx from '@mdx-js/mdx';
import { loader } from 'webpack';

import Options from 'interfaces/options';

export const DEFAULT_RENDERER = `
import React from 'react';
import { mdx } from '@mdx-js/react';
`;

export default async function render(
  this: loader.LoaderContext,
  content: string,
  options?: Options
): Promise<string> {
  const opts = { filepath: this.resourcePath, ...options };
  const result = await mdx(content, opts);

  const { renderer = DEFAULT_RENDERER } = opts as Options;

  return `
${renderer}
${result}
  `;
}
