/* eslint-disable max-lines */
module.exports = {
  // Limit is 2 hrs. will block the IP for two hrs.
  API_RATE_LIMIT: { outerLimit: 5, outerTimeLimit: 2 * 60 * 60 * 1000, innerLimit: 10 },
  //
  ALLOWED_IP_LIST: [ '127.0.0.1', '::ffff:127.0.0.1' ],
  EXPOSED_HEADERS: [ 'token', 'slug', 'message', 'set-password', 'password', 'is-password-already-set', 'public-id', 'x-coreplatform-paging-limit',
    'x-coreplatform-total-records', 'x-coreplatform-concurrencystamp', 'refresh-token', 'expires-in', 'image-url',
    'File-Name', 'file-name', 'file-size', 'content-disposition', 'Content-disposition', 'Content-Type', 'content-type' ],
  IGNORE_PATH: [ '/ping', '/healthcheck', '.well-known/jwks', '/refresh-token' ],
  ISSUER: 'devcartel PRIVATE LIMITED',
  DEVICE_STATUS: {
    ACTIVE: 'ACTIVE',
    UNINSTALLED: 'UNINSTALLED',
  },
  PLATFORM: {
    AN: 'AN',
    IOS: 'IOS',
    WEB: 'WEB',
    POS: 'POS',
  },
  LOGIN_TYPE: {
    MOBILE_NUMBER_OTP: 'MOBILE_NUMBER_OTP',
    GOOGLE: 'GOOGLE',
    APPLE: 'APPLE',
    USER_NAME_PASSWORD: 'USER_NAME_PASSWORD',
    CLIENT_ID_SECRET: 'CLIENT_ID_SECRET',
  },
  USER_STATUS: {
    BLOCKED: 'BLOCKED',
    DELETED: 'DELETED',
    IN_ACTIVE: 'IN_ACTIVE',
    ACTIVE: 'ACTIVE',
  },
  SALUTATION: {
    MR: 'Mr.',
    MS: 'Ms.',
    MRS: 'Mrs.',
    MISS: 'Miss',
    DR: 'Dr.',
  },
  GENDER: {
    MALE: 'MALE',
    FEMALE: 'FEMALE',
    OTHERS: 'OTHERS',
  },
  ALGORITHM: {
    RS256: 'RS256',
  },
  USER_TYPE: {
    // platform admin user
    PLATFORM: 'PLATFORM',
    // merchant admin user
    MERCHANT: 'MERCHANT',
    // customer of platform
    CUSTOMER: 'CUSTOMER',
  },
  REFRESH_TOKEN: 'REFRESH_TOKEN',
  AUDIENCE_TYPE: {
    PLATFORM: 'PLATFORM',
    CUSTOMER: 'CUSTOMER',
    MERCHANT_ADMIN: 'MERCHANT_ADMIN',
    MERCHANT_SUPER: 'MERCHANT_SUPER',
    REFRESH_TOKEN: 'REFRESH_TOKEN',
    LAON_ELIGIBILITY: 'LAON_ELIGIBILITY',
  },
  ROLE_TYPE: {
    SYSTEM_OWNER: 'system-owner',
    SYSTEM_ADMIN: 'system-admin',
    ADMIN: 'admin',
    CUSTOMER: 'customer',
    ACCOUNTANT: 'accountant',
    OPERATION: 'operation',
  },
  CUSTOMER_IGNORE_PATH: [ '/v1/customer/device', '/v1/customer/google/login', '/v1/customer/apple/login' ],
  ADMIN_IGNORE_PATH: [ '/v1/admin/login', '/v1/admin/client/auth' ],
};

