const path = require('path');
const CleanPlugin = require('clean-webpack-plugin');

module.exports = {
  mode: 'production',
  entry: './js/script.js',
  output: {
    filename: '[contenthash].js',
    path: path.resolve(__dirname, 'bundled'),
    publicPath: 'bundled/',
  },
  devServer: {
    contentBase: './',
  },
  devtool: 'cheap-source-map',
  plugins: [
    new CleanPlugin.CleanWebpackPlugin(),
  ]
};