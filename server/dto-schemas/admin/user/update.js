const saveUser = {
  title: 'Update user form',
  description: 'Defines the structure for HTTP POST request body',
  type: 'object',
  properties: {
    publicId: {
      type: 'string',
      description: 'public guid of the user',
      format: 'uuid',
    },
    name: {
      type: 'string',
      description: 'name of the user',
      pattern: '\\s*^[\\d0-9a-zA-Z][\\d0-9a-zA-Z\\s]+$',
    },
    roleId: {
      type: 'string',
      description: 'public guid of the user',
      format: 'uuid',
    },
    concurrencyStamp: {
      type: 'string',
      description: 'UUID referencing to the unique transaction id for updating pincode object',
      format: 'uuid',
    },
    updatedBy: {
      type: 'string',
      description: 'unique reference of updatedBy',
      format: 'uuid',
    },
  },
  errorMessage: {
    required: {
      publicId: 'Parameter: publicId is required in the body.',
      name: 'Parameter: name is required in the body.',
      roleId: 'Parameter: roleId is required in the body.',
      status: 'Parameter: status is required in the body.',
      updatedBy: 'Parameter: updatedBy is required in the body.',
      concurrencyStamp: 'Parameter: x-coreplatform-concurrencystamp in headers is required',
    },
    properties: {
      updatedBy: 'Parameter: updatedBy should be valid.',
      roleId: 'Parameter: roleId should be valid.',
      name: 'Parameter: name should be valid.',
      publicId: 'Parameter: publicId should be valid.',
      status: 'Parameter: status should be valid.',
      concurrencyStamp: 'Parameter: x-coreplatform-concurrencystamp in headers should be a valid UUID',
      mobileNumber: 'Parameter: mobileNumber should be valid.',
    },
  },
  anyOf: [
    {
      required: [ 'publicId', 'updatedBy', 'concurrencyStamp', 'name' ],
    },
    {
      required: [ 'publicId', 'updatedBy', 'concurrencyStamp', 'roleId' ],
    },
  ],
  additionalProperties: false,
};

module.exports = saveUser;
