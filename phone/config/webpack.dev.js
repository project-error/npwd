const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

console.log('the path', path.join(__dirname, '../src/'));

module.exports = {
  entry: path.join(__dirname, '../src/index.tsx'),
  output: {
    path: path.join(__dirname, '../public/'),
    filename: 'index.js',
  },
  devServer: {
    port: 3000,
    hot: true,
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'ts-loader',
          options: {
            transpileOnly: true,
          },
        },
      },
      {
        test: /\.(css|s[ac]ss)$/i,
        use: ['style-loader', 'css-loader', 'postcss-loader'],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
      inject: true,
    }),
  ],
  resolve: {
    extensions: ['.ts', '.tsx', '.js', 'jsx'],
    alias: {
      '@os': path.resolve(__dirname, '../src/os/'),
      '@ui': path.resolve(__dirname, '../src/ui/'),
      '@common': path.resolve(__dirname, '../src/common/'),
      '@utils': path.resolve(__dirname, '../src/utils/'),
      '@apps': path.resolve(__dirname, '../src/apps/'),
      '@typings': path.resolve(__dirname, '../../typings/'),
    },
  },
};
