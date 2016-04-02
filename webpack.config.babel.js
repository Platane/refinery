const path = require('path')
const webpack = require('webpack')


const plugins = [

    // replace keys
    new webpack.DefinePlugin({
        __VERSION__             : '"'+ require( './package.json' ).version +'"',
        'process.env.NODE_ENV'  : process.env.NODE_ENV,
    }),
]

if ( process.env.NODE_ENV == 'production' )
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
        october: ['./src/index.js'],
    },

    output: {
        libraryTarget: 'commonjs2',
        path: path.join(__dirname, 'dist'),
        filename: '[name].js',
    },

    module: {

        loaders: [
            {
                test: /\.js$/,
                exclude: /(node_modules|\.tmp)/,
                loader: 'babel',
                query: {
                    cacheDirectory: true,
                    presets: ['es2015', 'stage-1'],
                    plugins: ['transform-runtime'],
                }
            },
        ]
    },

    plugins: plugins,
}
