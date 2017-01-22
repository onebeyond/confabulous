# Confabulous
Confabulous is a hierarchical, asynchronous config loader and post processor. It can load config from command line arguments, environment variables, files, web servers, databases, and even scm systems. It's easy to extend too. You can watch config sources for changes and apply post processors to do things like decrypt secrets or unflatten key/value pairs into structured objects.

[![NPM version](https://img.shields.io/npm/v/confabulous.svg?style=flat-square)](https://www.npmjs.com/package/confabulous)
[![NPM downloads](https://img.shields.io/npm/dm/confabulous.svg?style=flat-square)](https://www.npmjs.com/package/confabulous)
[![Build Status](https://img.shields.io/travis/guidesmiths/confabulous/master.svg)](https://travis-ci.org/guidesmiths/confabulous)
[![Code Climate](https://codeclimate.com/github/guidesmiths/confabulous/badges/gpa.svg)](https://codeclimate.com/github/guidesmiths/confabulous)
[![Test Coverage](https://codeclimate.com/github/guidesmiths/confabulous/badges/coverage.svg)](https://codeclimate.com/github/guidesmiths/confabulous/coverage)
[![Code Style](https://img.shields.io/badge/code%20style-imperative-brightgreen.svg)](https://github.com/guidesmiths/eslint-config-imperative)
[![Dependency Status](https://david-dm.org/guidesmiths/confabulous.svg)](https://david-dm.org/guidesmiths/confabulous)
[![devDependencies Status](https://david-dm.org/guidesmiths/confabulous/dev-status.svg)](https://david-dm.org/guidesmiths/confabulous?type=dev)

## TL;DR
```js
const Confabulous = require('confabulous')
const loaders = Confabulous.loaders

new Confabulous()
    .add(config => loaders.require({ path: './conf/defaults.js' }))
    .add(config => loaders.require({ path: './conf/production.js' }))
    .end((err, config) => {
        // Your code goes here
    })
```

## Loaders
Loaders are used to load config. Out of the box you can load config from command line parameters, environment variables and files. The following loaders are proviced as separate modules

* [http-loader](https://github.com/guidesmiths/confabulous-http-loader)
* [etcd-loader](https://github.com/guidesmiths/confabulous-etcd-loader)
* [vault-loader](https://github.com/guidesmiths/confabulous-vault-loader)
* [postgres-loader](https://github.com/guidesmiths/confabulous-postgres-loader)

### args
Loads config from command line arguments
```js
new Confabulous().add((config) => {
    return loaders.args()
})
```
You cannot watch command line arguments

### env
Loads config from envrionment variables
```js
new Confabulous().add((config) => {
    return loaders.env()
})
```
You cannot watch environment variables

### require
Loads config from a .js or .json file
```js
new Confabulous().add((config) => {
    return loaders.require({ path: './conf/defaults.js' })
})
```
|  Option  |  Type  |  Default  |  Notes  |
|----------|--------|-----------|---------|
| path     | string | undefined   | The javascript or json config file to be required |
| mandatory | boolean | true      | Causes an error/reload_error to be emitted if the configuration does not exist |
| watch     | boolean | undefined | Watching implemented via [fs.watch](https://nodejs.org/api/fs.html#fs_fs_watch_filename_options_listener). Be sure to read the caveats section if you encounter problems. |

### file
Loads config from the specified file. Files are read using the specified encoding (defaults to 'utf8'). Use a post processor if you want to convert them to json.
```js
new Confabulous().add((config) => {
    return loaders.file({ path: './conf/defaults.js' }, [
        processors.json()
    ])
})
```
|  Option  |  Type  |  Default  |  Notes  |
|----------|--------|-----------|---------|
| path     | string | undefined  | The config file to be read |
| mandatory | boolean | true     | Causes an error/reload_error to be emitted if the configuration does not exist |
| watch     | boolean | undefined | Watching implemented via [fs.watch](https://nodejs.org/api/fs.html#fs_fs_watch_filename_options_listener). Be sure to read the caveats section if you encounter problems. |
| encoding  | string  | utf8      | Specified the file encoding

## Post Processors
Post processes can be used to transform or validate your configuration after it's been loaded. Out of the box you can unflatten config into structured documents,
parse json and decrypt content.

#### mount
Mounts the configuration at the specified key
```js
new Confabulous().add((config) => {
    return loaders.require({ path: './extra.json' }), [
        processors.mount({ key: 'move.to.here' })
    ])
})
```

#### unflatten
Unflattens config into structured documents. Useful for command line arguments and environment variables.
```js
new Confabulous().add((config) => {
    return loaders.env(), [
        processors.unflatten()
    ])
})
```

#### envToProp
Converts environment variables in the form ```NODE_ENV``` to nested properties in the form ```node.env```
```js
new Confabulous().add((config) => {
    return loaders.env(), [
        processors.envToProp()
    ])
})
```

#### json
Parses text into JSON. Useful when you have more than one post processor
```js
new Confabulous().add((config) => {
    return loaders.file({ path: './config.json.encrypted' }, [
        processors.json()
    ])
})
```

#### decrypt
Decrypts encrypted configuration.
```js
new Confabulous().add((config) => {
    return loaders.file({ path: './config.json.encrypted' }, [
        processors.decrypt({ algorithm: 'aes192', password: process.env.SECRET }),
        processors.json()
    ])
})
```

## Events
### loaded
Emitted when loading config for the first time. **Deprecated. Pass a callback to the ```end``` function instead.**

### error
Emitted when an error occurs loading config for the first time. **Deprecated. Pass a callback to the ```end``` function instead.**

### reloaded
Emitted when confabulous successfully reloads a watched config.

### reload_error
Emitted when confabulous encounters an error reloading a watched config

### FAQ
Q. Why doesn't Confabulous notice new files.<br/>
A. Because fs.watch doesn't notice them either. You can workaround by modifying some configuration watched by a different loader higher up in the confabulous stack

