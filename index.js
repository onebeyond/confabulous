var requireAll = require('require-all')
var path = require('path')

var Confabulous = require('./lib/Confabulous')

Confabulous.Confabulous = Confabulous // Remain backwards compatible with old API (yuck!!!!)
Confabulous.loaders = requireAll(path.join(__dirname, './lib/loaders'))
Confabulous.processors = requireAll(path.join(__dirname, './lib/processors'))

module.exports = Confabulous
