const path = require("path");
const webpack = require("webpack");
const HTMLWebpackPlugin = require("html-webpack-plugin");

const dev = process.env.NODE_ENV !== "production";

const HTMLWebpackPluginConfig = new HTMLWebpackPlugin({
  template: path.join(__dirname, "/public/index.html"),
  filename: "index.html",
  inject: "body",
});

module.exports = {
  devServer: {
    host: "localhost",
    port: "3000",
    hot: true,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
    historyApiFallback: true,
  },
  entry: ["@babel/polyfill", path.join(__dirname, "/src/index.ts")],
  module: {
    rules: [
      {
        test: /\.ts?$/,
        loader: "babel-loader",
      },
      {
        test: /\.js$/,
        use: ["source-map-loader"],
        enforce: "pre",
      },
      {
        test: /\.scss$/,
        loader: "style-loader!css-loader!sass-loader",
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        loader: "url-loader",
        options: {
          limit: 10000,
        },
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  output: {
    filename: "index.js",
    path: path.join(__dirname, "/dist"),
  },
  mode: "development",
  plugins: [HTMLWebpackPluginConfig, new webpack.HotModuleReplacementPlugin()],
};
