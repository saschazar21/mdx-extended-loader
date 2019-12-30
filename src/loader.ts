import { getOptions } from 'loader-utils';
import matter from 'gray-matter';
import { extname, relative } from 'path';
import { loader } from 'webpack';

import MDXLayoutLoaderOptions from 'interfaces/options';
import isDebug from 'helpers/isDebug';
import globLayouts from 'globLayouts';
import parseFilename, { ParsedData } from 'parseFilename';
import render from 'render';

/**
 * Wraps the content in a React component layout, together with the Frontmatter data as props.
 *
 * @param matter - the parsed frontmatter object
 * @param content - the string representation of the Markdown content (without frontmatter)
 * @param layoutPath - the file path to the layout file, relative to the source file
 */
function wrapContent(props: any, content: string, layoutPath: string): string {
  return `
import Layout from './${layoutPath}';
const props = ${JSON.stringify(props)};
export default ({ children }) => Layout(Object.assign({}, props, { children }));

${content}
  `;
}

/**
 * The main webpack loader. It filters for possible React component layout files in the given layoutsDir directory, parses Frontmatter and wraps the content in a React component.
 *
 * @param content - The string representation of the source file's content
 * @param map - The SourceMap of the webpack LoaderContext
 */
export default async function MDXExtendedLoader(
  this: loader.LoaderContext,
  content: string,
  map?: any,
): Promise<void> {
  const debug = isDebug.call(this);
  const callback = this.async() as loader.loaderCallback;
  const options = getOptions(this) as MDXLayoutLoaderOptions;
  const layouts = await globLayouts.call(this, options);

  // parse filename (e.g. XXXX-XX-XX-a-blog-post.mdx) & use default layout (e.g. layouts/index) is set to true by default
  const { parseFilename: shouldParse = true, useDefault = true } = options;

  // parse the Frontmatter and the Markdown contents
  const { content: markdown, data: frontmatter = {} } = matter(content);

  // gather information from the filename and store it in an object temporarily
  const parsed: ParsedData = {} as ParsedData;
  if (shouldParse) {
    try {
      const p = parseFilename.call(this);
      Object.assign(parsed, p);

      if (debug) {
        console.log('Parsed', this.resourcePath, 'to', p.date, p.__url);
      }
    } catch (e) {
      this.emitWarning(e);
    }
  }

  // whenever useDefault has been explicitely turned off and no layout was set in the Frontmatter, render immediately without further processing
  if (!useDefault && !frontmatter.layout) {
    try {
      const rendered = await render.call(this, content, options);
      return callback(null, rendered, map);
    } catch (e) {
      return callback(e);
    }
  }

  // otherwise try to fetch information for the desired layout in the glob results
  const layoutPath = layouts.get(frontmatter.layout || 'index');

  if (!layoutPath) {
    return callback(
      new Error(
        `${
          frontmatter.layout
            ? `Layout '${frontmatter.layout}'`
            : 'Default layout'
        } not found!`,
      ),
    );
  }

  if (debug) {
    console.log(
      'Using layout',
      layoutPath,
      'for',
      relative(process.cwd(), this.resourcePath),
    );
  }

  // assemble props from parsing information and frontmatter
  const props: any = { ...parsed, ...frontmatter };
  debug && console.log(JSON.stringify(props));

  // if the desired layout has been successfully found, wrap the contents in the layout
  const wrappedContent = wrapContent(props, markdown, layoutPath);
  debug && console.log(wrappedContent);

  try {
    const filepath =
      parsed.__url && `${parsed.__url}${extname(this.resourcePath)}`;

    // render and compile the content
    const renderedContent = await render.call(
      this,
      wrappedContent,
      Object.assign({}, filepath && { filepath }, options),
    );

    return callback(null, renderedContent, map);
  } catch (e) {
    return callback(e);
  }
}
