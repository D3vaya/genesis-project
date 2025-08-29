const nextJest = require('next/jest')

const createJestConfig = nextJest({
  dir: './',
})

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jsdom',
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/node_modules/**',
    '!src/generated/**',
    '!src/**/*.stories.{js,jsx,ts,tsx}',
    '!src/app/**/layout.tsx',
    '!src/app/**/page.tsx',
    '!src/data/mock/**',
    '!src/lib/test-utils.tsx',
    '!src/**/*.config.{js,ts}',
    '!src/middleware.ts',
  ],
  coverageThreshold: {
    global: {
      branches: 4,
      functions: 3,
      lines: 5,
      statements: 5,
    },
  },
}

module.exports = createJestConfig(customJestConfig)
