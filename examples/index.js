const noop = require('lodash.noop')
const confabulous = require('..')
const Confabulous = confabulous.Confabulous
const loaders = confabulous.loaders
const processors = confabulous.processors

new Confabulous()
    .add((config) => loaders.env([ processors.mount({ key: 'env' }) ]))
    .add((config) => loaders.require({ path: './conf/defaults.js', watch: true }))
    .add((config) => loaders.require({ path: `./conf/${config.env.NODE_ENV}.js`, watch: true }))
    .add((config) => loaders.require({ path: './conf/runtime.js', mandatory: false }))
    .add((config) => loaders.file({ path: './conf/secret.json.encrypted' }, [
        processors.decrypt({ algorithm: 'aes192', password: config.env.SECRET }),
        processors.json()
    ]))
    .add((config) => loaders.args())
    .add((config) => loaders.http({ url: config.server.url, mandatory: false, watch: { interval: '5m' } }))
    .on('loaded', (config) => console.log('Loaded', JSON.stringify(config, null, 2)))
    .on('reloaded', (config) => console.log('Reloaded', JSON.stringify(config, null, 2)))
    .on('error', (err) => console.error('Error', err))
    .on('reload_error', (err) => console.error('Reload Error', err))
    .end()

setInterval(noop, Number.MAX_SAFE_INTEGER)