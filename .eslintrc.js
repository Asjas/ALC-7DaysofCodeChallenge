module.exports = {
  "extends": [
    "airbnb",
    "plugin:prettier/recommended",
  ],
  "parser": "babel-eslint",
  "parserOptions": {
    "ecmaVersion": 8,
    "ecmaFeatures": {
      "impliedStrict": true,
      "classes": true
    }
  },
  "env": {
    "browser": true,
  },
  "rules": {
    "no-use-before-define": 0,
    "array-callback-return": 0,
    "no-debugger": 0,
    "no-restricted-globals": 0,
    "no-case-declarations": 0,
    "no-alert": 0,
    "no-unused-vars": [
      1,
      {
        "argsIgnorePattern": "res|next|^err"
      }
    ],
    "prefer-const": [
      "error",
      {
        "destructuring": "all",
      }
    ],
    "arrow-body-style": [
      2,
      "as-needed"
    ],
    "no-unused-expressions": [
      2,
      {
        "allowTaggedTemplates": true
      }
    ],
    "no-console": 0,
    "import/prefer-default-export": 0,
    "import": 0,
    "func-names": 0,
    "space-before-function-paren": 0,
    "comma-dangle": 0,
    "max-len": 0,
    "import/extensions": 0,
    "no-underscore-dangle": 0,
    "consistent-return": 0,
    "radix": 0,
    "no-shadow": [
      2,
      {
        "hoist": "all",
        "allow": [
          "resolve",
          "reject",
          "done",
          "next",
          "err",
          "error"
        ]
      }
    ],
    "quotes": [
      2,
      "single",
      {
        "avoidEscape": true,
        "allowTemplateLiterals": true
      }
    ],
    "prettier/prettier": [
      "error",
      {
        "trailingComma": "all",
        "singleQuote": true,
        "printWidth": 80,
        "semi": true,
        "bracketSpacing": true,
        "arrowParens": "avoid",
        "useTabs": false,
        "tabWidth": 2
      }
    ],
  },
  "plugins": [
    "prettier"
  ]
}
