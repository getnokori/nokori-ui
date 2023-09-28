require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  extends: [
    'eslint:recommended',
    'plugin:vue/vue3-recommended',
    'plugin:json/recommended',
    '@vue/eslint-config-typescript/recommended',
    '@vue/eslint-config-prettier'
  ],
  rules: {
    'vue/require-default-prop': 'off',
    'no-implicit-any': 'off',
    'no-console': 'error', // TODO: remove this
    '@typescript-eslint/no-non-null-assertion': 'off',
    'no-multiple-empty-lines': [
      'error',
      {
        max: 1,
        maxBOF: 1
      }
    ],
    quotes: ['error', 'single', { allowTemplateLiterals: true }],
    'comma-dangle': ['error', 'never'],
    'no-multi-spaces': 'error'
  }
}
