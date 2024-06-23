const login = {
  description: 'Defines the structure for HTTP POST request body',
  type: 'object',
  properties: {
    userName: {
      type: 'string',
      description: 'userName',
      maxLength: 50,
    },
    password: {
      type: 'string',
      description: 'password',
      maxLength: 50,
    },
  },
  required: [ 'userName', 'password' ],
  additionalProperties: false,
};

module.exports = login;
