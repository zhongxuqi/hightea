var webpack = require('webpack')

module.exports = {
    entry: {
        app: './src/js/app.jsx',
        login: './src/js/login/app.jsx',
        public: './src/js/public.jsx'
    },
    output: {
        filename: '[name].bundle.js',
        //path: './dist/js'
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
            compress: {
                warnings: false
            }
        })
    ],
}
