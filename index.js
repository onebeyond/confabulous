const requireAll = require('require-all');
const path = require('path');

const Confabulous = require('./lib/Confabulous');

Confabulous.Confabulous = Confabulous; // Remain backwards compatible with old API (yuck!!!!)
Confabulous.loaders = requireAll(path.join(__dirname, './lib/loaders'));
Confabulous.processors = requireAll(path.join(__dirname, './lib/processors'));

module.exports = Confabulous;
