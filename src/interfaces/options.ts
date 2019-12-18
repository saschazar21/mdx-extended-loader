import { OptionObject } from 'loader-utils';

import MDXOptions from 'interfaces/mdxOptions';

export default interface MDXExtendedLoaderOptions
  extends OptionObject,
    MDXOptions {
  /** supported file suffixes for layout files */
  extensions: string | string[];
  /** path to layouts folder relative to project root */
  layoutsDir: string;
  /** whether to attempt parsing the filename for date and title (e.g. files like XXXX-XX-XX-a-blog-post.mdx), default: true */
  parseFilename?: boolean;
  /** renderer for MDX, see https://github.com/mdx-js/mdx/blob/master/packages/loader/index.js#L4 */
  renderer?: string;
  /** use index as default template, when omitted in frontmatter, default: true */
  useDefault?: boolean;
}
