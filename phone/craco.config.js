const path = require('path')

const {
  addAfterLoader,
  removeLoaders,
  loaderByName,
  getLoaders,
  throwUnexpectedConfigError,
} = require('@craco/craco');

const throwError = (message) =>
  throwUnexpectedConfigError({
    packageName: 'craco',
    githubRepo: 'gsoft-inc/craco',
    message,
    githubIssueQuery: 'webpack',
  });

module.exports = {
  webpack: {
    configure: (webpackConfig, { paths }) => {
      const { hasFoundAny, matches } = getLoaders(webpackConfig, loaderByName('babel-loader'));
      if (!hasFoundAny) throwError('failed to find babel-loader');

      const { hasRemovedAny, removedCount } = removeLoaders(
        webpackConfig,
        loaderByName('babel-loader'),
      );
      if (!hasRemovedAny) throwError('no babel-loader to remove');
      if (removedCount !== 2) throwError('had expected to remove 2 babel loader instances');
      webpackConfig.resolve.plugins = webpackConfig.resolve.plugins.filter(
        ({ constructor: c }) => !c || c.name !== 'ModuleScopePlugin',
      );

      const tsLoader = {
        test: /\.tsx?$/,
        loader: require.resolve('ts-loader'),
        options: { transpileOnly: true },
      };

      const { isAdded: tsLoaderIsAdded } = addAfterLoader(
        webpackConfig,
        loaderByName('url-loader'),
        tsLoader,
      );

      if (!tsLoaderIsAdded) throwError('failed to add ts-loader');

      const { isAdded: babelLoaderIsAdded } = addAfterLoader(
        webpackConfig,
        loaderByName('ts-loader'),
        matches[1].loader, // babel-loader
      );

      if (!babelLoaderIsAdded) throwError('failed to add back babel-loader for non-application JS');

      paths.appBuild = webpackConfig.output.path = path.resolve('../resources/html')

      return webpackConfig;
    },
  },
  devServer: (devServerConfig) => {
    devServerConfig.writeToDisk = true
    return devServerConfig
  }
};
