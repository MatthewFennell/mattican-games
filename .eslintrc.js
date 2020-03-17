module.exports = {
  env: {
    browser: true,
    es6: true,
  },
  extends: [
    'airbnb',"plugin:jest/recommended"
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  plugins: ["react", "jsx-a11y", "import", "jest", "react-hooks"],
  rules: {
    quotes: ["error", "single"],
    "arrow-parens": ["error", "as-needed"],
    "comma-dangle": ["error", "never"],
    "object-curly-spacing": ["error", "always"],
    "array-bracket-spacing": ["warn", "never"],
    "comma-spacing": "error",
    "linebreak-style": ["error", "windows"],
    "react/jsx-props-no-spreading": [0],
    "react/destructuring-assignment": [0],
    "jsx-a11y/click-events-have-key-events": "off",
    "indent": ["error", 4],
    "react/jsx-indent": ["error", 4],
    "react/jsx-indent-props": ["error", 4],
    "react-hooks/exhaustive-deps": "off"
  }
};
