const firebaseLogin = {
  title: 'Firebase auth login form',
  description: 'Defines the structure for HTTP POST request body',
  type: 'object',
  properties: {
    token: {
      type: 'string',
      description: 'Firebase OAuth2 token of user',
    },
    deviceId: {
      type: 'string',
      description: "platform id of user's",
      format: 'uuid',
    },
  },
  errorMessage: {
    required: {
      token: 'Parameter: \'x-firebase-token\' is required in the body.',
      deviceId: 'Parameter: \'x-platform-deviceid\' is required in the header.',
    },
    properties: {
      token: 'Parameter: \'x-firebase-token\' should be valid.',
      deviceId: 'Parameter: `x-platform-deviceid` should be valid.',
    },
  },
  required: [ 'token' ],
  additionalProperties: false,
};

module.exports = firebaseLogin;
