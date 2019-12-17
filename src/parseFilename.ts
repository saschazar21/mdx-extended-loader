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
 * Parses the filename for a possible date timestamp and converts the rest into a human-readable title
 *
 * @param this - The webpack loader LoaderContext
 */
export default function parseFilename(this: loader.LoaderContext): ParsedData {
  const extension = extname(this.resourcePath);
  const current = basename(this.resourcePath, extension);
  const parts = dateRegExp.exec(current);

  // Throw an error, when either date or title could not have been parsed
  if (!parts || !parts[1] || !parts[2]) {
    throw new Error(
      'Could not parse date timestamp and/or title!\nFile will be stored under original filename!'
    );
  }

  const date = Date.parse(parts[1]);

  // Throw an error, when the date is in an invalid format
  if (!date) {
    throw new Error(`Date format is invalid: ${parts[1]}`);
  }

  return {
    __filename: parts[2],
    __url: relative(process.cwd(), join(dirname(this.resourcePath), parts[2])),
    date: new Date(date),
    title: capitalCase(parts[2])
  };
}
