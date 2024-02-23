/* eslint-disable no-undef */
module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  plugins: [
    '@typescript-eslint',
    '@stylistic/js',
    // '@stylistic/ts',
    // 'prettier',
  ],
  parser: '@typescript-eslint/parser',
  rules: {
    '@typescript-eslint/no-namespace': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
  },
  root: true,
}
