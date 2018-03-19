const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");

const extractSass = new ExtractTextPlugin({
   filename: 'styles/[name].bundle.css',
   allChunks: true,
   //filename: "[name].[contenthash].css",
   //disable: process.env.NODE_ENV === "development"
});

module.exports = {
   entry: ['./src/styles/index.scss', './src/scripts/index.ts'],
   module: {
      rules: [{
         test: /\.tsx?$/,
         use: 'ts-loader',
         exclude: /node_modules/
      }, {
         test: /\.scss$/,
         use: extractSass.extract({
            use: [{
               loader: 'css-loader',
               options: {
                  url: false
               }
            }, 'sass-loader']
         })
      }]
   },
   resolve: {
      extensions: ['.ts', '.tsx', '.js']
   },
   output: {
      filename: 'scripts/[name].bundle.js',
      path: path.resolve(__dirname, './www/')
   },
   plugins: [
      new CleanWebpackPlugin(['www']),
      new CopyWebpackPlugin([{
         context: './src/',
         from: '**/*',
         ignore: ['scripts/**/*', 'styles/**/*']
      }, {
         context: './node_modules/jsxc/dist/',
         from: '**/*',
         to: 'jsxc/'
      }, {
         context: './node_modules/jsxc-plugin-single-page/dist/',
         from: '**/*',
         to: 'account-manager/'
      }]),
      extractSass
   ]
};
