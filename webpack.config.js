const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = (env, options) => {
  return  {
    ...(options.mode == "development") && { devtool:  "eval-source-map" },
    entry: "./src/app.js",
    module: {
      rules: [
        {
          test: /\.(glsl|vs|fs|vert|frag)$/,
          exclude: /node_modules/,
          use: [
            'raw-loader',
            {
              loader: 'simplify-loader',
              options: {
                comment: true,
                whitespace: true,
                crlf: false,
                ignore: [
                  // three.js glsl macro
                  '#include <'
                ]
              }
            },
            'glslify-loader',
          ]
        },
        {
          test: /\.js?$/, 
          exclude: /node_modules/, 
          use: [
              { loader: "ifdef-loader", options: {DEBUG: (options.mode == "development")} } 
          ]
        }
      ]
    },
    plugins: [ 
      new HtmlWebpackPlugin({
        template: 'src/index.html'
      })
    ],
    optimization: {
      usedExports: true,
      sideEffects: false
    },
    devServer: { 
      hot: false,
      open: {
        app: {
          name: 'google chrome',
          arguments: [ '--auto-open-devtools-for-tabs'],
        },
      },
    }
  }
}