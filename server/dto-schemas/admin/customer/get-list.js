const getList = {
  title: 'get user list',
  description: 'Defines the structure for HTTP POST request body',
  type: 'object',
  properties: {
    pageSize: {
      anyOf: [
        {
          type: 'string',
          pattern: '^[0-9]',
          minLength: 1,
          maxLength: 4,
        },
        {
          type: 'integer',
          minimum: 10,
          maximum: 1000,
        } ],
      description: 'pageSize.',
    },
    pageNumber: {
      anyOf: [
        {
          type: 'string',
          pattern: '^[0-9]',
          minLength: 1,
          maxLength: 4,
        },
        {
          type: 'integer',
          minimum: 10,
          maximum: 1000,
        } ],
    },
    status: {
      type: 'string',
      description: 'status',
    },
  },
  additionalProperties: false,
  errorMessage: {
    type: 'Should be a valid json object',
    properties: {
      userId: 'Parameter: userId should be valid uuid.',
      status: 'Parameter: status should be valid string.',

    },
  },
};

module.exports = getList;

