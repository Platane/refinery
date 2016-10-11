var pkg = require('./package.json')

module.exports = {

    title: 'Refinery',

    root: './docs',

    gitbook: '>=3.0.0-pre.0',

    plugins: ['prism', '-highlight', 'github'],

    variables: {
        version: pkg.version
    },

    pluginsConfig: {
        github: {
            url: 'https://github.com/platane/refinery',
        }
    },
}
