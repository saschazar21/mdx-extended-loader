import MDXLayoutLoaderOptions from '../src/interfaces/options';
import compiler from './loader';

const options: MDXLayoutLoaderOptions = {
  extensions: ['tsx', 'ts'],
  layoutsDir: 'test/layouts'
};

describe('MDX Layout Loader', () => {
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
});
