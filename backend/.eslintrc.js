module.exports = {
    extends: 'airbnb-base',
    rules: {
        // "class-methods-use-this": "off",
        // "default-case": "off",
        eqeqeq: 'off',
        // "import/no-dynamic-require": "off",
        indent: ['error', 4],
        // "func-names": "off",
        // "global-require": "off",
        // "import/prefer-default-export": "off",
        // "jsx-a11y/href-no-hash": "off",
        // "linebreak-style": "off",
        'max-len': ['error', { code: 140, tabWidth: 4, ignoreComments: true }],
        // "no-bitwise": "off",
        // "no-cond-assign": "off",
        'no-console': 'off',
        // "no-continue": "off",
        // "no-control-regex": "off",
        'no-eval': 'off',
        // "no-irregular-whitespace": "off",
        // "no-lonely-if": "off",
        // "no-mixed-operators": "off",
        // "no-multi-spaces": "off",
        'no-new': 'off',
        'no-param-reassign': 'off',
        'no-plusplus': 'off',
        'no-prototype-builtins': 'off',
        // "no-restricted-syntax": "off",
        // "no-underscore-dangle": "off",
        'no-unused-vars': ['warn', { vars: 'all', args: 'after-used', ignoreRestSiblings: true }],
        'object-curly-newline': ['error', { minProperties: 5, multiline: true, consistent: true }],
        /* "prefer-destructuring": ["error", {
            "array": false,
            "object": true
        }], */
        // "quote-props": "off"
    },
};
