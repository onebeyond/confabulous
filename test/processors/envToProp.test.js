const { ifError, strictEqual: equal } = require('assert');
const envToProp = require('../../lib/processors/envToProp');

describe('Environment Variables to Properties', () => {
  it('should convert ENV_VAR to env.var', () => {
    envToProp()({ ENV_VAR: 'test' }, (err, config) => {
      ifError(err);
      equal(config.env.var, 'test');
    });
  });

  it('should convert GS_ENV_VAR to env.var', () => {
    envToProp({ prefix: 'GS_' })({ GS_ENV_VAR: 'test' }, (err, config) => {
      ifError(err);
      equal(config.env.var, 'test');
    });
  });

  it('should only strip matching of environment names', () => {
    envToProp({ prefix: 'GS_' })({ XGS_ENV_VAR: 'test' }, (err, config) => {
      ifError(err);
      equal(config.xgs.env.var, 'test');
    });
  });

  it('should filter environment names', () => {
    envToProp({ filter: /^GS_/ })({ XGS_ENV_VAR: 'fail', GS_ENV_VAR: 'test' }, (err, config) => {
      ifError(err);
      equal(config.gs.env.var, 'test');
      equal(Object.keys(config).length, 1);
    });
  });
});
