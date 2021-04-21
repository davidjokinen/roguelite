const path = require("path");
const webpack = require("webpack");

const current = {
  entry: {
    'game':	path.join(__dirname, 'game.js'),
  },
  resolve: {
    alias: {
      // When building only use one location of react
      three: path.resolve('./node_modules/three'),
      react: path.resolve('./node_modules/react'),
      'core-js': path.resolve('./node_modules/core-js'),
      'react-dom': path.resolve('./node_modules/react-dom'),
      'react-is': path.resolve('./node_modules/react-is'),
    },
    extensions: ['.jsx', '.js', '.json']
  },
  output: {
    path: path.resolve(__dirname),
		filename: './static/dist/[name].js'
  },
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.(png|jpe?g|gif)$/i,
        loader: 'file-loader',
        options: {
          name: '[hash].[ext]',
          publicPath: './dist/images/',
          outputPath: './static/dist/images',
        },
      },
      {
        test: /\.jsx?$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          options: {
            "presets": [
              [
                "@babel/preset-env", 
                {
                  "useBuiltIns": "entry",
                  "corejs": 3,
                }
              ],
              "@babel/preset-react"
            ]
          }
        }
      }
    ]
  }
};

module.exports = current;