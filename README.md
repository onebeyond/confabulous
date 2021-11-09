# Confabulous

Confabulous is a hierarchical, asynchronous config loader and post processor. It can load config from command line arguments, environment variables, files, web servers, databases, and even scm systems. It's easy to extend too. You can watch config sources for changes and apply post processors to do things like decrypt secrets or unflatten key/value pairs into structured objects.

[![NPM version](https://img.shields.io/npm/v/confabulous.svg?style=flat-square)](https://www.npmjs.com/package/confabulous)
[![NPM downloads](https://img.shields.io/npm/dm/confabulous.svg?style=flat-square)](https://www.npmjs.com/package/confabulous)
[![Node.js CI](https://github.com/guidesmiths/confabulous/workflows/Node.js%20CI/badge.svg)](https://github.com/guidesmiths/confabulous/actions?query=workflow%3A%22Node.js+CI%22)
[![Code Climate](https://codeclimate.com/github/guidesmiths/confabulous/badges/gpa.svg)](https://codeclimate.com/github/guidesmiths/confabulous)
[![Test Coverage](https://codeclimate.com/github/guidesmiths/confabulous/badges/coverage.svg)](https://codeclimate.com/github/guidesmiths/confabulous/coverage)
[![Code Style](https://img.shields.io/badge/code%20style-prettier-brightgreen.svg)](https://github.com/prettier/prettier)

## TL;DR

```js
const Confabulous = require('confabulous');
const loaders = Confabulous.loaders;

const confabulous = new Confabulous()
  .add((config) => loaders.require({ path: './conf/defaults.js' }))
  .add((config) => loaders.require({ path: './conf/production.js' }))
  .end((err, config) => {
    // Your code goes here
  });
```

## Merging

Confabulous recursively merges (and subsequently freezes) configuration from multiple sources. If you want to override the [default merge](https://ramdajs.com/docs/#mergeDeepRight) behaviour you can supply your own merge function, providing it is varardic and favours the right most parameter, e.g.

```js
function shallow(...args) {
  return Object.assign({}, ...args);
}

new Confabulous({ merge: shallow })
  .add((config) => loaders.require({ path: './conf/defaults.js' }))
  .add((config) => loaders.require({ path: './conf/production.js' }))
  .end((err, config) => {
    // Your code goes here
  });
```

## Loaders

Loaders are used to load config. Out of the box you can load config from command line parameters, environment variables and files.

### args

Loads config from command line arguments

```js
new Confabulous().add((config) => {
  return loaders.args();
});
```

You cannot watch command line arguments

### env

Loads config from envrionment variables

```js
new Confabulous().add((config) => {
  return loaders.env();
});
```

You cannot watch environment variables

### require

Loads config from a .js or .json file

```js
new Confabulous().add((config) => {
  return loaders.require({ path: './conf/defaults.js' });
});
```

| Option    | Type    | Default   | Notes                                                                                                                                                                     |
| --------- | ------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| path      | string  | undefined | The javascript or json config file to be required                                                                                                                         |
| mandatory | boolean | true      | Causes an error/reload_error to be emitted if the configuration does not exist                                                                                            |
| watch     | boolean | undefined | Watching implemented via [fs.watch](https://nodejs.org/api/fs.html#fs_fs_watch_filename_options_listener). Be sure to read the caveats section if you encounter problems. |

### file

Loads config from the specified file. Files are read using the specified encoding (defaults to 'utf8'). Use a post processor if you want to convert them to json.

```js
new Confabulous().add((config) => {
  return loaders.file({ path: './conf/defaults.js' }, [processors.json()]);
});
```

| Option    | Type    | Default   | Notes                                                                                                                                                                     |
| --------- | ------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| path      | string  | undefined | The config file to be read                                                                                                                                                |
| mandatory | boolean | true      | Causes an error/reload_error to be emitted if the configuration does not exist                                                                                            |
| watch     | boolean | undefined | Watching implemented via [fs.watch](https://nodejs.org/api/fs.html#fs_fs_watch_filename_options_listener). Be sure to read the caveats section if you encounter problems. |
| encoding  | string  | utf8      | Specified the file encoding                                                                                                                                               |

### More Loaders

The following loaders are proviced as separate modules

- [http-loader](https://www.npmjs.com/package/confabulous-http-loader)
- [etcd-loader](https://www.npmjs.com/package/confabulous-etcd-loader)
- [vault-loader](https://www.npmjs.com/package/confabulous-vault-loader)
- [postgres-loader](https://www.npmjs.com/package/confabulous-postgres-loader)
- [s3-loader](https://www.npmjs.com/package/confabulous-s3-loader)

## Post Processors

Post processes can be used to transform or validate your configuration after it's been loaded. Out of the box you can mount config at a specified key, unflatten key value pairs into structured documents, parse json, decrypt content and transform environment variables.

#### mount

Mounts the configuration at the specified key

```js
new Confabulous().add((config) => {
  return loaders.require({ path: './extra.json' }, [processors.mount({ key: 'move.to.here' })]);
});
```

#### unflatten

Unflattens config into structured documents. Useful for command line arguments and environment variables.

```js
new Confabulous().add((config) => {
  return loaders.env([processors.unflatten()]);
});
```

#### envToProp

Converts environment variables in the form `NODE_ENV=test` to nested properties in the form `{ node: { env: "test" } }`

```js
new Confabulous().add((config) => {
  return loaders.env([processors.envToProp()]);
});
```

If you want to prefix your environment variables with an application discriminator you can also strip the prefix.

```js
new Confabulous().add((config) => {
  return loaders.env([
    processors.envToProp({ prefix: 'GS_' }), // GS_SERVER_PORT => server.port
  ]);
});
```

You can also filter environment variables to include only those you want

```js
new Confabulous().add((config) => {
  return loaders.env([
    processors.envToProp({ filter: /^GS_/ }), // Only include environment variables starting with GS_
  ]);
});
```

#### envToCamelCaseProp

Converts environment variables in the form `USER__FIRST_NAME=fred` to nested properties in the form `{ user: { firstName: "fred" } }`

```js
new Confabulous().add((config) => {
  return loaders.env([processors.envToCamelCaseProp()]);
});
```

If you want to prefix your environment variables with an application discriminator you can also strip the prefix.

```js
new Confabulous().add((config) => {
  return loaders.env([
    // GS_SERVER_PORT => server.port
    processors.envToCamelCaseProp({ prefix: 'GS_' }),
  ]);
});
```

You can also filter environment variables to include only those you want

```js
new Confabulous().add((config) => {
  return loaders.env([
    // Only include environment variables starting with GS_
    processors.envToCamelCaseProp({ filter: /^GS_/ }),
  ]);
});
```

#### json

Parses text into JSON.

```js
new Confabulous().add((config) => {
  return loaders.file({ path: './config.json.encrypted' }, [processors.json()]);
});
```

#### decrypt

Decrypts encrypted configuration.

```js
new Confabulous().add((config) => {
  return loaders.file({ path: './config.json.encrypted' }, [
    processors.decrypt({
      algorithm: 'aes-192-cbc',
      key: process.env.SECRET_KEY,
      iv: process.env.IV,
    }),
    processors.json(),
  ]);
});
```

## Events

### closing

Calling confabulous.close will emit a 'closing' event. This can be used by loaders to free up resources (e.g. close file watchers)

### loaded

**Deprecated. Pass a callback to the `end` function instead.**
Emitted when loading config for the first time.

### error

**Deprecated. Pass a callback to the `end` function instead.**
Emitted when an error occurs loading config for the first time.

### reloaded

Emitted when confabulous successfully reloads a watched config.

### reload_error

Emitted when confabulous encounters an error reloading a watched config

#### FAQ

Q. Why doesn't Confabulous notice new files.<br/>
A. Because fs.watch doesn't notice them either. You can workaround by modifying some configuration watched by a different loader higher up in the confabulous stack

Q. Why does jest emit a FSEVENTWRAP error.<br/>
A. Because you have configured a loader to watch for changes, but not called confabulous.close() in your test teardown
