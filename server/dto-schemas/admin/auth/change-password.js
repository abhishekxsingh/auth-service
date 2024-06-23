const changePassword = {
  title: 'change password form',
  description: 'Defines the structure for HTTP POST request body',
  type: 'object',
  properties: {
    userId: {
      type: 'string',
      description: 'public guid of the user',
      format: 'uuid',
    },
    password: {
      type: 'string',
      description: 'Password.',
      pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[#$^+=!*()@%&]).{8,15}$',
    },
    confirmPassword: {
      const: {
        $data: '1/password',
      },
      type: 'string',
    },
  },
  errorMessage: {
    required: {
      userId: 'Parameter: userId is required in the body.',
      password: 'Password is required in the body.',
      confirmPassword: 'ConfirmPassword is required in the body.',
    },
    properties: {
      userId: 'Parameter: userId should be valid.',
      password: 'Password should be valid. should be min 8 and max 15 char, alteat one small letter, one special and one capital with number.',
      confirmPassword: 'Mismatched with password.',
    },
  },
  required: [ 'userId', 'password', 'confirmPassword' ],
  additionalProperties: false,
};

module.exports = changePassword;
