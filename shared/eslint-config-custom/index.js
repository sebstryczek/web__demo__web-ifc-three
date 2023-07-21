module.exports = {
  plugins: [
    "react",
    "jest-formatting",
    "jsx-a11y",
    "unicorn",
    "@typescript-eslint",
    "import",
    "simple-import-sort",
  ],
  extends: [
    "turbo",
    "prettier",
    "plugin:prettier/recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:unicorn/recommended",
    "plugin:jsx-a11y/recommended",
    "plugin:import/recommended",
  ],
  parser: "@typescript-eslint/parser",
  rules: {
    "prettier/prettier": "warn",
    "unicorn/filename-case": "off",
    "unicorn/no-useless-undefined": "off",
    "unicorn/no-array-for-each": "off",
    "unicorn/no-array-reduce": "off",
    "unicorn/no-lonely-if": "off",
    "import/named": "off",
    "import/no-unresolved": "off",
    "simple-import-sort/imports": [
      "error",
      {
        groups: [
          ["^\\u0000"],
          ["^node:"],
          ["^react"],
          ["^@?\\w"],
          ["^"],
          ["^\\."],
        ],
      },
    ],
    "simple-import-sort/exports": "error",
    "react/jsx-no-useless-fragment": "error",
    "@typescript-eslint/ban-ts-comment": "off",
    "@typescript-eslint/no-empty-interface": "warn",
  },
  overrides: [
    {
      files: ["*.test.ts", "*.test.tsx"],
      extends: ["plugin:jest-formatting/recommended"],
      rules: {
        "unicorn/prevent-abbreviations": "off",
        "unicorn/no-null": "off",
      },
    },
  ],
};
