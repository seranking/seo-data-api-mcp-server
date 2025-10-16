// ESLint 9 (Flat Config) – TypeScript type-aware
import tseslint from 'typescript-eslint';
import pluginImport from 'eslint-plugin-import';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import unusedImports from 'eslint-plugin-unused-imports';
import eslintConfigPrettier from 'eslint-config-prettier';

export default [
  // Zamiast .eslintignore:
  {
    ignores: ['dist/', 'build/', 'coverage/', 'node_modules/', '.idea/'],
  },

  // Główny zestaw reguł (type-aware przez "project")
  ...tseslint.config({
    files: ['**/*.{ts,tsx,mts,cts}'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: ['./tsconfig.eslint.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // podpowiedzi globali dla vitest (opcjonalnie, jeśli używasz)
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
          // respektuje baseUrl/paths z tsconfig
          project: ['./tsconfig.eslint.json'],
          alwaysTryTypes: true,
        },
      },
    },
    plugins: {
      import: pluginImport,
      'simple-import-sort': simpleImportSort,
      'unused-imports': unusedImports,
    },
    rules: {
      // nieużywane importy/zmienne
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': [
        'warn',
        { vars: 'all', varsIgnorePattern: '^_', args: 'after-used', argsIgnorePattern: '^_' },
      ],

      // porządek importów
      'simple-import-sort/imports': 'warn',
      'simple-import-sort/exports': 'warn',
      'import/order': 'off',

      // higiena
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-debugger': 'warn',

      // TS – rozsądne luzowanie
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
    },
  }),

  // Wyłącza konflikty z Prettierem
  eslintConfigPrettier,
];
