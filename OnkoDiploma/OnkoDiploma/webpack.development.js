/// <binding ProjectOpened='Watch - Development' /> 
"use strict";

var webpack = require('webpack');
var WebpackNotifierPlugin = require('webpack-notifier');
const path = require('path');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var extractTranslationKeysRegexPlugin = require('webpack-extract-translation-keys-regex-plugin');

//var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const NODE_ENV = (process.env && process.env.NODE_ENV) || 'development';
const ASSET_PATH = (process.env && process.env.ASSET_PATH) || '/';

module.exports = {
    target: 'web',
    entry: {
        indexPage: "./Webpack/index.jsx",
        vendor: ["react-loader-advanced", "react-tap-event-plugin", "moment"]//,
    },
    output:
        {
            path: path.resolve(__dirname, './wwwroot/dist/'),
            filename: "[name].js",
            publicPath: ''
        },

    devServer: {
        contentBase: ".",
        host: "localhost",
        port: 7000
    },
    resolve: {
		modules: ["node_modules", "./Webpack"],        
		extensions: ['.js', '.jsx', '.json', '.scss', '.css', '.less', '.jpg', '.gif', '.png']
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /(node_modules|bower_components)/,
                loader: "babel-loader",
                query: { cacheDirectory: false, presets: ['react', 'es2015', 'stage-0', 'stage-1'] }
            },
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: "css-loader"
                })
            },
            { test: /\.(png|jpg|gif)(\?[a-z0-9]+)?$/, loader: "file-loader?name=[name].[ext]&outputPath=Images/" },
            { test: /\.less$/, use: [{ loader: "style-loader" }, { loader: "css-loader" }, { loader: "less-loader" }] },
            {
                test: /\.(ttf)(\?[a-z0-9]+)?$/,
                loader: "url-loader?limit=65000&mimetype=application/octet-stream&name=[name].[ext]&outputPath=Fonts/"
            },
            {
                test: /\.(eot)(\?[a-z0-9]+)?$/,
                loader:
                    "url-loader?limit=65000&mimetype=application/vnd.ms-fontobject&name=[name].[ext]&outputPath=Fonts/"
            },
            {
                test: /\.(svg)(\?[a-z0-9]+)?$/,
                loader: "url-loader?limit=65000&mimetype=image/svg+xml&name=[name].[ext]&outputPath=Fonts/"
            },
            {
                test: /\.(woff)(\?[a-z0-9]+)?$/,
                loader: "url-loader?limit=65000&mimetype=application/font-woff&name=[name].[ext]&outputPath=Fonts/"
            },
            {
                test: /\.(woff2)(\?[a-z0-9]+)?$/,
                loader: "url-loader?limit=65000&mimetype=application/font-woff2&name=[name].[ext]&outputPath=Fonts/"
            },
            {
                test: /\.scss$/,
                exclude: /node_modules/,
                use: [
                    { loader: "style-loader" },
                    { loader: "css-loader?modules" },
                    { loader: "sass-loader" }
                ],
            },
        ],
        loaders: [],
    },
    plugins: [
        new webpack.DefinePlugin({ 'process.env.ASSET_PATH': JSON.stringify(ASSET_PATH) }),
        new webpack.ProvidePlugin({
            Promise: 'bluebird'
        }),
        new webpack.NormalModuleReplacementPlugin(/es6-promise$/, 'bluebird'),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NamedModulesPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
        new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /en|uk|ru/),
        new ExtractTextPlugin({ filename: '[name].css', allChunks: true, publicPath: "wwwroot/dist" }),
        new webpack.optimize.CommonsChunkPlugin({ name: "vendor", filename: "vendor.bundle.js" }),    
        // new BundleAnalyzerPlugin(),
        new WebpackNotifierPlugin(),
        //
        new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
        
    ]
};

