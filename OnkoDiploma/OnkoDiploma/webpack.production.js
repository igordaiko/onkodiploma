/// <binding ProjectOpened='Watch - Development' /> 
"use strict";
var webpack = require('webpack');
const path = require('path');
var WebpackCleanupPlugin = require('webpack-cleanup-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var extractTranslationKeysRegexPlugin = require('webpack-extract-translation-keys-regex-plugin');
var UglifyJSPlugin = require('uglifyjs-webpack-plugin');
var CompressionPlugin = require("compression-webpack-plugin");
const NODE_ENV = process.env.NODE_ENV || 'development';
const ASSET_PATH = process.env.ASSET_PATH || '/';
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
        port: 8070
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
            query: {cacheDirectory: false, presets: [ 'react','es2015', 'stage-0','stage-1']}
        },
        { test: /\.(png|jpg|gif)(\?[a-z0-9]+)?$/, loader: "file-loader?name=[name].[ext]&outputPath=Images/" },
        { test: /\.css$/, use: ExtractTextPlugin.extract({use: [{loader: 'css-loader', options: {sourceMap: false}}]})},
        { test: /\.less$/, use: [{ loader: "style-loader" }, { loader: "css-loader" }, { loader: "less-loader" }] },
        { test: /\.(ttf)(\?[a-z0-9]+)?$/, loader: "url-loader?limit=65000&mimetype=application/octet-stream&name=[name].[ext]&outputPath=Fonts/"},
        { test: /\.(eot)(\?[a-z0-9]+)?$/, loader: "url-loader?limit=65000&mimetype=application/vnd.ms-fontobject&name=[name].[ext]&outputPath=Fonts/"},
        { test: /\.(svg)(\?[a-z0-9]+)?$/, loader: "url-loader?limit=65000&mimetype=image/svg+xml&name=[name].[ext]&outputPath=Fonts/"},
        { test: /\.(woff)(\?[a-z0-9]+)?$/, loader: "url-loader?limit=65000&mimetype=application/font-woff&name=[name].[ext]&outputPath=Fonts/"},
        { test: /\.(woff2)(\?[a-z0-9]+)?$/, loader: "url-loader?limit=65000&mimetype=application/font-woff2&name=[name].[ext]&outputPath=Fonts/"},
        {test: /\.scss$/,
            exclude: /node_modules/,
            use: [
                { loader: "style-loader" },
                { loader: "css-loader?modules" },
                { loader: "sass-loader" }],
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
        //new webpack.NormalModuleReplacementPlugin(/es6-promise$/, 'bluebird'),
        //new webpack.ProvidePlugin({
        //    "Promise": "babel-polyfill",
        //    'fetch': 'imports-loader?this=>global!exports-loader?global.fetch!whatwg-fetch'
        //}),
        new webpack.NoEmitOnErrorsPlugin(),
        new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
        new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /en|uk|ru/),
        new ExtractTextPlugin({ filename: '[name].css', allChunks: true, publicPath: "TestReact" }),
        new webpack.optimize.ModuleConcatenationPlugin(),
        new webpack.optimize.CommonsChunkPlugin({ name: "vendor", filename: "vendor.js" }),
        //new UglifyJSPlugin(),
        new UglifyJSPlugin({
        	mangle: {
        			toplevel: true,
                    sort: true,
                    eval: true,
                    properties: true,
			        except: ['$super', '$', 'exports', 'require']
        	},
                compress: {
                    warnings: false,
                    properties: true,
                    sequences: true,
                    dead_code: true,
                    conditionals: true,
                    comparisons: true,
                    evaluate: true,
                    booleans: true,
                    unused: true,
                    loops: true,
                    hoist_funs: true,
                    cascade: true,
                    if_return: true,
                    join_vars: true,
                    drop_console: true,
                    drop_debugger: true,
                    unsafe: true,
                    hoist_vars: true,
                    negate_iife: true,

                },
                output: {
                    comments: false,
                    space_colon: false
                },
            compressor: {
                warnings: false
            }
        }),
        new webpack.LoaderOptionsPlugin({
            minimize: true,
            debug: false
        }),
        new CompressionPlugin({
            asset: "[path].gz[query]",
            algorithm: "gzip",
            test: /\.(js|html)$/,
            threshold: 10240,
            minRatio: 0.8
        }),
        new WebpackCleanupPlugin()
         
         
]
};

