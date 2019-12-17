export default interface MDXOptions {
  /** additional compilers */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  compilers?: any[];
  /** filepath to write compiled file to */
  filepath?: string;
  /** whether to parse footnotes (e.g. [^footnote]\n\n[^footnote]: I'm a footnote) */
  footnotes?: boolean;
  /** rehype plugins */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  rehypePlugins?: any[];
  /** remark plugins */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  remarkPlugins?: any[];
}
