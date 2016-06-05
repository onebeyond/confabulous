[![Build Status](https://travis-ci.org/guidesmiths/confusion.png)](https://travis-ci.org/guidesmiths/confusion)

# Confusion (Working Title)

Confusion is a hierarchical config loader and post processor. It can load config from command line arguments, environment variables, files, web servers, databases, and even scm systems. It's easy to extend too. You can watch config sources for changes and apply post processors to do things like decrypt secrets or unflatten key/value pairs into structured objects.

## TL;DR
```
var noop = require('lodash.noop')
var Confusion = require('..').Confusion
var loaders = require('..').loaders
var processors = require('..').processors

new Confusion().add((config) => {
    return loaders.require({ path: './conf/defaults.js', watch: true })
}).add((config) => {
    return loaders.require({ path: `./conf/${process.env.NODE_ENV}.js`, watch: true })
}).add((config) => {
    return loaders.require({ path: './conf/runtime.js', mandatory: false })
}).add((config) => {
    return loaders.file({ path: './conf/secret.json.encrypted' }, [
        processors.decrypt({ algorithm: 'aes192', password: process.env.SECRET }),
        processors.json()
    ])
}).add((config) => {
    return loaders.args()
}).on('loaded', (config) => {
    console.log('Loaded', JSON.stringify(config, null, 2))
}).on('reloaded', (config) => {
    console.log('Reloaded', JSON.stringify(config, null, 2))
}).on('error', (err) => {
    console.error('Error', err)
}).on('reload_error', (err) => {
    console.error('Reload Error', err)
}).end()
```

## Loaders
Loaders are used to load config. Out of the box you can load config from command line parameters, environment variables, files, and web servers. Once we've got the API a bit more stable we'll start writing plugins for other sources too.

### args
Loads config from command line arguments
```
new Confusion().add((config) => {
    return loaders.args()
})
```
You cannot watch command line arguments

### env
Loads config from envrionment variables
```
new Confusion().add((config) => {
    return loaders.env()
})
```
You cannot watch environment variables

### require
Loads config from a .js or .json file
```
new Confusion().add((config) => {
    return loaders.require({ path: './conf/defaults.js' })
})
```
|- Option -|- Type -|- Default -|- Notes -|
|----------|--------|-----------|---------|
| mandatory | boolean | true      | Causes an error/reload_error to be emitted if the configuration does not exist |
| watch     | boolean | undefined | Watching implemented via [fs.watch](https://nodejs.org/api/fs.html#fs_fs_watch_filename_options_listener). Be sure to read the caveats section if you encounter problems. |

### file
Loads config from the specified file. Files are read using the specified encoding (defaults to 'utf8'). Use a post processor if you want to convert them to json.
```
new Confusion().add((config) => {
    return loaders.file({ path: './conf/defaults.js' }, [
        processors.json()
    ])
})
```
|- Option -|- Type -|- Default -|- Notes -|
|----------|--------|-----------|---------|
| mandatory | boolean | true     | Causes an error/reload_error to be emitted if the configuration does not exist |
| watch     | boolean | undefined | Watching implemented via [fs.watch](https://nodejs.org/api/fs.html#fs_fs_watch_filename_options_listener). Be sure to read the caveats section if you encounter problems. |
| encoding  | string  | utf8      | Specified the file encoding


### http
Requests config from a web server (expects JSON by default).
```
new Confusion().add((config) => {
    return loaders.http({ url: 'http://www.example.com/config' })
})
```
|- Option -|- Type -|- Default -|- Notes -|
|----------|--------|-----------|---------|
| mandatory | boolean | true       | Causes an error/reload_error to be emitted if the configuration does not exist |
| watch     | object  | undefined  | Watching is implemented by issuing HEAD requests and comparing the Etag and Last-Modified headers. You need to specify and interval in the configuration, e.g. ```{ watch: { interval: '5m' } }``` |
| request   | object  | [see here](https://www.github.com/guidesmiths/confusion/tree/master/lib/loaders/http.js#13) | options that will be passed to [the underlying http client](https://github.com/request/request).

## Post Processors
Post processes can be used to transform or validate your configuration after it's been loaded. Out of the box you can unflatten config into structured documents,
parse json and decrypt content.

#### mount
Mounts the configuration at the specified key
```
new Confusion().add((config) => {
    return loaders.require({ path: './extra.json' }), [
        processors.mount({ key: 'move.to.here' })
    ])
})
```

#### unflatten
Unflattens config into structured documents. Useful for command line arguments and environment variables.
```
new Confusion().add((config) => {
    return loaders.env(), [
        processors.unflatten()
    ])
})
```

#### json
Parses text into JSON. Useful when you have more than one post processor
```
new Confusion().add((config) => {
    return loaders.file({ path: './config.json.encrypted' }, [
        processors.json()
    ])
})
```

#### decrypt
Decrypts encrypted configuration.
```
new Confusion().add((config) => {
    return loaders.file({ path: './config.json.encrypted' }, [
        processors.decrypt({ algorithm: 'aes192', password: process.env.SECRET }),
        processors.json()
    ])
})
```

### FAQ
Q. Why doesn't Confusion notice new files.<br/>
A. Because fs.watch problem doesn't notice them either. You can workaround by modifying some configuration watched by a different loader higher up in the confusion stack

