import { basename, dirname, extname, join, relative } from 'path';
import { loader } from 'webpack';

import parseDateAndTitle, { ParsedFilenameData } from 'parser';

export interface ParsedData extends ParsedFilenameData {
  __filename: string;
  __url: string;
}

/**
 * Parses the filename for a possible date timestamp and converts the rest into a human-readable title
 *
 * @param this - The webpack loader LoaderContext
 */
export default function parseFilename(this: loader.LoaderContext): ParsedData {
  const extension = extname(this.resourcePath);
  const current = basename(this.resourcePath, extension);
  const { date, title } = parseDateAndTitle(current);

  const parsedDate = Date.parse(date);

  // Throw an error, when the date is in an invalid format
  if (isNaN(parsedDate)) {
    throw new Error(`Date format is invalid: ${date}`);
  }

  return {
    __filename: title,
    __url: relative(process.cwd(), join(dirname(this.resourcePath), title)),
    date,
    title,
  };
}
