import loaderUtils from 'loader-utils';
import globby from 'globby';
import matter from 'gray-matter';
import { basename, extname, dirname, relative, resolve } from 'path';
import { loader } from 'webpack';

import MDXLayoutLoaderOptions from 'interfaces/options';

function wrapContent(matter: any, content: string, layoutPath: string) {
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

async function globLayouts(
  this: loader.LoaderContext,
  { extensions, layoutsDir }: MDXLayoutLoaderOptions
): Promise<Map<string, string>> {
  const fileExtensions = Array.isArray(extensions) ? extensions : [extensions];
  const absoluteLayoutsPath = resolve(process.cwd(), layoutsDir);
  const relativeLayoutsPath = relative(process.cwd(), absoluteLayoutsPath);
  const relativeResourcePath = relative(
    dirname(this.resourcePath),
    absoluteLayoutsPath
  );
  const results = new Map();

  try {
    const layouts = await globby(relativeLayoutsPath, {
      expandDirectories: fileExtensions.map(extension => `*.${extension}`)
    });

    if (layouts.length === 0) {
      throw new Error(`No layouts found in: ${absoluteLayoutsPath}`);
    }

    layouts.forEach((url: string) => {
      const extension = extname(url);
      const name = basename(url, extension);
      const relativePath = `${relativeResourcePath}/${basename(url)}`;

      return results.set(name, relativePath);
    });
  } catch (e) {
    this.emitError(e);
  }

  return results;
}

export default async function MDXLayoutLoader(
  this: loader.LoaderContext,
  content: string,
  map?: any
) {
  const callback = this.async();
  const options = loaderUtils.getOptions(this) as MDXLayoutLoaderOptions;
  const layouts = await globLayouts.call(this, options);

  const { useDefault = true } = options;
  const { content: markdown, data = {} } = matter(content);

  if (!useDefault && !data.layout) {
    return callback!(null, content, map);
  }

  const layoutPath = layouts.get(data.layout || 'index');

  if (!layoutPath) {
    return callback!(
      new Error(
        `${
          data.layout ? `Layout '${data.layout}'` : 'Default layout'
        } not found!`
      )
    );
  }

  const wrappedContent = wrapContent(data, markdown, layoutPath);

  return callback!(null, wrappedContent, map);
}
