module.exports = {
    parser: '@typescript-eslint/parser',  // Specifies the ESLint parser
    extends: [
        "eslint:recommended",
        "plugin:react/recommended",
        "plugin:@typescript-eslint/recommended",
        "prettier/@typescript-eslint",
        "plugin:prettier/recommended"
    ],
    plugins: ["react", "@typescript-eslint", "prettier"],
    "env": {
      es6: true,
        "node": true,
        "commonjs": true,
        "browser": true,
        "jasmine": true,
        "jest": true
      },
    parserOptions: {
        ecmaVersion: 2018,  // Allows for the parsing of modern ECMAScript features
        sourceType: 'module',  // Allows for the use of imports
    },
    rules: {
        '@typescript-eslint/explicit-function-return-type':'off',
        'react/prop-types': 'off',
        '@typescript-eslint/prefer-interface': 'off'
        // Place to specify ESLint rules. Can be used to overwrite rules specified from the extended configs
        // e.g. "@typescript-eslint/explicit-function-return-type": "off",
    },
    "settings": {
        "react": {
          "pragma": "React",
          "version": "detect"
        }
      },
};
