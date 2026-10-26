export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [2, 'always', ['feat', 'fix', 'perf', 'ui', 'config', 'refactor', 'style', 'docs', 'build', 'ci', 'chore', 'revert']],
    'subject-case': [2, 'always', 'lower-case'],
    'header-max-length': [2, 'always', 72],
    'scope-case': [2, 'always', 'kebab-case'],
    'body-max-line-length': [1, 'always', 100],
  },
}
