import { loader } from 'webpack';

const regex = /mdx-layout-loader/;

/**
 * Determines, if the DEBUG env is set and contains 'mdx-layout-loader' (e.g. whether to print debug messages)
 *
 * @param this - The webpack loader context
 */
export default function isDebug(this: loader.LoaderContext): boolean {
  const isDebug = !!(process.env.DEBUG && regex.test(process.env.DEBUG));
  return isDebug;
}
