module.exports = {
  extends: '../.eslintrc.js',
  rules: {
    'sort-keys': 0,
    'filenames/match-regex': [ 2, '^[0-9-a-z-]+$', true ],
  },
};
