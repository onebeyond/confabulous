const { ok, ifError, strictEqual: equal } = require('assert');
const { promisify } = require('util');
const crypto = require('crypto');
const decrypt = require('../../lib/processors/decrypt');

describe('decrypt', () => {

  const algorithm = 'aes-192-cbc';
  const password = 'super secret';
  let key;
  let iv;

  beforeEach(async () => {
    key = await getKey(password);
    iv = await getIv();
  });

  it('should decrypt config', async (t, done) => {
    const config = { secret: 'loaded' };
    const encrypted = encrypt({ algorithm, key, iv }, config);
    decrypt({ algorithm, key, iv })(encrypted, (err, decrypted) => {
      ifError(err);
      equal(JSON.parse(decrypted).secret, 'loaded');
      done();
    });
  });

  it('should validate algorithm', () => {
    const encrypted = encrypt({ algorithm, key, iv }, {});
    decrypt({ key, iv })(encrypted, (err) => {
      ok(err);
      equal(err.message, 'algorithm is required');
    });
  });

  it('should validate key', () => {
    const encrypted = encrypt({ algorithm, key, iv }, {});
    decrypt({ algorithm, iv })(encrypted, (err) => {
      ok(err);
      equal(err.message, 'key is required');
    });
  });

  it('should validate iv', () => {
    const encrypted = encrypt({ algorithm, key, iv }, {});
    decrypt({ algorithm, key })(encrypted, (err) => {
      ok(err);
      equal(err.message, 'iv is required');
    });
  });

  function getKey(password) {
    const scrypt = promisify(crypto.scrypt);
    return scrypt(password, 'salt', 24);
  }

  function getIv() {
    const randomFill = promisify(crypto.randomFill);
    return randomFill(new Uint8Array(16));
  }

  function encrypt({ algorithm, key, iv }, document) {
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(JSON.stringify(document), 'utf-8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
  }
});
