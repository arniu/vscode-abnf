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

## Publishing Process

### Prerequisites

1. Ensure you have a valid VSCode Marketplace publisher account
2. Install the VSCode Extension Manager (vsce):
   ```bash
   npm install -g @vscode/vsce
   ```

### Pre-release Checklist

Before publishing, ensure:

1. **Code Quality**

   ```bash
   # Run all quality checks
   npm run lint
   npm run format:check
   npm run compile
   ```

2. **Version Management**
   - Update version in `package.json`
   - Update `CHANGELOG.md` with new features/fixes
   - Commit all changes with descriptive message

3. **Testing**
   - Test the extension in VSCode development mode
   - Verify all features work as expected
   - Check for any runtime errors

### Publishing Steps

1. **Package the Extension**

   ```bash
   # Create a .vsix package
   vsce package
   ```

2. **Publish to Marketplace**

   ```bash
   # Publish directly to marketplace
   vsce publish

   # Or publish a specific version
   vsce publish 1.0.0
   ```

3. **Verify Publication**
   - Check the extension appears on VSCode Marketplace
   - Test installation from marketplace
   - Verify extension works after installation

### Version Management

- **Patch** (x.x.X): Bug fixes
- **Minor** (x.X.x): New features, backward compatible
- **Major** (X.x.x): Breaking changes

### Rollback Process

If issues are found after publication:

1. **Immediate Actions**
   - Unpublish the problematic version (if possible)
   - Create a hotfix version

2. **Communication**
   - Update GitHub issues
   - Notify users of the issue and fix timeline

### Best Practices

- Always test thoroughly before publishing
- Keep changelog up to date
- Use semantic versioning
- Document breaking changes clearly
- Test installation from marketplace after each release
