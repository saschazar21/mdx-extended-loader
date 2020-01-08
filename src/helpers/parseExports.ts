import { readFile } from 'fs';

// The RegExp for parsing the exports out of the source file
export const regex = /^(?:(?:(?:module\.)?exports\.)|(?:export\s(?:const|let|var)\s))(.*?)\s?=/gim;

/**
 * Apply the RegExp to the source contents and return an array of found variable names
 *
 * @param contents - the source file to be parsed.
 */
function parseContents(contents: string): string[] {
  const exportKeys = [];
  let found;
  while ((found = regex.exec(contents)) !== null) {
    if (found.index === regex.lastIndex) {
      regex.lastIndex++;
    }

    if (found[1] && found[1].length) {
      exportKeys.push(found[1].trim());
    }
  }

  return exportKeys.filter((key: string) => key.length > 0);
}

/**
 * Wraps the callback function of fs.readFile in a Promise and filters the export keywords out of the layout file.
 *
 * @param layoutPath - The absolute path to the layout file to be parsed
 */
export default async function parseExports(
  layoutPath: string
): Promise<string[]> {
  return new Promise((resolve, reject): void =>
    readFile(layoutPath, 'utf-8', (err, contents): void => {
      if (err) {
        return reject(err);
      }

      const exportKeys = parseContents(contents);
      return resolve(exportKeys);
    })
  );
}
