import { OptionObject } from 'loader-utils';

export default interface MDXLayoutLoaderOptions extends OptionObject {
  /** supported file suffixes for layout files */
  extensions: string | string[];
  /** path to layouts folder relative to project root */
  layoutsDir: string;
  /** use index as default template, when omitted in frontmatter, default: true */
  useDefault?: boolean;
}
