/* eslint-disable import/no-extraneous-dependencies */
import matchers from '@testing-library/jest-dom/matchers';
import { expect } from 'vitest';
import mockReactFlow from './reactflowSetup';

expect.extend(matchers);

mockReactFlow();
