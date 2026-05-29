// @ts-check
import tseslint from 'typescript-eslint';
import baseConfig from '../../tooling/eslint/base.mjs';

export default tseslint.config(
  {
    ignores: ['eslint.config.mjs', 'dist/**', 'prisma/**', 'src/generated/**'],
  },
  ...baseConfig,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
);
