const create = {
  title: 'Add user form',
  description: 'Defines the structure for HTTP POST request body',
  type: 'object',
  properties: {
    name: {
      type: 'string',
      description: 'name of the user',
      pattern: '^[a-zA-Z][a-zA-Z ]+[a-zA-Z]$',
    },
    mobileNumber: {
      anyOf: [ {
        type: 'string',
        description: 'Mobile number for registration',
        pattern: '^[1-9]{1}[0-9]{9}',
        maxLength: 10,
      }, {
        type: 'string',
        description: 'Mobile number for registration',
        pattern: '^[1-9]{1}[0-9]{8}',
        maxLength: 9,
      } ],
    },
    email: {
      type: 'string',
      description: 'email of the user',
      format: 'email',
    },
    roleId: {
      type: 'string',
      description: 'public guid of the user',
      format: 'uuid',
    },
    createdBy: {
      type: 'string',
      description: 'unique reference of createdBy',
      format: 'uuid',
    },
  },
  errorMessage: {
    required: {
      email: 'Parameter: email is required in the body.',
      name: 'Parameter: name is required in the body.',
      roleId: 'Parameter: roleId is required in the body.',
      createdBy: 'Parameter: createdBy is required in the body.',
    },
    properties: {
      createdBy: 'Parameter: createdBy should be valid.',
      roleId: 'Parameter: roleId should be valid.',
      name: 'Parameter: name should be valid.',
      email: 'Parameter: email should be valid.',
      mobileNumber: 'Parameter: mobileNumber should be valid.',
    },
  },
  required: [ 'email', 'name', 'mobileNumber', 'roleId', 'createdBy' ],
  additionalProperties: false,
};

module.exports = create;
