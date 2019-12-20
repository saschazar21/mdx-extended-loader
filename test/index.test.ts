import MDXLayoutLoaderOptions from '../src/interfaces/options';
import { parseDateAndTitle } from '../src/parseFilename';
import compiler from './loader';

const options: MDXLayoutLoaderOptions = {
  extensions: ['tsx', 'ts'],
  layoutsDir: 'test/layouts'
};

describe('MDX Extended Loader', () => {
  beforeAll(() => jest.setTimeout(15000));

  it('wraps using simple settings', async () => {
    const regex = /DEFAULT_TEMPLATE_MARKER/;
    const [stats, file] = await compiler('pages/blog/blog-post.mdx', options);
    const { errors } = stats.toJson();

    expect(errors.length).toEqual(0);
    expect(regex.test(file)).toBeTruthy();
  });

  it('wraps using custom settings', async () => {
    const regex = /CUSTOM_TEMPLATE_MARKER/;
    const [stats, file] = await compiler(
      'pages/blog/custom-blog-post.mdx',
      options
    );
    const { errors } = stats.toJson();

    expect(errors.length).toEqual(0);
    expect(regex.test(file)).toBeTruthy();
  });

  it('parses filename correctly', () => {
    const filename = '2019-12-20_a-title.mdx';

    const { date, title } = parseDateAndTitle(filename);

    expect(date).toEqual('2019-12-20');
    expect(title).toEqual('a-title');
  });

  it('parses filename without suffix correctly', () => {
    const filename = '2019-12-20_a-title';

    const { title } = parseDateAndTitle(filename);

    expect(title).toEqual('a-title');
  });

  it('fails parsing a filename with invalid date', () => {
    const filename = '19-12-20_a-title.mdx';

    expect(() => parseDateAndTitle(filename)).toThrowError();
  });
});
