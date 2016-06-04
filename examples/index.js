var _ = require('lodash')
var Confusion = require('..').Confusion
var loaders = require('..').loaders

new Confusion().add((config) => {
    return loaders.req({ path: './conf/defaults.js' })
}).add((config) => {
    return loaders.req({ path: './conf/' + process.env.NODE_ENV + '.js' })
}).add((config) => {
    return loaders.req({ path: './conf/optional.js' })
}).on('loaded', (config) => {
    console.log('Loaded', JSON.stringify(config, null, 2))
}).on('reloaded', (config) => {
    console.log('Reloaded', JSON.stringify(config, null, 2))
    process.exit()
}).on('error', (err) => {
    console.error('Error', err)
}).on('reload_error', (err) => {
    console.error('Reload Error', err)
}).end()

setInterval(_.noop, Number.MAX_SAFE_INTEGER)