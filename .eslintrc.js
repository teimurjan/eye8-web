module.exports = {
  extends: 'react-app',
  plugins: ['import'],
  rules: {
    'no-duplicate-imports': 'error',
    'import/order': [
      'error',
      {
        pathGroups: [
          {
            pattern: '~(@eye8|.)/**',
            group: 'builtin',
            position: 'after',
          },
          {
            pattern: '@eye8/**',
            group: 'external',
            position: 'after',
          },
        ],
        pathGroupsExcludedImportTypes: ['builtin'],
        'newlines-between': 'always',
        alphabetize: {
          order: 'asc',
          caseInsensitive: true,
        },
      },
    ],
  },
};
