const Confabulous = require('..')
const loaders = Confabulous.loaders
const processors = Confabulous.processors

new Confabulous()
    .add(config => loaders.env([ processors.mount({ key: 'env' }) ]))
    .add(config => loaders.require({ path: './conf/defaults.js', watch: true }))
    .add(config => loaders.require({ path: `./conf/${process.env.NODE_ENV}.js`, watch: true }))
    .add(config => loaders.require({ path: './conf/runtime.js', mandatory: false }))
    .add(config => loaders.file({ path: './conf/secret.json.encrypted' }, [
        processors.decrypt({ algorithm: 'aes192', password: config.env.SECRET }),
        processors.json()
    ]))
    .add((config) => loaders.args())
    .end((err, config) => {
        console.log('Loaded', JSON.stringify(config, null, 2))
    })

setInterval(function() {}, Number.MAX_SAFE_INTEGER)
