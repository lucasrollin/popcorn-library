import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

// RTL's automatic DOM cleanup relies on a global afterEach, which we don't
// enable (explicit vitest imports, like the backend) — so register it here.
afterEach(cleanup);
