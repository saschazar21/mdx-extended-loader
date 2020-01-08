import isDebug from '../../src/helpers/isDebug';

describe('isDebug', () => {
  beforeEach(() => {
    delete process.env.DEBUG;
  });

  it('returns true, when correct process.env.DEBUG is set', () => {
    process.env.DEBUG = 'mdx-extended-loader';

    expect(isDebug()).toBeTruthy();
  });

  it('returns false, when process.env.DEBUG is unset', () => {
    expect(isDebug()).toBeFalsy();
  });
});
