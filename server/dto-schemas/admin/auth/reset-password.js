const saveUser = {
  title: 'reset system generated password form',
  description: 'Defines the structure for HTTP POST request body',
  type: 'object',
  properties: {
    publicId: {
      type: 'string',
      description: 'public guid of the user',
      format: 'uuid',
    },
    newPassword: {
      type: 'string',
      description: 'Password.',
      pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[#$^+=!*()@%&]).{8,15}$',
    },
    confirmPassword: {
      const: {
        $data: '1/newPassword',
      },
      type: 'string',
    },
    password: {
      type: 'string',
      description: 'Password.',
      maxLength: 50,
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
      updatedBy: 'Parameter: updatedBy is required in the body.',
      concurrencyStamp: 'Parameter: x-coreplatform-concurrencystamp in headers is required',
    },
    properties: {
      updatedBy: 'Parameter: updatedBy should be valid.',
      publicId: 'Parameter: publicId should be valid.',
      concurrencyStamp: 'Parameter: x-coreplatform-concurrencystamp in headers should be a valid UUID',
    },
  },
  required: [ 'publicId', 'concurrencyStamp', 'updatedBy' ],
  additionalProperties: false,
};

module.exports = saveUser;
