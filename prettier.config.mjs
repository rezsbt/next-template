/** @type {import("prettier").Config} */
const config = {
  printWidth: 100,
  tabWidth: 2,
  useTabs: false,
  semi: true,
  singleQuote: true,
  trailingComma: 'all',
  bracketSpacing: true,
  bracketSameLine: false,
  arrowParens: 'always',
  endOfLine: 'lf',
  jsxSingleQuote: false,
  singleAttributePerLine: false,
  proseWrap: 'preserve',
  embeddedLanguageFormatting: 'auto',
  overrides: [
    {
      files: ['*.md', '*.mdx'],
      options: {
        proseWrap: 'preserve',
      },
    },
    {
      files: ['*.json', '*.jsonc'],
      options: {
        tabWidth: 2,
      },
    },
    {
      files: ['*.yml', '*.yaml'],
      options: {
        singleQuote: false,
      },
    },
  ],
};

export default config;
