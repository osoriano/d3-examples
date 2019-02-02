const webpack = require('webpack')

const wpConfig = {

  entry: __dirname + '/src/index.js',

  output: {
    path: __dirname + '/build/tree',
    filename: 'index.js',
    chunkFilename: '[id].chunk.js',
    publicPath: '/'
  },

  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel',
        query: {
          presets: ['stage-0', 'es2015', 'es2016']
        }
      },
      {
        test: /\.css$/,
        loader: 'style!css'
      },
      {
        test: /\.styl$/,
        loader: 'style!css!stylus'
      }
    ]
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
    })
  ]
}

if (process.env.NODE_ENV !== 'production') {
  wpConfig.devtool = 'inline-source-map'
}

module.exports = wpConfig
