const setPassword = {
  title: 'change password form',
  description: 'Defines the structure for HTTP POST request body',
  type: 'object',
  properties: {
    email: {
      type: 'string',
      description: 'email of user',
      format: 'email',
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
    otp: {
      type: 'string',
      description: 'OTP, one time password sent on user mobile number.',
      pattern: '^[0-9]{6}',
      maxLength: 6,
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
  },
  errorMessage: {
    required: {
      email: 'Email is required in the body.',
      otp: 'Parameter: otp is required in the body.',
      newPassword: 'Password is required in the body.',
      confirmPassword: 'ConfirmPassword is required in the body.',
    },
    properties: {
      email: 'Parameter: email should be valid.',
      otp: 'Parameter: otp should be valid.',
      newPassword: 'Password should be valid. should be min 8 and max 15 char, alteat one small letter, one special and one capital with number.',
      confirmPassword: 'Mismatched with password.',
    },
  },
  anyOf: [
    {
      required: [ 'email', 'otp', 'newPassword', 'confirmPassword' ],
    },
    {
      required: [ 'mobileNumber', 'otp', 'newPassword', 'confirmPassword' ],
    },
    {
      required: [ 'mobileNumber', 'password', 'newPassword', 'confirmPassword' ],
    },
    {
      required: [ 'email', 'password', 'newPassword', 'confirmPassword' ],
    },
  ],
  additionalProperties: false,
};

module.exports = setPassword;
