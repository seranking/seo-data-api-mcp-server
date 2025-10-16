// ESLint 9 (Flat Config) – TypeScript type-aware
import nodePlugin from 'eslint-plugin-n';
import pluginPromise from 'eslint-plugin-promise';
import typescriptEslint from 'typescript-eslint';
import pluginImport from 'eslint-plugin-import';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import unusedImports from 'eslint-plugin-unused-imports';
import eslintConfigPrettier from 'eslint-config-prettier';

export default [
  {
    ignores: ['eslint.config.js', 'dist/', 'build/', 'coverage/', 'node_modules/', '.idea/'],
  },

  // Node presets
  nodePlugin.configs['flat/recommended-module'],
  pluginPromise.configs['flat/recommended'],

  // TS rules
  ...typescriptEslint.config({
    files: ['**/*.{ts,tsx,mts,cts}'],
    languageOptions: {
      parser: typescriptEslint.parser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: ['./tsconfig.eslint.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // vitest global hints
      globals: {
        vi: 'readonly',
        describe: 'readonly',
        it: 'readonly',
        test: 'readonly',
        expect: 'readonly',
        beforeAll: 'readonly',
        afterAll: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
      },
    },
    settings: {
      'import/resolver': {
        typescript: {
          // respects baseUrl/paths from tsconfig
          project: ['./tsconfig.eslint.json'],
          alwaysTryTypes: true,
        },
      },
    },
    plugins: {
      import: pluginImport,
      '@typescript-eslint': typescriptEslint.plugin,
      'simple-import-sort': simpleImportSort,
      'unused-imports': unusedImports,
    },
    rules: {
      // unused imports/vars
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': [
        'warn',
        { vars: 'all', varsIgnorePattern: '^_', args: 'after-used', argsIgnorePattern: '^_' },
      ],

      // imports sort
      'simple-import-sort/imports': 'warn',
      'simple-import-sort/exports': 'warn',
      'import/order': 'off',

      // hygiene
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-debugger': 'warn',
      'arrow-body-style': ['warn', 'as-needed'],
      'no-const-assign': 'error',
      'no-cond-assign': ['error', 'except-parens'],
      'no-constant-binary-expression': 'error',
      'no-constant-condition': ['error', { checkLoops: false }],
      'no-dupe-args': 'error',
      'no-dupe-class-members': 'error',
      'no-dupe-else-if': 'error',
      'no-duplicate-case': 'error',
      'no-fallthrough': 'error',
      'no-implied-eval': 'error',
      'no-new-wrappers': 'error',
      'no-prototype-builtins': 'error',
      'no-return-assign': ['error', 'except-parens'],
      'no-self-compare': 'error',
      'no-sequences': 'error',
      'no-throw-literal': 'error',
      'no-unreachable': 'error',
      'no-unsafe-finally': 'error',
      'no-useless-call': 'error',
      'no-useless-concat': 'error',
      'no-with': 'error',
      'prefer-promise-reject-errors': 'error',
      radix: ['error', 'always'],
      'valid-typeof': 'error',
      eqeqeq: ['error', 'smart'],

      // TypeScript critical
      '@typescript-eslint/no-floating-promises': [
        'error',
        { ignoreVoid: false, ignoreIIFE: false },
      ],
      '@typescript-eslint/no-misused-promises': [
        'error',
        { checksVoidReturn: { attributes: false } },
      ],
      '@typescript-eslint/require-await': 'error',
      // @todo: this should be turned on and "any" types fixed
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-call': 'error',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-argument': 'error',
      '@typescript-eslint/consistent-type-assertions': [
        'error',
        { assertionStyle: 'as', objectLiteralTypeAssertions: 'never' },
      ],
      '@typescript-eslint/no-unnecessary-type-assertion': 'error',
      '@typescript-eslint/no-non-null-assertion': 'error',
      '@typescript-eslint/no-unsafe-enum-comparison': 'error',
      '@typescript-eslint/no-duplicate-enum-values': 'error',
      '@typescript-eslint/no-duplicate-type-constituents': 'error',
      '@typescript-eslint/no-confusing-void-expression': ['error', { ignoreArrowShorthand: false }],
      '@typescript-eslint/ban-ts-comment': [
        'error',
        { 'ts-expect-error': 'allow-with-description' },
      ],

      // Promise typical bugs
      'promise/always-return': 'error',
      'promise/no-return-wrap': 'error',
      'promise/param-names': 'error',
      'promise/no-new-statics': 'error',
      'promise/no-nesting': 'warn',
      'promise/no-promise-in-callback': 'warn',
      'promise/no-callback-in-promise': 'warn',
      'promise/no-return-in-finally': 'error',
      'promise/valid-params': 'error',

      // Imports cycle TS resolver problems
      'import/no-cycle': ['warn', { ignoreExternal: true }],
      'import/no-self-import': 'error',
      'import/no-useless-path-segments': ['error', { noUselessIndex: true }],

      // Node
      'n/no-unsupported-features/node-builtins': 'off',
      'n/no-unpublished-import': 'off',
      'n/no-missing-import': 'off',
      'n/no-unsupported-features/node-builtin': 'off', // gives false positives with unsupported features
      'n/no-process-exit': 'off', // makes sense in server applications where it would kill the Node process unintentionally
    },
  }),

  // Turns off Prettier conflicts
  eslintConfigPrettier,
];
