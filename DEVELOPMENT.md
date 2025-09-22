# Development Guide

## Code Quality Tools

This project has been configured with the following code quality tools:

### ESLint

- Static analysis for TypeScript/JavaScript code
- Configuration file: `eslint.config.js` (ESLint 9.x new format)
- Optimized specifically for VSCode extension development
- Includes TypeScript recommended rules and type checking rules
- Integrated with Prettier for consistent formatting
- Available commands:
  - `npm run lint` - Check for code issues
  - `npm run lint:fix` - Automatically fix fixable issues

### Prettier

- Code formatting tool for consistent code style
- Configuration file: `.prettierrc`
- Ignore file: `.prettierignore`
- Available commands:
  - `npm run format` - Format all files
  - `npm run format:check` - Check formatting status

### Git Hooks

- Uses Husky and lint-staged to automatically run lint before commits
- Configuration file: `.husky/pre-commit`
- Ensures committed code meets project standards

## Development Environment Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Initialize Git hooks:

   ```bash
   npm run prepare
   ```

3. Recommended VSCode extensions:
   - Prettier - Code formatter
   - ESLint
   - TypeScript Importer

## Workflow

1. During development, VSCode will automatically format code and display ESLint errors
2. When committing code, pre-commit hooks will automatically run lint and formatting
3. Ensure all checks pass before committing code

## Manual Execution

If you need to run checks manually:

```bash
# Check for code issues
npm run lint

# Automatically fix issues
npm run lint:fix

# Format code
npm run format

# Check formatting status
npm run format:check
```
