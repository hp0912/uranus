module.exports = {
  env: {
    "browser": true,
    "commonjs": true,
    "es6": true,
    "node": true
  },
  "parser": "babel-eslint",
  "extends": "airbnb",
  parserOptions: {
    "ecmaFeatures": {
      "jsx": true
    },
    "sourceType": "module"
  },
  plugins: [
    "react",
    "import"
  ],
  rules: {
    "react/display-name": ["off"],
    "react/jsx-filename-extension": ["off"],
    "react/jsx-indent": ["error", 2],
    "react/no-find-dom-node": ["off"],
    "react/sort-comp": ["off"],
    "no-console": ["off"],
    "import/no-unresolved": ["off"],
    "consistent-return": 1,
    "no-underscore-dangle": 1,
    "camelcase": 1,
    "no-restricted-globals": 1,
    "react/require-default-props": 1,
    "class-methods-use-this": 1,
    "import/extensions": 0,
  },
  globals: {
    isNaN: true,
    location: true,
  }
};
