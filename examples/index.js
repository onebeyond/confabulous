var _ = require('lodash')
var Confusion = require('..').Confusion
var loaders = require('..').loaders

new Confusion().add((config) => {
    return loaders.req({ path: './conf/defaults.js' })
}).add((config) => {
    return loaders.req({ path: './conf/' + process.env.NODE_ENV + '.js' })
}).add((config) => {
    return loaders.req({ path: './conf/optional.js' })
}).end((err, config) => {
    if (err) throw err
    console.log(JSON.stringify(config, null, 2))
    process.exit()
})


setInterval(_.noop, Number.MAX_SAFE_INTEGER)