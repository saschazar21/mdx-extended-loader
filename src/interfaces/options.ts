import { OptionObject } from 'loader-utils';

export default interface MDXLayoutLoaderOptions extends OptionObject {
  /** supported file suffixes for layout files */
  extensions: string | string[];
  /** path to layouts folder relative to project root */
  layoutsDir: string;
  /** whether to attempt parsing the filename for date and title (e.g. files like XXXX-XX-XX-a-blog-post.mdx), default: true */
  parseFilename?: boolean;
  /** use index as default template, when omitted in frontmatter, default: true */
  useDefault?: boolean;
}
