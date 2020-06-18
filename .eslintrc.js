module.exports = {
  extends: 'react-app',
  plugins: ['import'],
  rules: {
    'import/order': [
      'error',
      {
        pathGroups: [
          {
            pattern: '~(src|.)/**',
            group: 'builtin',
            position: 'after',
          },
          {
            pattern: 'src/**',
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
