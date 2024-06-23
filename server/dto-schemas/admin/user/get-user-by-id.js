const getUser = {
  title: 'Get user details form',
  description: 'Defines the structure for HTTP POST request body',
  type: 'object',
  properties: {
    publicId: {
      type: 'string',
      description: 'unique reference of user',
      format: 'uuid',
    },
  },
  errorMessage: {
    required: {
      publicId: 'Parameter: publicId is required in the params.',
    },
    properties: {
      publicId: 'Parameter: publicId should be valid.',
    },
  },
  required: [ 'publicId' ],
  additionalProperties: false,
};

module.exports = getUser;
