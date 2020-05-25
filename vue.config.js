module.exports = {
    configureWebpack: {
        // Configuration applied to all builds
    },
    pluginOptions: {
        electronBuilder: {
            chainWebpackRendererProcess: config => {
                config.plugin('define').tap(args => {
                    args[0]['process.env.FLUENTFFMPEG_COV'] = false
                    return args
                })
            },
            builderOptions: {
                "extraFiles": [{
                    "from": "resources",
                    "to": "Resources",
                    "filter": "**/*"
                }]
            }
        }
    },
    pages: {
        index: 'src/main.js',
        live: 'src/subpage/live.js',
        review: 'src/subpage/review.js'
    }
}