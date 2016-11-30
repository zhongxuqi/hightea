var webpack = require('webpack')

module.exports = {
    entry: {
        app: './src/js/app.jsx',
        login: './src/js/login/app.jsx',
    },
    output: {
        filename: '[name].bundle.js',
        path: './dist/js'
    },
    module: {
        loaders: [
            {
                test: /\.jsx$/,
                loader: 'babel-loader',
                query: {
                    presets: ['latest', 'react'],
                }
            }, 
            {test: /\.less$/, loader: 'style!css!less'},
            {test: /\.css$/, loader: 'style!css'},
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