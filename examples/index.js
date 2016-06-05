var noop = require('lodash.noop')
var Confabulous = require('..').Confabulous
var loaders = require('..').loaders
var processors = require('..').processors

new Confabulous().add((config) => {
    return loaders.env([
        processors.mount({ key: 'env' })
    ])
}).add((config) => {
    return loaders.require({ path: './conf/defaults.js', watch: true })
}).add((config) => {
    return loaders.require({ path: `./conf/${config.env.NODE_ENV}.js`, watch: true })
}).add((config) => {
    return loaders.require({ path: './conf/runtime.js', mandatory: false })
}).add((config) => {
    return loaders.file({ path: './conf/secret.json.encrypted' }, [
        processors.decrypt({ algorithm: 'aes192', password: config.env.SECRET }),
        processors.json()
    ])
}).add((config) => {
    return loaders.args()
}).add((config) => {
    return loaders.http({ url: config.server.url, mandatory: false, watch: { interval: '5m' } })
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