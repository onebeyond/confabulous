var noop = require('lodash.noop')
var Confusion = require('..').Confusion
var loaders = require('..').loaders

new Confusion().add((config) => {
    return loaders.req({ path: './conf/defaults.js', watch: true })
}).add((config) => {
    return loaders.req({ path: './conf/' + process.env.NODE_ENV + '.js', watch: true })
}).add((config) => {
    return loaders.req({ path: './conf/optional.js', mandatory: false })
}).on('loaded', (config) => {
    console.log('Loaded', JSON.stringify(config, null, 2))
}).on('reloaded', (config) => {
    console.log('Reloaded', JSON.stringify(config, null, 2))
}).on('error', (err) => {
    console.error('Error', err)
}).on('reload_error', (err) => {
    console.error('Reload Error', err)
}).end()

setInterval(noop, Number.MAX_SAFE_INTEGER)