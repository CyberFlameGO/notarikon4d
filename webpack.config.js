const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const autoprefixer = require('autoprefixer');
const path = require('path');

module.exports = {
  entry: "./src/main",
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: "bundle.min.js"
  },
  plugins: [
    new ExtractTextPlugin({
      filename: 'bundle.min.css',
    }),
    new CopyWebpackPlugin([
      {
        from: 'src/index.html',
        to: 'index.html',
      },
    ]),
  ],
  module: {
    rules: [{
      test: /\.jsx?$/,
      exclude: /node_modules/,
      loader: 'babel-loader',
        query: {
          presets: [
            'es2015',
            'stage-0',
          ],
        },
      }, {
      test: /\.scss$/,
      loaders: ExtractTextPlugin.extract(['css-loader', 'resolve-url-loader', 'sass-loader?sourceMap']),
    }, {
      test: /\.(jpe?g|png|gif|svg)$/i,
      loaders: [
        'file-loader?hash=sha512&digest=hex&name=[hash].[ext]',
        'image-webpack-loader?bypassOnDebug',
      ],
    }, {
      test: /\.(eot|svg|ttf|woff|otf?)$/,
      loader: 'file-loader?name=fonts/[name].[ext]',
    }, {
      test: /favicon\.png/,
      loader: 'file-loader?name=[name].[ext]',
    }],
  },
};