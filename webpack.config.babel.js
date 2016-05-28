const path = require('path')
const webpack = require('webpack')

const minify = process.env.NODE_ENV == 'production'

const plugins = [
    new webpack.DefinePlugin({
        'process.env.NODE_ENV'  : process.env.NODE_ENV,
    }),
]

if ( minify )
    plugins.push(
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false,
            },
            sourceMap: false,
        })
    )

module.exports = {

    entry: {
        refinery: ['./src/index.js'],
    },

    output: {
        path: path.join(__dirname, 'dist'),
        filename: `[name]${ minify ? '.min' : '' }.js`,
    },

    module: {

        loaders: [
            {
                test: /\.js$/,
                exclude: /(node_modules|\.tmp)/,
                loader: 'babel',
            },
        ]
    },

    plugins,
}
