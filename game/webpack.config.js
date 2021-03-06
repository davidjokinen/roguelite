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
      'simple2d': path.resolve('../simple-2d'),
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
  },
  plugins: [
    new webpack.DefinePlugin({
      SOCKET_TYPE: JSON.stringify(`${process.env.SOCKET_TYPE || 'ws'}`),
      SOCKET_HOST: JSON.stringify(`${process.env.SOCKET_HOST || 'localhost'}`),
      SOCKET_PORT: JSON.stringify(`${process.env.SOCKET_PORT || '3000'}`)
    }),
  ]
};

module.exports = current;