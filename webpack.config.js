const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: "./src/app.js",
  module: {
    rules: [
      {
        test: /\.(glsl|vs|fs|vert|frag)$/,
        exclude: /node_modules/,
        use: [
          'raw-loader',
          'glslify-loader'
        ]
      }
    ]
  },
  plugins: [ 
    new HtmlWebpackPlugin({
      template: 'src/index.html'
    })
  ],
  devServer: { 
    hot: false,
  }
}