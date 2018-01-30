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
         test: /\.ts$/,
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
      extensions: ['.ts', '.js']
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
      }]),
      extractSass
   ]
};
