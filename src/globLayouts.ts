import globby from 'globby';
import { basename, extname, relative, resolve } from 'path';
import { loader } from 'webpack';

import MDXLayoutLoaderOptions from 'interfaces/options';

/**
 * Filters the given layoutsDir-directory for possible React component layouts and returns a Map.
 *
 * @param this - The LoaderContext of webpack, needed for receiving the source file's URL and emitting error messages
 * @param options - The options from the LoaderContext
 */
export default async function globLayouts(
  this: loader.LoaderContext,
  options: MDXLayoutLoaderOptions,
): Promise<Map<string, string>> {
  const { extensions, layoutsDir } = options;
  const fileExtensions = Array.isArray(extensions) ? extensions : [extensions];
  const absoluteLayoutsPath = resolve(process.cwd(), layoutsDir); // the absolute path to the layoutsDir
  const relativeLayoutsPath = relative(process.cwd(), absoluteLayoutsPath); // the relative path from the CWD to the layoutsDir
  const relativeResourcePath = relative(
    this.context, // dirname() is necessary to cut off the filename from the path
    absoluteLayoutsPath,
  ); // the relative path from the source file to the layoutsDir
  const results = new Map();

  try {
    // glob the relative layout path for files having one of the given extensions
    const layouts = await globby(relativeLayoutsPath, {
      expandDirectories: fileExtensions.map(extension => `*.${extension}`),
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
