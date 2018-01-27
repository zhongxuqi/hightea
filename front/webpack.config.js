var webpack = require('webpack')

module.exports = {
    entry: {
        app: './src/js/app.jsx',
        login: './src/js/login/app.jsx',
        public: './src/js/public.jsx'
    },
    output: {
        filename: '[name].bundle.js',
        path: __dirname + '/dist/js',
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
            {test: /\.less$/, loader: 'style-loader!css-loader!less-loader'},
            {test: /\.css$/, loader: 'style-loader!css-loader'},
        ]
    },
    plugins: [
        new webpack.optimize.UglifyJsPlugin({
            minimize: true
        }),
    ],
    devServer: {
        contentBase: __dirname + "/dist",
        compress: true,
        port: 7060,
        proxy: {
            "/api": "http://127.0.0.1:7070",
            "/openapi": "http://127.0.0.1:7070",
        },
    }
}
