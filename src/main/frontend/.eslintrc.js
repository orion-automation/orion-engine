module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true
  },
  extends: [
    "plugin:vue/strongly-recommended",
    "prettier"
  ],
  globals: {
    Atomics: "readonly",
    SharedArrayBuffer: "readonly"
  },
  "parserOptions": {
    "parser": "@babel/eslint-parser",
    "ecmaVersion": 2018,
    "sourceType": "module"
  },
  plugins: [
    "vue"
  ],
  rules: {
    "vue/require-default-prop": "off",
    "vue/require-valid-default-prop": "off",
    "vue/no-custom-modifiers-on-v-model": "off",
    "vue/no-unused-components": "off",
    "vue/first-attribute-linebreak": "off",
    "semi": ["error", "always"],
    "quotes": ["error", "double", { "avoidEscape": true }],
    "vue/multi-word-component-names": 0,
    "vue/no-mutating-props": 0
  }
};
