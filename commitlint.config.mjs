// The commit lint workflow and local commitlint runs load these rules.
export default {
  extends: ['@commitlint/config-conventional'],
  plugins: [
    {
      rules: {
        // Only environment variables, such as $ZPFX or ${ZINIT_MOD_DEBUG}, can use uppercase.
        'subject-lowercase-except-env': ({ subject }) => {
          if (!subject) return [true];
          const text = subject.replace(/\$[A-Z_0-9]+|\$\{[A-Z_0-9]+\}/g, '');
          return [text === text.toLowerCase(), 'subject must be lowercase, except for environment variables'];
        },
      },
    },
  ],
  rules: {
    'subject-case': [0],
    'subject-lowercase-except-env': [2, 'always'],
    'header-max-length': [2, 'always', 80],
    'type-enum': [
      2,
      'always',
      ['build', 'chore', 'ci', 'docs', 'feat', 'fix', 'perf', 'refactor', 'revert', 'style', 'test'],
    ],
  },
};
