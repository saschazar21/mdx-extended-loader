import { parseDateAndTitle } from 'parseFilename';
import MDXExtendedLoader from 'loader';

MDXExtendedLoader.prototype.parseDateAndTitle = parseDateAndTitle;

export { default as MDXExtendedLoaderOptions } from 'interfaces/options';
export default MDXExtendedLoader;
