import type { JestConfigWithTsJest } from 'ts-jest';

const jestConfig: JestConfigWithTsJest = {
  testEnvironment: 'node',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  clearMocks: true,
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  transform: {
    '^.+\\.ts?$': [
      'ts-jest',
      {
        diagnostics: false,
      },
    ],
  },
  transformIgnorePatterns: ['node_modules/(?!sinon)/'],
  reporters: ['default'],
  coverageReporters: ['text', 'text-summary', 'lcov'],
  coverageDirectory: 'coverage',
  coverageProvider: 'babel',
  coverageThreshold: {
    global: {
      statements: 100,
      branches: 100,
      functions: 100,
      lines: 100,
    },
  },
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    'scripts/**/*.{js,jsx,ts,tsx}',
    '!<rootDir>/node_modules/',
    '!<rootDir>/demoDist/**',
    '!<rootDir>/dist/**',
    '!**/__tests-utils__/**',
    '!**/__fixtures__/**',
    '!src/**/*.d.ts',
    '!src/**/types.ts',
    '!src/**/typings.ts',
    '!src/index.ts',
    '!scripts/**/*.d.ts',
    '!scripts/**/types.ts',
    '!scripts/**/typings.ts',
  ],
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.[jt]s?(x)',
    '<rootDir>/src/**/?(*.)+(spec|test).[jt]s?(x)',
    '<rootDir>/scripts/**/__tests__/**/*.[jt]s?(x)',
    '<rootDir>/scripts/**/?(*.)+(spec|test).[jt]s?(x)',
  ],
};

export default jestConfig;
