const path = require('path');
const { argv } = require('yargs');
const isDevelopment = argv.mode === 'development';

const CleanWebpackPlugin = require('clean-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { default: ImageminPlugin } = require('imagemin-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const autoprefixer = require('autoprefixer');
const postcssPresetEnv = require('postcss-preset-env');
const postcssImport = require('postcss-import');
const cssNano = require('cssnano');

const config = {
  context: path.resolve(__dirname, 'dist'),
  entry: {
    build: [
      '../src/js/app.js',
    ],
  },
  output: {
    filename: 'js/[name].js',
    chunkFilename: 'js/[name].js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: './',
  },
  resolve: {
    alias: {
      styles: '../css/main.css',
    },
  },
  devServer: {
    watchContentBase: true,
    contentBase: path.join(__dirname, '/src'),
    port: 3030,
    overlay: true,
    open: true,
    historyApiFallback: true,
    publicPath: '/',
  },
  module: {
    rules: [{
      test: /\.js$/,
      exclude: /node_modules/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env'],
        },
      },
    },
    {
      test: /\.css$/,
      use: [{
        loader: 'style-loader',
        options: {
          sourceMap: true,
          convertToAbsoluteUrls: true,
        },
      },
      MiniCssExtractPlugin.loader,
      {
        loader: 'css-loader',
        options: {
          sourceMap: true,
          importLoaders: 1,
        },
      },
      {
        loader: 'postcss-loader',
        options: {
          ident: 'postcss',
          plugins: [
            !isDevelopment ? postcssImport : () => {},
            !isDevelopment ? cssNano : () => {},
            autoprefixer({
              browsers: ['last 2 versions'],
            }),
            postcssPresetEnv({
              stage: 3,
              browsers: ['last 5 versions', '> 5%'],
              features: {
                'custom-media-queries': true,
              },
            }),
          ],
        },
      },
      ],
    },
    {
      test: /\.(jpe?g|png|gif|svg)$/i,
      use: [{
        loader: 'file-loader',
        options: {
          publicPath: '../img',
          name: '[name].[ext]',
          outputPath: 'img/',
        },
      },
      'img-loader',
      ],
    }],
  },
  performance: {
    hints: false,
  },
  devtool: isDevelopment ? 'eval-sourcemap' : false,
  plugins: [
    !isDevelopment ? new CleanWebpackPlugin(['dist']) : () => {},
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'src/index.html'),
    }),
    new MiniCssExtractPlugin({
      filename: 'css/[name].css',
      allChunks: true,
    }),
    new CopyWebpackPlugin([{
      from: '../src/img',
      to: 'img',
    }]),
    new CopyWebpackPlugin([{
      from: '../src/data',
      to: 'data',
    }]),
    !isDevelopment ? new ImageminPlugin({
      test: /\.(jpe?g|png|gif|svg)$/i,
    }) : () => {},
  ],
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        sourceMap: isDevelopment,
        uglifyOptions: {
          output: {
            comments: false,
          },
          compress: {
            inline: false,
            drop_console: true,
          },
        },
      }),
    ],
    splitChunks: {
      chunks: 'all',
    },
  },
};

module.exports = config;
