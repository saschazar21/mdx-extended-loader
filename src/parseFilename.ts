import { capitalCase } from 'capital-case';
import { basename, dirname, extname, join, relative } from 'path';
import { loader } from 'webpack';

import parseDateAndTitle from 'parser';

export interface ParsedData {
  __filename: string;
  __url: string;
  date: Date;
  title: string;
}

/**
 * Parses the filename for a possible date timestamp and converts the rest into a human-readable title
 *
 * @param this - The webpack loader LoaderContext
 */
export default function parseFilename(this: loader.LoaderContext): ParsedData {
  const extension = extname(this.resourcePath);
  const current = basename(this.resourcePath, extension);
  const { date: parsedDate, title } = parseDateAndTitle(current);

  const date = Date.parse(parsedDate);

  // Throw an error, when the date is in an invalid format
  if (!date) {
    throw new Error(`Date format is invalid: ${parsedDate}`);
  }

  return {
    __filename: title,
    __url: relative(process.cwd(), join(dirname(this.resourcePath), title)),
    date: new Date(date),
    title: capitalCase(title)
  };
}
