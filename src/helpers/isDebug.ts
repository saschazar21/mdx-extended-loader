const regex = /mdx-extended-loader/;

/**
 * Determines, if the DEBUG env is set and contains 'mdx-extended-loader' (e.g. whether to print debug messages)
 */
export default function isDebug(): boolean {
  const isDebug = !!(process.env.DEBUG && regex.test(process.env.DEBUG));
  return isDebug;
}
