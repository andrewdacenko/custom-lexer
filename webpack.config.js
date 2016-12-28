const {resolve} = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const isProd = process.env.NODE_ENV === 'production';

const entry = [].concat(
    isProd ? [] : [
            'react-hot-loader/patch',
            // activate HMR for React

            'webpack-dev-server/client?http://localhost:8080',
            // bundle the client for webpack-dev-server
            // and connect to the provided endpoint

            'webpack/hot/only-dev-server',
            // bundle the client for hot reloading
            // only- means to only hot reload for successful updates
        ],
    './index.js'
);

const plugins = [
    new HtmlWebpackPlugin({
        // Required
        inject: false,
        template: require('html-webpack-template'),
        appMountId: 'app',
        devServer: isProd ? undefined : 'http://localhost:8080',
        title: 'Sigma Analyzer',
        minify: {
            collapseWhitespace: true
        }
    })
].concat(isProd ? [
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        })
    ] : [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NamedModulesPlugin(),
    ]);

module.exports = {
    entry,
    output: {
        filename: 'bundle.js',
        // the output bundle

        path: resolve(__dirname, 'dist'),

        publicPath: './'
        // necessary for HMR to know where to load the hot update chunks
    },

    context: resolve(__dirname, 'src'),

    devtool: 'source-map',

    devServer: {
        hot: true,
        // activate hot reloading

        contentBase: resolve(__dirname, 'dist'),
        // match the output path

        publicPath: '/'
        // match the output `publicPath`
    },

    module: {
        loaders: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                query: {
                    presets: [
                        [
                            "es2015",
                            {
                                "modules": false
                            }
                        ],
                        "stage-2",
                        "react"
                    ],
                    plugins: [
                        "react-hot-loader/babel"
                    ]
                },
                exclude: /node_modules/
            },
            {
                test: /\.css$/,
                loaders: [
                    'style-loader',
                    'css-loader?modules',
                    'postcss-loader',
                ],
            },
        ],
    },

    plugins
};