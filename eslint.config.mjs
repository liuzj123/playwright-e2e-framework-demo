import playwright from 'eslint-plugin-playwright';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  ...tseslint.configs.recommended,
  {
    ...playwright.configs['flat/recommended'],
    rules: {
      'playwright/expect-expect': 'warn',
      'playwright/no-skipped-test': 'off',
    },
  }
);