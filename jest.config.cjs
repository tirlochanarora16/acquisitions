/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

/** @type {import('jest').Config} */
const config = {
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageProvider: 'v8',
  moduleNameMapper: {
    '^#config/(.*)$': '<rootDir>/src/config/$1',
    '^#controllers/(.*)$': '<rootDir>/src/controllers/$1',
    '^#models/(.*)$': '<rootDir>/src/models/$1',
    '^#routes/(.*)$': '<rootDir>/src/routes/$1',
    '^#services/(.*)$': '<rootDir>/src/services/$1',
    '^#middleware/(.*)$': '<rootDir>/src/middleware/$1',
    '^#utils/(.*)$': '<rootDir>/src/utils/$1',
    '^#validation/(.*)$': '<rootDir>/src/validations/$1',
  },
};

module.exports = config;
