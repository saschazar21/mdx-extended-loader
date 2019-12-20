import { capitalCase } from 'capital-case';
import { basename, dirname, extname, join, relative } from 'path';
import { loader } from 'webpack';

export const dateRegExp = /^([0-9]{4}-[0-9]{1,2}-[0-9]{1,2})[-_+]?(.*)/i;

export interface ParsedData {
  __filename: string;
  __url: string;
  date: Date;
  title: string;
}

/**
 * Parses date and title out of a filename. Expects a format like YYYY-MM-DD_the-title.
 *
 * @param filename - The filename to parse for date and title
 */
export function parseDateAndTitle(
  filename: string
): { date: string; title: string } {
  const results = dateRegExp.exec(filename);

  if (!results || !results[1] || !results[2]) {
    throw new Error(
      `Date and title could not be parsed from: ${filename}!\nWill continue to use current filename.`
    );
  }

  return { date: results[1], title: basename(results[2], extname(results[2])) };
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
