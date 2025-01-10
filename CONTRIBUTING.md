# Contributing to mes-engine

Thank you for your interest in contributing to mes-engine! This document provides guidelines and instructions for contributing to the project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Process](#development-process)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)
- [Testing Guidelines](#testing-guidelines)
- [Documentation](#documentation)
- [Release Process](#release-process)

## Code of Conduct

By participating in this project, you are expected to uphold our Code of Conduct:

- Use welcoming and inclusive language
- Be respectful of differing viewpoints and experiences
- Accept constructive criticism gracefully
- Focus on what is best for the community
- Show empathy towards other community members

## Getting Started

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/your-username/mes-engine.git
   ```
3. Add the upstream remote:
   ```bash
   git remote add upstream https://github.com/original-owner/mes-engine.git
   ```
4. Install dependencies:
   ```bash
   npm install
   ```

## Development Process

1. Create a new branch for your feature/fix:
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/your-fix-name
   ```

2. Make your changes, following our [coding standards](#coding-standards)

3. Run tests and ensure they pass:
   ```bash
   npm test
   ```

4. Update documentation as needed

5. Commit your changes using conventional commits:
   ```bash
   git commit -m "feat: add new video processing engine"
   git commit -m "fix: resolve memory leak in cache system"
   ```

## Pull Request Process

1. Update the README.md with details of changes if applicable
2. Update the docs/ with any necessary documentation
3. Add or update tests as needed
4. Ensure all tests pass and code coverage meets requirements
5. Submit a pull request to the `main` branch
6. Address any review comments

### PR Title Format
- feat: Add new feature
- fix: Fix an issue
- docs: Documentation changes
- style: Code style changes
- refactor: Code refactoring
- test: Add or update tests
- chore: Maintenance tasks

## Coding Standards

### TypeScript Guidelines

- Use TypeScript strict mode
- Prefer interfaces over types when possible
- Use explicit typing instead of inferring when the type isn't obvious
- Use meaningful variable and function names

```typescript
// Good
interface VideoConfig {
  quality: number;
  format: string;
}

// Avoid
type Config = {
  q: number;
  f: string;
}
```

### Code Style

- Use 2 spaces for indentation
- Use semicolons
- Use single quotes for strings
- Add trailing commas in objects and arrays
- Keep lines under 100 characters

### Best Practices

- Write pure functions when possible
- Use early returns to avoid deep nesting
- Handle errors appropriately
- Document complex algorithms
- Write self-documenting code

## Testing Guidelines

### Test Structure

```typescript
describe('Component', () => {
  describe('method()', () => {
    it('should handle normal case', () => {
      // Test
    });

    it('should handle error case', () => {
      // Test
    });
  });
});
```

### Coverage Requirements

- Statements: 85%
- Branches: 80%
- Functions: 90%
- Lines: 85%

### Running Tests

```bash
npm test              # Run all tests
npm run test:watch    # Run tests in watch mode
npm run test:coverage # Generate coverage report
```

## Documentation

- Update API documentation for any new or modified functionality
- Include JSDoc comments for public APIs
- Add examples for new features
- Update README.md if adding new features
- Keep docs/ up to date with changes

### Documentation Style

```typescript
/**
 * Processes a video chunk with specified quality settings
 * @param inputPath - Path to the input video file
 * @param quality - Quality settings for processing
 * @returns Promise resolving to processed chunk data
 * @throws {ProcessingError} When processing fails
 */
```

## Release Process

1. Update version number in package.json
2. Update CHANGELOG.md
3. Create release notes
4. Create a tagged release
5. Publish to npm

### Version Numbers

Follow semantic versioning (MAJOR.MINOR.PATCH):
- MAJOR: Breaking changes
- MINOR: New features, no breaking changes
- PATCH: Bug fixes, no breaking changes

## Questions or Problems?

- File an issue in the GitHub issue tracker
- Tag issues appropriately (bug, enhancement, question, etc.)
- Provide as much relevant information as possible

## License

By contributing, you agree that your contributions will be licensed under the same MIT License that covers the project.