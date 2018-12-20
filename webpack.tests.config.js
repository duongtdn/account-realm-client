const path = require("path");

module.exports = {
    entry: {
      test: ["mocha-loader!./tests/index.js"]
    },
    output: {
      filename: "test.bundle.js",
      path: path.resolve(__dirname, "tests"),
      // publicPath: "/tests/",      
    },
    module: {
      rules: [
        {
          test: /\.js?$/,
          use: 'babel-loader',
          exclude: /node_modules/
        }
      ]
    },
    mode: 'development',
    devtool: 'inline-source-map',
    devServer: {
      publicPath: "/assets/",
      historyApiFallback: true
    }
};