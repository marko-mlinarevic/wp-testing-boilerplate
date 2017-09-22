const DEV = process.env.NODE_ENV !== 'production';

const path = require('path');

const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const appPath = `${path.resolve(__dirname)}`;

// Dev Server
const proxyUrl = 'www.wpwp2.loc'; // local dev url example: dev.wordpress.com

// Theme
const themeName = 'wpwp2';
const themePath = `/wp-content/themes/${themeName}/skin`;
const themeFullPath = `${appPath}${themePath}`;
const themePublicPath = `${themePath}/public/`;
const themeEntry = `${themeFullPath}/assets/application.js`;
const themeAdminEntry = `${themeFullPath}/assets/application-admin.js`;
const themeOutput = `${themeFullPath}/public`;

// Outputs
const outputJs = 'scripts/[name].js';
const outputCss = 'styles/[name].css';
const outputFile = '[name].[ext]';
const outputImages = `images/${outputFile}`;
const outputFonts = `fonts/${outputFile}`;

const allModules = {
  rules: [
      {
          test: /\.(js|jsx)$/,
          use: 'babel-loader',
          exclude: /node_modules/
      },
      {
          test: /\.json$/,
          use: 'json-loader'
      },
      {
          test: /\.(png|svg|jpg|jpeg|gif|ico)$/,
          exclude: [/efonts/],
          use: `file-loader?name=${outputImages}`
      },
      {
          test: /\.(eot|svg|otf|ttf|woff|woff2)$/,
          exclude: [/images/],
          use: `file-loader?name=${outputFonts}`
      },
      {
          test: /\.scss$/,
          use: ExtractTextPlugin.extract({
              fallback: 'style-loader',
              use: ['css-loader', 'postcss-loader', 'sass-loader']
          })
      }
  ]
};

const allPlugins = [
  new CleanWebpackPlugin([themeOutput]),
  new ExtractTextPlugin(outputCss),

  // Use BrowserSync For assets
  new BrowserSyncPlugin({
    host: 'localhost',
    port: 3000,
    proxy: proxyUrl,
    files: [
      {
        match: ['wp-content/themes/**/*.php', 'wp-content/plugins/**/*.php']
      }
    ]
  }),
  new webpack.optimize.ModuleConcatenationPlugin(),

  // Analyse assets
  //   new BundleAnalyzerPlugin(),

  // Is using vendor files, but prefered to use npm
   new CopyWebpackPlugin([{
    from: `${pathTheme}/assets/scripts/vendors`,
    to: `${pathTheme}/public/scripts/vendors`
   }])
];

// Use only for production build
if (!DEV) {
  allPlugins.push(
    new UglifyJSPlugin({
      comments: false,
      sourceMap: true
    })
  );
}

module.exports = [

  // Theme Skin
  {
    context: path.join(__dirname),
    entry: {
      application: [themeEntry],
      applicationAdmin: [themeAdminEntry]
    },
    output: {
      path: themeOutput,
      publicPath: themePublicPath,
      filename: outputJs
    },

    module: allModules,

    plugins: allPlugins
  }
];
