import mdx from '@mdx-js/mdx';
import { loader } from 'webpack';

import Options from 'interfaces/options';
import isDebug from 'helpers/isDebug';

export const DEFAULT_RENDERER = `
import React from 'react';
import { mdx } from '@mdx-js/react';
`;

/**
 * renders the MDX document into a React component
 *
 * @param this - The webpack loader LoaderContext
 * @param content - The source file from webpack, comes already equipped with layout
 * @param options - The options object for the @mdx-js/mdx compiler
 */
export default async function render(
  this: loader.LoaderContext,
  content: string,
  options?: Options
): Promise<string> {
  const debug = isDebug.call(this);
  const opts = { filepath: this.resourcePath, ...options };
  const result = await mdx(content, opts);

  debug && console.log(opts);
  debug && console.log(result);

  const { renderer = DEFAULT_RENDERER } = opts as Options;

  return `
${renderer}
${result}
  `;
}
