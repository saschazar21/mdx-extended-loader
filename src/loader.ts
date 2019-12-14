import loaderUtils from 'loader-utils';
import matter from 'gray-matter';
import { loader } from 'webpack';

import MDXLayoutLoaderOptions from 'interfaces/options';
import globLayouts from './globLayouts';

/**
 * Wraps the content in a React component layout, together with the Frontmatter data as props.
 *
 * @param matter - the parsed frontmatter object
 * @param content - the string representation of the Markdown content (without frontmatter)
 * @param layoutPath - the file path to the layout file, relative to the source file
 */
function wrapContent(matter: any, content: string, layoutPath: string): string {
  // exclude any children data from the frontmatter, to not confuse the React component
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { children, ...props } = matter;
  const exports = Object.keys(props).map(
    key => `export const ${key} = ${JSON.stringify(props[key])};`,
  );

  return `
import Layout from './${layoutPath}';
export default Layout;
${exports.join('\n')}
${content}
  `;
}

/**
 * The main webpack loader. It filters for possible React component layout files in the given layoutsDir directory, parses Frontmatter and wraps the content in a React component.
 *
 * @param content - The string representation of the source file's content
 * @param map - The SourceMap of the webpack LoaderContext
 */
export default async function MDXLayoutLoader(
  this: loader.LoaderContext,
  content: string,
  map?: any,
): Promise<void> {
  const callback = this.async() as loader.loaderCallback;
  const options = loaderUtils.getOptions(this) as MDXLayoutLoaderOptions;
  const layouts = await globLayouts.call(this, options);

  // use default layout (e.g. layouts/index) is set to true by default
  const { useDefault = true } = options;

  // parse the Frontmatter and the Markdown contents
  const { content: markdown, data = {} } = matter(content);

  // whenever useDefault has been explicitely turned off and no layout was set in the Frontmatter, return without further processing
  if (!useDefault && !data.layout) {
    return callback(null, content, map);
  }

  // otherwise try to fetch information for the desired layout in the glob results
  const layoutPath = layouts.get(data.layout || 'index');

  if (!layoutPath) {
    return callback(
      new Error(
        `${
          data.layout ? `Layout '${data.layout}'` : 'Default layout'
        } not found!`,
      ),
    );
  }

  // if the desired layout has been successfully found, wrap the contents in the layout
  const wrappedContent = wrapContent(data, markdown, layoutPath);

  return callback(null, wrappedContent, map);
}
