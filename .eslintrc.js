module.exports = {
  extends: ["airbnb", "airbnb/hooks", "prettier", "plugin:prettier/recommended"],
  plugins: ["prettier"],
  parser: "@babel/eslint-parser",
  ignorePatterns: ["dist", "node_modules", ".parcel-cache"],
  rules: {
    "no-console": "off",
    "class-methods-use-this": "off",
    "react/prop-types": "off",
    "no-param-reassign": "off",
    "no-underscore-dangle": "off",
    "react/react-in-jsx-scope": "off", // react 18
    "no-restricted-syntax": "off",
    "no-await-in-loop": "off",
    "no-continue": "off",
    "import/prefer-default-export": "off",
    "react/jsx-filename-extension": "off",
    "jsx-a11y/no-autofocus": "off",
    "react/jsx-props-no-spreading": "off",
    "react/function-component-definition": [
      "error",
      {
        namedComponents: "function-declaration",
        unnamedComponents: "function-expression",
      },
    ],
  },
  globals: {
    window: "readonly",
    document: "readonly",
    fetch: "readonly",
    DOMParser: "readonly",
  },
};
