# Contributing to CarbonVault

Thank you for your interest in contributing to CarbonVault! This document provides guidelines and instructions for contributing.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Testing Guidelines](#testing-guidelines)
- [Commit Messages](#commit-messages)
- [Pull Request Process](#pull-request-process)

## Code of Conduct

By participating in this project, you agree to maintain a respectful and inclusive environment for all contributors.

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Git
- Firebase account (for backend services)

### Setup

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/YOUR_USERNAME/carbonvault.git
   cd carbonvault
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Copy environment variables:
   ```bash
   cp .env.example .env
   ```

5. Configure Firebase credentials in `.env`

6. Start development server:
   ```bash
   npm run dev
   ```

## Development Workflow

### Branch Naming

- `feature/` - New features (e.g., `feature/add-export-csv`)
- `fix/` - Bug fixes (e.g., `fix/calculation-error`)
- `docs/` - Documentation updates
- `refactor/` - Code refactoring
- `test/` - Test additions or modifications

### Development Process

1. Create a new branch from `main`:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes following our coding standards

3. Write or update tests for your changes

4. Run tests and linting:
   ```bash
   npm test
   npm run lint
   npm run type-check
   ```

5. Commit your changes with a descriptive message

6. Push to your fork and create a pull request

## Coding Standards

### TypeScript

- **Strict Mode**: All code must pass TypeScript strict mode
- **Type Safety**: Avoid `any` types; use proper interfaces and types
- **Naming Conventions**:
  - Components: `PascalCase` (e.g., `CarbonCalculator`)
  - Functions/Variables: `camelCase` (e.g., `calculateFootprint`)
  - Constants: `UPPER_SNAKE_CASE` (e.g., `API_ENDPOINT`)
  - Types/Interfaces: `PascalCase` (e.g., `CarbonFootprint`)

### Code Style

- **Formatting**: Use Prettier (runs automatically on commit)
- **Linting**: Follow ESLint rules
- **Line Length**: Maximum 100 characters
- **Indentation**: 2 spaces

### Documentation

- **JSDoc**: All exported functions must have JSDoc comments
- **Comments**: Explain "why", not "what"
- **README**: Update if adding new features

### JSDoc Format

```typescript
/**
 * Brief description of the function
 * 
 * Detailed description if needed
 * 
 * @param paramName - Description of parameter
 * @returns Description of return value
 * @throws Description of errors thrown
 * @example
 * const result = functionName(param);
 */
export function functionName(paramName: Type): ReturnType {
  // implementation
}
```

### React Components

```typescript
/**
 * Component description
 * 
 * @param props - Component props
 * @returns JSX Element
 */
export const ComponentName: React.FC<Props> = memo(({ prop1, prop2 }) => {
  // Hooks first
  const [state, setState] = useState();
  
  // Memoized values
  const computed = useMemo(() => {}, [deps]);
  
  // Callbacks
  const handler = useCallback(() => {}, [deps]);
  
  // Effects
  useEffect(() => {}, [deps]);
  
  // Render
  return <div>...</div>;
});

ComponentName.displayName = 'ComponentName';
```

## Testing Guidelines

### Test Coverage

- Aim for 90%+ code coverage
- All new features must include tests
- Bug fixes should include regression tests

### Test Structure

```typescript
describe('Feature/Component Name', () => {
  describe('functionName', () => {
    it('should handle normal case', () => {
      // Arrange
      const input = ...;
      
      // Act
      const result = functionName(input);
      
      // Assert
      expect(result).toBe(expected);
    });
    
    it('should handle edge case', () => {
      // Test edge cases
    });
    
    it('should throw error for invalid input', () => {
      // Test error cases
    });
  });
});
```

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage

# Run specific test file
npm test -- path/to/test.test.ts
```

## Commit Messages

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### Examples

```
feat(calculator): add CSV export functionality

Implement CSV export for carbon footprint data with
customizable date ranges and category filtering.

Closes #123
```

```
fix(dashboard): resolve chart rendering issue

Fix race condition causing charts to render before
data is loaded.

Fixes #456
```

## Pull Request Process

### Before Submitting

1. ✅ All tests pass
2. ✅ Code is properly formatted
3. ✅ No linting errors
4. ✅ TypeScript compiles without errors
5. ✅ Documentation is updated
6. ✅ CHANGELOG.md is updated

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
Describe testing performed

## Checklist
- [ ] Tests pass
- [ ] Code follows style guidelines
- [ ] Documentation updated
- [ ] No new warnings
```

### Review Process

1. At least one maintainer must approve
2. All CI checks must pass
3. No unresolved conversations
4. Branch must be up to date with main

### After Approval

- Squash and merge (preferred)
- Maintainer will merge and delete branch

## Performance Guidelines

- Use `React.memo()` for expensive components
- Use `useMemo()` for expensive calculations
- Use `useCallback()` for event handlers
- Implement code splitting for large features
- Optimize images and assets

## Security Guidelines

- Never commit sensitive data (API keys, passwords)
- Sanitize all user inputs
- Use parameterized queries
- Follow OWASP security practices
- Report security vulnerabilities privately

## Accessibility Guidelines

- Follow WCAG 2.1 AA standards
- Use semantic HTML
- Include ARIA labels where needed
- Test with keyboard navigation
- Test with screen readers

## Questions?

- Open an issue for bugs or feature requests
- Join our Discord for discussions
- Email: support@carbonvault.com

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

Thank you for contributing to CarbonVault! 🌱