module.exports = {
    parser: 'babel-eslint',
    parserOptions: {
        ecmaFeatures: {
            jsx: true,
        },
    },
    extends: 'airbnb',
    plugins: ['react', 'jsx-a11y', 'import'],
    rules: {
        // "class-methods-use-this": "off",
        // "default-case": "off",
        // "eqeqeq": "off",
        // "import/no-dynamic-require": "off",
        indent: ['error', 4],
        // "func-names": "off",
        // "global-require": "off",
        // "import/prefer-default-export": "off",
        // "jsx-a11y/href-no-hash": "off",
        // "linebreak-style": "off",
        'max-len': ['error', 150, 4],
        // "no-bitwise": "off",
        // "no-cond-assign": "off",
        'no-console': 'off',
        // "no-continue": "off",
        // "no-control-regex": "off",
        // "no-eval": "off",
        // "no-irregular-whitespace": "off",
        // "no-lonely-if": "off",
        // "no-mixed-operators": "off",
        // "no-multi-spaces": "off",
        'no-param-reassign': 'off',
        // "no-plusplus": "off",
        'no-prototype-builtins': 'off',
        // "no-restricted-syntax": "off",
        // "no-underscore-dangle": "off",
        'no-unused-vars': ['warn', { vars: 'all', args: 'after-used', ignoreRestSiblings: true }],
        // "object-curly-newline": "off",
        /* "prefer-destructuring": ["error", {
            "array": false,
            "object": true
        }], */
        // "quote-props": "off"
        'react/jsx-filename-extension': 'off',
        'react/jsx-indent': ['error', 4],
        'react/jsx-indent-props': ['error', 4],
        'react/no-unused-state': 'warn',
        'react/prop-types': 'off',
    },
    globals: {
        document: 1,
    },
};
