var noop = require('lodash.noop')
var Confusion = require('..').Confusion
var loaders = require('..').loaders
var transformers = require('..').transformers

new Confusion().add((config) => {
    return loaders.require({ path: './conf/defaults.js', watch: true })
}).add((config) => {
    return loaders.require({ path: './conf/' + process.env.NODE_ENV + '.js', watch: true })
}).add((config) => {
    return loaders.require({ path: './conf/optional.js', mandatory: false })
}).add((config) => {
    return [
        loaders.file({ path: './conf/secret.json.encrypted' }),
        transformers.decrypt({ algorithm: 'aes192', password: process.env.SECRET }),
        transformers.json()
    ]
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