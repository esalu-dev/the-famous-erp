import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores(['.next/**', 'out/**', 'build/**', 'next-env.d.ts']),
  {
    rules: {
      // Desactivamos la regla agresiva de react-hooks/set-state-in-effect si es muy restrictiva,
      // o la dejamos activa y la silenciamos donde sea necesario.
      'react-hooks/set-state-in-effect': 'off',
    },
  },
]);
