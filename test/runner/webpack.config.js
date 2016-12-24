const path                  = require('path')


module.exports = {

    entry: {
        'test-init' : './test/runner/index.js',
        'test-spec' : './test/spec/index.js',
    },

    output: {
        path        : path.join(__dirname, 'dist'),
        filename    : '[name].js'
    },

    module: {

        loaders: [
            {
                test: /\.js$/,
                loader: 'babel',
            },
        ],
    },
}
