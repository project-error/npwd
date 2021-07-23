require('dotenv').config();
const path = require('path');

const {
  addAfterLoader,
  removeLoaders,
  loaderByName,
  getLoaders,
  throwUnexpectedConfigError,
} = require('@craco/craco');

const SentryCliPlugin = require('@sentry/webpack-plugin');

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
      const releaseVersion = process.env.npm_package_version;

      process.env.REACT_APP_SENTRY_RELEASE = releaseVersion;

      if (process.env.SENTRY_RELEASE) {
        webpackConfig.plugins.push(
          new SentryCliPlugin({
            url: 'https://sentry.projecterror.dev',
            authToken: process.env.SENTRY_AUTH_TOKEN,
            org: 'project-error',
            project: 'npwd',

            release: releaseVersion,
            validate: true,
            urlPrefix: '~/resources/html',
            // webpack-specific configuration
            include: ['../resources/html'],
            ignore: ['node_modules'],
          }),
        );
      }

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

      paths.appBuild = webpackConfig.output.path = path.resolve('../resources/html');

      if (webpackConfig.mode === 'development') {
        webpackConfig.devtool = 'eval-source-map';
      }

      return webpackConfig;
    },
  },
  devServer: (devServerConfig) => {
    devServerConfig.writeToDisk = true;
    return devServerConfig;
  },
};
