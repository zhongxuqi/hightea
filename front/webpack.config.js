var webpack = require('webpack')

module.exports = {
    entry: {
        app: './src/js/app.js'
    },
    output: {
        filename: '[name].bundle.js',
        path: './dist/js'
    },
    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                loader: 'babel-loader',
                query: {
                    presets: ['latest', 'react']
                }
            }, 
            {test: /\.less$/, loader: 'style!css!less'},
        ]
    },
    plugins: [
        // new webpack.optimize.UglifyJsPlugin({
        //     compress: {
        //         warnings: false
        //     }
        // })
    ],
    devtool: 'source-map',
}