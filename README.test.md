# How to Run Tests in this Project

This document provides instructions on how to run tests in this React project, which uses Vitest as the testing framework along with React Testing Library.

## Prerequisites

Before running tests, make sure you have:

1. Node.js and npm installed on your machine
2. All project dependencies installed by running:
   ```
   npm install
   ```

## Available Test Commands

The project has several npm scripts configured for testing:

### Run All Tests Once

To run all tests once and see the results:

```bash
npm test
```

or

```bash
npm run test
```

### Run Tests in Watch Mode

To run tests in watch mode, which will automatically re-run tests when files change:

```bash
npm run test:watch
```

This is useful during development when you're making changes and want immediate feedback.

### Generate Test Coverage Report

To run tests and generate a coverage report:

```bash
npm run test:coverage
```

This will show you how much of your code is covered by tests.

## Test Structure

Tests in this project are organized as follows:

- Test files are located in `__tests__` directories near the components they test
- Test files use the naming convention `ComponentName.test.jsx`
- The global test setup is in `src/test/setup.js`

## Example Test Files

The project includes the following test files:

1. `src/components/__tests__/CountryDetail.test.jsx` - Tests for the CountryDetail component
2. `src/components/__tests__/CountryList.test.jsx` - Tests for the CountryList component

## Writing New Tests

When writing new tests:

1. Create a new file in the appropriate `__tests__` directory with the `.test.jsx` extension
2. Import the necessary testing utilities:
   ```jsx
   import { render, screen } from '@testing-library/react';
   import { describe, it, expect } from 'vitest';
   ```
3. Import the component you want to test
4. Write your tests using the describe/it pattern
5. Use React Testing Library to render components and make assertions

## Troubleshooting

If you encounter issues running tests:

1. Make sure all dependencies are installed correctly
2. Check that the component you're testing doesn't have dependencies that need to be mocked
3. Look at existing test files for examples of how to mock dependencies
4. Refer to the Vitest and React Testing Library documentation for more advanced testing techniques