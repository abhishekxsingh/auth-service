const deviceRegistration = {
  title: 'Device registration form',
  description: 'Defines the structure for HTTP POST request body',
  type: 'object',
  properties: {
    deviceId: {
      type: 'string',
      description: 'deviceId of platform',
      maxLength: 100,
    },
    utmSource: {
      type: 'string',
      maxLength: 255,
    },
    utmMedium: {
      type: 'string',
    },
    utmCampaign: {
      type: 'string',
    },
    versionCode: {
      type: 'string',
      description: 'version code of application',
    },
    platform: {
      type: 'string',
      description: 'platform of application',
      enum: [ 'AN', 'WEB', 'IOS' ],
    },
    registrationToken: {
      type: 'string',
      description: 'GCM token',
      maxLength: 163,
      minLength: 100,
      pattern: '[0-9a-zA-Z/-_]*',
    },
    mccMnc: {
      type: 'string',
      description: 'mcc mnc',
    },
    operator: {
      type: 'string',
    },
    network: {
      type: 'string',
    },
    buildNumber: {
      type: 'string',
    },
    brand: {
      type: 'string',
    },
    buildName: {
      type: 'string',
    },
    manufacturer: {
      type: 'string',
    },
    model: {
      type: 'string',
    },
    osVersion: {
      type: 'string',
    },
    referrer: {
      type: 'string',
    },
    screenDpi: {
      type: 'string',
    },
    screenHeight: {
      type: 'string',
    },
    screenWidth: {
      type: 'string',
    },
    wifi: {
      type: 'string',
    },
    radio: {
      type: 'string',
    },
    os: {
      type: 'string',
    },
    mcc: {
      type: 'string',
    },
    mnc: {
      type: 'string',
    },
  },
  errorMessage: {
    required: {
      versionCode: 'Parameter: versionCode is required in the body.',
      platform: 'Parameter: platform is required in the body.',
      registrationToken: 'Parameter: registrationToken is required in the body.',
    },
    properties: {
      versionCode: 'Parameter: versionCode should be valid.',
      platform: 'Parameter: platform should be valid.',
      registrationToken: 'Parameter: registrationToken should be valid.',
      deviceId: 'Parameter: deviceId should be string.',
      mccMnc: 'Parameter: mccMnc should be string.',
      operator: 'Parameter: operator should be string.',
    },
  },
  required: [ 'versionCode', 'platform', 'deviceId' ],
  additionalProperties: false,
};

module.exports = deviceRegistration;
