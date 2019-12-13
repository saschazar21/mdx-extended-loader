import loaderUtils from 'loader-utils';
import globby from 'globby';
import matter from 'gray-matter';
import { basename, extname, dirname, relative, resolve } from 'path';
import { loader } from 'webpack';

import MDXLayoutLoaderOptions from 'interfaces/options';

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

  return `
import Layout from './${layoutPath}';

export default React.createElement(
  Layout,
  ${JSON.stringify(props)},
);

${content}
  `;
}

/**
 * Filters the given layoutsDir-directory for possible React component layouts and returns a Map.
 *
 * @param this - The LoaderContext of webpack, needed for receiving the source file's URL and emitting error messages
 * @param options - The options from the LoaderContext
 */
async function globLayouts(
  this: loader.LoaderContext,
  options: MDXLayoutLoaderOptions
): Promise<Map<string, string>> {
  const { extensions, layoutsDir } = options;
  const fileExtensions = Array.isArray(extensions) ? extensions : [extensions];
  const absoluteLayoutsPath = resolve(process.cwd(), layoutsDir); // the absolute path to the layoutsDir
  const relativeLayoutsPath = relative(process.cwd(), absoluteLayoutsPath); // the relative path from the CWD to the layoutsDir
  const relativeResourcePath = relative(
    dirname(this.resourcePath), // dirname() is necessary to cut off the filename from the path
    absoluteLayoutsPath
  ); // the relative path from the source file to the layoutsDir
  const results = new Map();

  try {
    // glob the relative layout path for files having one of the given extensions
    const layouts = await globby(relativeLayoutsPath, {
      expandDirectories: fileExtensions.map(extension => `*.${extension}`)
    });

    // when no layouts found, throw error
    if (layouts.length === 0) {
      throw new Error(`No layouts found in: ${absoluteLayoutsPath}`);
    }

    // for every layout file, filter its name and relative path to the source file, and add it to the Map
    layouts.forEach((url: string) => {
      const extension = extname(url);
      const name = basename(url, extension);
      const relativePath = `${relativeResourcePath}/${basename(url)}`;

      return results.set(name, relativePath);
    });
  } catch (e) {
    // whenever an error happened, print it, but don't stop compiling
    this.emitError(e);
  }

  return results;
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
  map?: any
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
        } not found!`
      )
    );
  }

  // if the desired layout has been successfully found, wrap the contents in the layout
  const wrappedContent = wrapContent(data, markdown, layoutPath);

  return callback(null, wrappedContent, map);
}
