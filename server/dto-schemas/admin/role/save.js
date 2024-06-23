const saveRole = {
  title: 'save role form',
  description: 'Defines the structure for HTTP POST request body',
  type: 'object',
  properties: {
    role: {
      type: 'string',
      description: 'role name',
      pattern: '\\s*^[\\d0-9a-zA-Z][\\d0-9a-zA-Z\\s]+$',
      maxLength: 100,
    },
    description: {
      type: 'string',
      description: 'description',
      maxLength: 255,
    },
    createdBy: {
      type: 'string',
      description: 'createdBy',
      format: 'uuid',
    },
    updatedBy: {
      type: 'string',
      description: 'updatedBy',
      format: 'uuid',
    },
  },
  required: [ 'role', 'description' ],
  errorMessage: {
    required: {
      role: 'Parameter: role is required.',
      description: 'Parameter: description is required',
      createdBy: 'Parameter: createdBy is required',
      updatedBy: 'Parameter: updatedBy is required',
    },
    properties: {
      role: 'Parameter: role should be a valid string',
      description: 'Parameter: description should be a valid string',
      createdBy: 'Parameter: createdBy should be a valid UUID',
      updatedBy: 'Parameter: updatedBy should be a valid UUID',
    },
  },
  additionalProperties: false,
};

module.exports = saveRole;
