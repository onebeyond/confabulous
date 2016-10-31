[![Build Status](https://travis-ci.org/guidesmiths/confabulous.png)](https://travis-ci.org/guidesmiths/confabulous)
# Confabulous
Confabulous is a hierarchical, asynchronous config loader and post processor. It can load config from command line arguments, environment variables, files, web servers, databases, and even scm systems. It's easy to extend too. You can watch config sources for changes and apply post processors to do things like decrypt secrets or unflatten key/value pairs into structured objects.

## TL;DR
```
const Confabulous = require('confabulous')
const loaders = Confabulous.loaders

new Confabulous()
    .add(config => loaders.require({ path: './conf/defaults.js' }))
    .add(config => loaders.require({ path: './conf/production.js' }))
    .end((err, config) => {
        // Your code goes here
    })
```

## Events
### loaded
Emitted when loading config for the first time. **Deprecated. Pass a callback to the ```end`` function instead.**

### error
Emitted when an error occurs loading config for the first time. **Deprecated. Pass a callback to the ```end`` function instead.**

### reloaded
Emitted when confabulous successfully reloads a watched config.

### reload_error
Emitted when confabulous encounters an error reloading a watched config

## Loaders
Loaders are used to load config. Out of the box you can load config from command line parameters, environment variables and files. The following loaders are proviced as separate modules

* [http-loader](https://github.com/guidesmiths/confabulous-http-loader)
* [etcd-loader](https://github.com/guidesmiths/confabulous-etcd-loader)
* [vault-loader](https://github.com/guidesmiths/confabulous-vault-loader)
* [postgres-loader](https://github.com/guidesmiths/confabulous-postgres-loader)

### args
Loads config from command line arguments
```
new Confabulous().add((config) => {
    return loaders.args()
})
```
You cannot watch command line arguments

### env
Loads config from envrionment variables
```
new Confabulous().add((config) => {
    return loaders.env()
})
```
You cannot watch environment variables

### require
Loads config from a .js or .json file
```
new Confabulous().add((config) => {
    return loaders.require({ path: './conf/defaults.js' })
})
```
|  Option  |  Type  |  Default  |  Notes  |
|----------|--------|-----------|---------|
| path     | string | undefined   | The file to require |
| mandatory | boolean | true      | Causes an error/reload_error to be emitted if the configuration does not exist |
| watch     | boolean | undefined | Watching implemented via [fs.watch](https://nodejs.org/api/fs.html#fs_fs_watch_filename_options_listener). Be sure to read the caveats section if you encounter problems. |

### file
Loads config from the specified file. Files are read using the specified encoding (defaults to 'utf8'). Use a post processor if you want to convert them to json.
```
new Confabulous().add((config) => {
    return loaders.file({ path: './conf/defaults.js' }, [
        processors.json()
    ])
})
```
|  Option  |  Type  |  Default  |  Notes  |
|----------|--------|-----------|---------|
| path     | string | undefined  | The file to read |
| mandatory | boolean | true     | Causes an error/reload_error to be emitted if the configuration does not exist |
| watch     | boolean | undefined | Watching implemented via [fs.watch](https://nodejs.org/api/fs.html#fs_fs_watch_filename_options_listener). Be sure to read the caveats section if you encounter problems. |
| encoding  | string  | utf8      | Specified the file encoding

## Post Processors
Post processes can be used to transform or validate your configuration after it's been loaded. Out of the box you can unflatten config into structured documents,
parse json and decrypt content.

#### mount
Mounts the configuration at the specified key
```
new Confabulous().add((config) => {
    return loaders.require({ path: './extra.json' }), [
        processors.mount({ key: 'move.to.here' })
    ])
})
```

#### unflatten
Unflattens config into structured documents. Useful for command line arguments and environment variables.
```
new Confabulous().add((config) => {
    return loaders.env(), [
        processors.unflatten()
    ])
})
```

#### envToProp
Converts environment variables in the form ```NODE_ENV``` to nested properties in the form ```node.env```
```
new Confabulous().add((config) => {
    return loaders.env(), [
        processors.envToProp()
    ])
})
```

#### json
Parses text into JSON. Useful when you have more than one post processor
```
new Confabulous().add((config) => {
    return loaders.file({ path: './config.json.encrypted' }, [
        processors.json()
    ])
})
```

#### decrypt
Decrypts encrypted configuration.
```
new Confabulous().add((config) => {
    return loaders.file({ path: './config.json.encrypted' }, [
        processors.decrypt({ algorithm: 'aes192', password: process.env.SECRET }),
        processors.json()
    ])
})
```

### FAQ
Q. Why doesn't Confabulous notice new files.<br/>
A. Because fs.watch doesn't notice them either. You can workaround by modifying some configuration watched by a different loader higher up in the confabulous stack

