const path = require('path');

const { getLoader, loaderByName } = require('@craco/craco');

const CracoAlias = require('craco-alias');

module.exports = {
  webpack: {
    configure: (webpackConfig, { paths }) => {
      webpackConfig.resolve.plugins = webpackConfig.resolve.plugins.filter(
        ({ constructor: c }) => !c || c.name !== 'ModuleScopePlugin',
      );

      const { isFound, match } = getLoader(webpackConfig, loaderByName('babel-loader'));
      if (isFound) {
        const include = Array.isArray(match.loader.include)
          ? match.loader.include
          : [match.loader.include];
        match.loader.include = include.concat([path.join(__dirname, '../typings')]);
      }

      paths.appBuild = webpackConfig.output.path = path.resolve('../resources/html');

      if (webpackConfig.mode === 'development' && !process.env.REACT_IN_GAME) {
        webpackConfig.devtool = 'eval';
      } else if (webpackConfig.mode === 'development') {
        webpackConfig.devtool = 'eval-source-map';
      }

      return webpackConfig;
    },
  },
  plugins: [
    {
      plugin: CracoAlias,
      options: {
        source: 'tsconfig',
        baseUrl: './src',
        tsConfigPath: './tsconfig.paths.json',
      },
    },
  ],
  devServer: (devServerConfig) => {
    devServerConfig.writeToDisk = true;
    return devServerConfig;
  },
};
