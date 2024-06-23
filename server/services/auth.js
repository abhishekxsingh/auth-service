const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const JwtRedis = require('jwt-redis').default;

const ms = require('ms');
const moment = require('moment');
const { pem2jwk } = require('pem-jwk');

const redisClient = require('../utils/redis');
const { client: ClientModel } = require('../database');

const { REFRESH_TOKEN } = require('../utils/constant');

const signToken = async (type, data) => {
  const resp = await ClientModel.findOne({ audience: type, is_deleted: false }).sort({ id: 'asc' });
  const {
    refresh_expires_in: refreshExpiresIn, private_key: privateKey, issuer, subject, expires_in: expiresIn, algorithm, key_id: keyid,
  } = resp;
  const signOptions = {
    issuer,
    subject,
    audience: [ type ],
    expiresIn,
    algorithm,
    keyid,
  };
  const key = privateKey.toString();
  const jwtRedis = new JwtRedis(redisClient);

  const token = await jwtRedis.sign({ ...data, keyid }, key, signOptions);

  const refreshToken = await jwtRedis.sign(
    { ...data },
    key,
    { ...signOptions, expiresIn: refreshExpiresIn, audience: [ REFRESH_TOKEN ] },
  );

  // {
  //   "iss": "https://YOUR_DOMAIN/",
  //   "sub": "auth0|123456",
  //   "aud": [
  //     "my-api-identifier",
  //     "https://YOUR_DOMAIN/userinfo"
  //   ],
  //   "azp": "YOUR_CLIENT_ID",
  //   "exp": 1489179954,
  //   "iat": 1489143954,
  //   "scope": "openid profile email address phone read:appointments"
  // }

  return {
    token, refreshToken, expiresIn: moment().add(ms(expiresIn), 'milliseconds'),
  };
};

const destroy = async (token) => {
  const result = jwt.decode(token, { complete: true });

  if (result) {
    const { header, payload: { jti } } = result;
    const jwtRedis = new JwtRedis(redisClient);

    if (header) {
      const { kid } = header;
      const { public_key: publicKey } = await ClientModel.findOne({ key_id: kid });

      const key = publicKey.toString();

      const response = await jwtRedis.destroy(jti, key);

      return { doc: { response } };
    }

    return { errors: [ { message: 'invalid token', name: 'token' } ] };
  }

  return { errors: [ { message: 'invalid token', name: 'token' } ] };
};

const jwks = async () => {
  const response = await ClientModel.find({ is_deleted: false }).sort({ id: 'asc' });
  const results = response.map((element) => {
    const { public_key: publicKey, algorithm: alg, key_id: kid } = element;
    const jwk = pem2jwk(publicKey);

    return {
      ...jwk, use: 'sig', alg, kid,
    };
  });

  return { keys: results };
};

const verify = async (token) => {
  const result = jwt.decode(token, { complete: true });

  if (result) {
    const { header } = result;

    if (header) {
      const { kid } = header;
      const res = await ClientModel.findOne({ key_id: kid, is_deleted: false });

      if (res) {
        const {
          public_key: publicKey, audience, issuer, subject, expires_in: expiresIn, algorithm,
        } = res;
        const verifyOptions = {
          issuer,
          subject,
          audience: [ audience ],
          expiresIn,
          scope: [ audience ],
          algorithm: [ algorithm ],
        };

        const key = publicKey.toString();

        const jwtRedis = new JwtRedis(redisClient);

        const is = await jwtRedis.verify(token, key, verifyOptions);

        return is;
      }

      return false;
    }

    return false;
  }

  return false;
};

const refresh = async (refreshToken) => {
  const result = jwt.decode(refreshToken, { complete: true });

  if (result) {
    const { header, payload } = result;

    if (header) {
      const { kid: keyid } = header;
      const {
        iat, exp, aud, iss, sub, jti, ...newPayload
      } = payload;

      const res = await ClientModel.findOne({ key_id: keyid, is_deleted: false });

      if (res) {
        const {
          refresh_expires_in: refreshExpiresIn, public_key: publicKey, private_key: privateKey, issuer, subject, expires_in: expiresIn, algorithm, audience,
        } = res;

        const jwtRedis = new JwtRedis(redisClient);

        const signOptions = {
          issuer,
          subject,
          audience: [ audience ],
          expiresIn,
          algorithm,
          keyid,
        };

        const token = await jwtRedis.sign({ ...newPayload }, privateKey.toString(), signOptions);

        const newRefreshToken = await jwtRedis.sign(
          { ...newPayload },
          privateKey.toString(),
          { ...signOptions, expiresIn: refreshExpiresIn, audience: [ REFRESH_TOKEN ] },
        );

        await jwtRedis.destroy(jti, publicKey.toString());

        return {
          token, refreshToken: newRefreshToken, expiresIn: moment().add(ms(expiresIn), 'milliseconds'),
        };
      }

      return false;
    }

    return false;
  }

  return false;
};

const encryptPassword = (password, salt) => {
  const hashedPassword = crypto.pbkdf2Sync(password, Buffer.from(salt || '', 'base64'), 10000, 128, 'sha512').toString('base64');

  return hashedPassword;
};

const encrypt = async (config, payload) => {
  const {
    audience, issuer, subject, expiresIn, algorithm, keyid, privateKey,
  } = config;

  const options = {
    issuer,
    subject,
    audience: [ audience ],
    expiresIn,
    algorithm,
    keyid,
  };
  const key = privateKey.toString();

  const token = await jwt.sign({ ...payload, keyid }, key, options);

  return token;
};

const decrypt = async (config, ecres) => {
  const result = jwt.decode(ecres, { complete: true });

  if (result) {
    const { payload } = result;

    const {
      publicKey, audience, issuer, subject, expires_in: expiresIn, algorithm,
    } = config;

    const verifyOptions = {
      issuer,
      subject,
      audience: [ audience ],
      expiresIn,
      scope: [ audience ],
      algorithm: [ algorithm ],
    };

    const key = publicKey.toString();

    const is = await jwt.verify(ecres, key, verifyOptions);

    if (is) {
      return { data: payload };
    }
  }

  return { errors: [ { name: 'ecres', message: 'Invalid' } ] };
};

const makeSalt = () => crypto.randomBytes(16).toString('base64');

const verifyPassword = (hashedPassword = '', password = '', salt = '') => encryptPassword(password, salt) === hashedPassword;

module.exports = {
  jwks,
  encryptPassword,
  makeSalt,
  verifyPassword,
  signToken,
  destroy,
  refresh,
  encrypt,
  decrypt,
  verify,
};
