const path = require('path');
const CleanPlugin = require('clean-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: './js/script.js',
  output: {
    filename: 'script.js',
    path: path.resolve(__dirname, 'bundled'),
    publicPath: 'bundled/',
  },
  devServer: {
    contentBase: './',
  },
  devtool: 'cheap-module-eval-source-map',
  plugins: [new CleanPlugin.CleanWebpackPlugin()],
};
