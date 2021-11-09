const { ifError, strictEqual: equal } = require('assert');
const envToProp = require('../../lib/processors/envToCamelCaseProp');

describe('Environment Variables to Camel Case Properties', () => {
  it('should convert USER__FIRST_NAME to env.var', () => {
    envToProp()({ USER__FIRST_NAME: 'test' }, (err, config) => {
      ifError(err);
      equal(config.user.firstName, 'test');
    });
  });

  it('should convert GS_USER__FIRST_NAME to env.var', () => {
    envToProp({ prefix: 'GS_' })({ GS_USER__FIRST_NAME: 'test' }, (err, config) => {
      ifError(err);
      equal(config.user.firstName, 'test');
    });
  });

  it('should only strip matching of environment names', () => {
    envToProp({ prefix: 'GS_' })({ XGS_USER__FIRST_NAME: 'test' }, (err, config) => {
      ifError(err);
      equal(config.xgsUser.firstName, 'test');
    });
  });

  it('should filter environment names', () => {
    envToProp({ prefix: 'GS_', filter: /^GS_/ })(
      { XGS_USER_FIRST_NAME: 'fail', GS_USER__FIRST_NAME: 'test' },
      (err, config) => {
        ifError(err);
        equal(config.user.firstName, 'test');
        equal(Object.keys(config).length, 1);
      }
    );
  });
});
