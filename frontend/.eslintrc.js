module.exports = {
    "env": [
      'eslint:recommended',
      'plugin:vue/essential',
      'plugin:@typescript-eslint/recommended',
      'plugin:vue/vue3-essential'
    ],

    "extends": [
        "eslint:recommended",
        "plugin:vue/essential",
        "plugin:@typescript-eslint/recommended"
    ],

    "parserOptions": {
        "ecmaVersion": 13,
        "parser": "@typescript-eslint/parser",
        "sourceType": "module"
    },

    "plugins": [
        "vue",
        "@typescript-eslint"
    ],

    "rules": {
        "indent": [
            "error",
            "tab"
        ],
        "linebreak-style": [
            "error",
            "unix"
        ],
        "quotes": [
            "error",
            "single"
        ],
        "semi": [
            "error",
            "never"
        ]
    },

    root: true,

    env: {
      browser: true,
      es2021: true,
      node: true
    },

    parserOptions: {
      ecmaVersion: 2020,
      parser: '@typescript-eslint/parser',
      sourceType: 'module'
    },

    rules: {
      indent: [
        'error',
        'tab'
      ],
      'linebreak-style': [
        'error',
        'unix'
      ],
      quotes: [
        'error',
        'single'
      ],
      semi: [
        'error',
        'never'
      ],
      'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
      'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off'
    }
};
