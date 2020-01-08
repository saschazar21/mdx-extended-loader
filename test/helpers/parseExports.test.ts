import { join } from 'path';

import parseExports from '../../src/helpers/parseExports';

const layoutDir = join(__dirname, '../layouts');

describe('parseExports', () => {
  it('filters exports', async () => {
    const parsedExports = await parseExports(join(layoutDir, './index.tsx'));

    expect(parsedExports).toEqual(['meta']);
  });

  it('throws error, when no layout file does not exist', async () => {
    await expect(
      parseExports(join(layoutDir, './something.tsx'))
    ).rejects.toThrowError();
  });
});
