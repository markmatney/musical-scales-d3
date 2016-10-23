module.exports = {
    module: {
        loaders: [
            { test: /\.json$/, loader: 'json' }
        ]
    },
    output: {
        filename: 'musical-scales-d3.bundle.js'
    }
};
