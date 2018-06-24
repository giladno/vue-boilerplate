const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const Dotenv = require('dotenv-webpack');

const {name} = require('./package.json');

const NODE_ENV = (process.env.NODE_ENV == 'development' && process.env.NODE_ENV) || 'production';

module.exports = {
    mode: NODE_ENV,
    entry: ['./src/index.js'],
    devtool: {development: 'inline-source-map'}[NODE_ENV],
    output: {
        path: path.join(__dirname, 'dist'),
        publicPath: '/',
        ...{
            development: {filename: 'bundle.js'},
            production: {filename: '[name].[hash].js'},
        }[NODE_ENV],
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                use: ['vue-loader'],
                include: path.join(__dirname, 'src'),
            },
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                use: ['babel-loader'],
                include: path.join(__dirname, 'src'),
            },
            {
                test: /\.css$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader'],
            },
            {
                test: /\.less$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader', 'less-loader'],
            },
            {
                test: /\.(sass|scss)$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
            },
            {
                test: /\.(jpe?g|png|gif|woff2?|eot|ttf|svg)$/,
                use: 'file-loader?limit=10000',
            },
        ],
    },
    plugins: [
        new VueLoaderPlugin(),
        new Dotenv({
            path: `./.env.${NODE_ENV}`,
        }),
        new webpack.DefinePlugin({
            'process.env': {NODE_ENV: JSON.stringify(NODE_ENV)},
            __DEV__: NODE_ENV == 'development',
        }),
        new (require('html-webpack-plugin'))({
            inject: false,
            template: require('html-webpack-template'),
            appMountId: 'app',
            title: name,
            mobile: true,
            minify: {collapseWhitespace: true},
        }),
        new MiniCssExtractPlugin({
            filename: '[name].css',
            chunkFilename: '[id].css',
        }),
        new webpack.ProvidePlugin({
            _: 'lodash',
            Vue: [
                {development: 'vue/dist/vue.runtime.esm.js', production: 'vue/dist/vue.runtime.min.js'}[NODE_ENV],
                'default',
            ],
        }),
        ...({
            development: [new webpack.NamedModulesPlugin(), new webpack.NoEmitOnErrorsPlugin()],
        }[NODE_ENV] || []),
    ],
    resolve: {
        modules: [path.resolve('./src'), 'node_modules'],
        extensions: ['.js', '.jsx', '.css', '.less', '.sass', '.scss'],
    },
    ...({
        development: {
            devtool: 'inline-source-map',
            devServer: {
                host: '0.0.0.0',
                port: 3000,
                historyApiFallback: true,
            },
        },
        production: {
            devtool: false,
            optimization: {
                minimizer: [
                    new UglifyJsPlugin({
                        sourceMap: true,
                        uglifyOptions: {
                            compress: {
                                warnings: false,
                                dead_code: true,
                                properties: true,
                                conditionals: true,
                                booleans: true,
                                loops: true,
                                unused: true,
                                if_return: true,
                                negate_iife: true,
                                drop_console: true,
                                passes: 2,
                            },
                        },
                    }),
                ],
            },
        },
    }[NODE_ENV] || {}),
};
