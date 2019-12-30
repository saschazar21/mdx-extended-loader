import { basename, extname } from 'path';
import { capitalCase } from 'capital-case';

const dateRegExp = /^([0-9]{4}-[0-9]{1,2}-[0-9]{1,2})[-_+]?(.*)/i;

export interface ParsedFilenameData {
  date: string; // the date string
  title: string; // the title
}

/**
 * Parses date and title out of a filename. Expects a format like YYYY-MM-DD_the-title.
 *
 * @param filename - The filename to parse for date and title
 */
export default function parseDateAndTitle(
  filename: string,
): ParsedFilenameData {
  const results = dateRegExp.exec(filename);

  if (!results || !results[1] || !results[2]) {
    throw new Error(
      `Date and title could not be parsed from: ${filename}!\nWill continue to use current filename.`,
    );
  }

  const sanitizedTitle = basename(results[2], extname(results[2]));

  return { date: results[1], title: capitalCase(sanitizedTitle) };
}
