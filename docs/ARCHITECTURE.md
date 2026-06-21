# CarbonVault Architecture

## Overview

CarbonVault is a modern web application built with React and TypeScript, designed to help users track and reduce their carbon footprint. This document provides a comprehensive overview of the system architecture, design decisions, and implementation details.

## Table of Contents

1. [System Architecture](#system-architecture)
2. [Technology Stack](#technology-stack)
3. [Project Structure](#project-structure)
4. [Data Flow](#data-flow)
5. [Component Architecture](#component-architecture)
6. [State Management](#state-management)
7. [Performance Optimization](#performance-optimization)
8. [Security Architecture](#security-architecture)
9. [Testing Strategy](#testing-strategy)
10. [Deployment Architecture](#deployment-architecture)

## System Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Client Layer                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   React UI   │  │  React Router│  │  Chart.js    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                      Application Layer                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Contexts   │  │  Custom Hooks│  │   Services   │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                       Backend Layer                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │Firebase Auth │  │  Firestore   │  │Firebase Storage│     │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
```

### Architecture Principles

1. **Separation of Concerns**: Clear boundaries between UI, business logic, and data
2. **Component Composition**: Reusable, composable components
3. **Unidirectional Data Flow**: Predictable state management
4. **Performance First**: Optimized rendering and code splitting
5. **Type Safety**: Strict TypeScript throughout
6. **Accessibility**: WCAG 2.1 AA compliance

## Technology Stack

### Frontend

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 18.x | UI framework |
| TypeScript | 5.x | Type safety |
| Vite | 5.x | Build tool |
| React Router | 6.x | Routing |
| Tailwind CSS | 3.x | Styling |
| Chart.js | 4.x | Data visualization |
| React Testing Library | 14.x | Testing |
| Jest | 29.x | Test runner |

### Backend

| Technology | Purpose |
|------------|---------|
| Firebase Auth | User authentication |
| Firestore | NoSQL database |
| Firebase Storage | File storage |
| Firebase Hosting | Static hosting |

### Development Tools

| Tool | Purpose |
|------|---------|
| ESLint | Code linting |
| Prettier | Code formatting |
| Husky | Git hooks |
| TypeScript | Static type checking |

## Project Structure

```
carbonvault/
├── src/
│   ├── components/          # React components
│   │   ├── auth/           # Authentication components
│   │   ├── common/         # Shared components
│   │   ├── dashboard/      # Dashboard components
│   │   ├── layout/         # Layout components
│   │   └── reports/        # Report components
│   ├── contexts/           # React Context providers
│   │   ├── AuthContext.tsx
│   │   ├── DataContext.tsx
│   │   └── ThemeContext.tsx
│   ├── hooks/              # Custom React hooks
│   │   ├── useAuth.ts
│   │   ├── useCarbonData.ts
│   │   └── useLocalStorage.ts
│   ├── pages/              # Page components
│   │   ├── Calculator.tsx
│   │   ├── DashboardPage.tsx
│   │   ├── Home.tsx
│   │   ├── Profile.tsx
│   │   └── Reports.tsx
│   ├── services/           # Business logic
│   │   ├── api.ts
│   │   ├── carbonService.ts
│   │   └── reportService.ts
│   ├── utils/              # Utility functions
│   │   ├── constants.ts
│   │   ├── helpers.ts
│   │   ├── validators.ts
│   │   ├── performance.ts
│   │   └── security.ts
│   ├── types/              # TypeScript types
│   │   └── index.ts
│   └── styles/             # Global styles
│       └── globals.css
├── tests/                  # Test files
│   ├── integration/
│   └── setup.ts
├── docs/                   # Documentation
│   └── ARCHITECTURE.md
├── .github/                # GitHub workflows
│   └── workflows/
│       └── ci.yml
└── public/                 # Static assets
```

### Directory Responsibilities

- **components/**: Presentational and container components
- **contexts/**: Global state management with React Context
- **hooks/**: Reusable stateful logic
- **pages/**: Route-level components
- **services/**: API calls and business logic
- **utils/**: Pure utility functions
- **types/**: TypeScript type definitions

## Data Flow

### Authentication Flow

```
User Action → AuthContext → Firebase Auth → Update Context → Re-render
```

1. User submits login/register form
2. AuthContext calls Firebase Auth API
3. Firebase returns user token
4. AuthContext updates state
5. Protected routes become accessible

### Data Fetching Flow

```
Component Mount → Custom Hook → Service → Firebase → Cache → Component
```

1. Component mounts and calls custom hook
2. Hook checks cache (Context)
3. If not cached, calls service
4. Service queries Firestore
5. Data returned and cached
6. Component re-renders with data

### Calculator Flow

```
Input → Validation → Calculation → Display → Save → Firestore
```

1. User enters consumption data
2. Real-time validation
3. Calculate emissions using factors
4. Display results with charts
5. User saves to profile
6. Data persisted to Firestore

## Component Architecture

### Component Hierarchy

```
App
├── Layout
│   ├── Header
│   │   ├── Navigation
│   │   └── ThemeToggle
│   └── Footer
├── Routes
│   ├── Home
│   ├── Calculator
│   │   ├── InputForm
│   │   └── ResultsDisplay
│   ├── Dashboard
│   │   ├── CarbonScore
│   │   ├── Charts
│   │   ├── ActionTracker
│   │   └── Insights
│   ├── Reports
│   │   ├── ReportFilters
│   │   ├── ReportCharts
│   │   └── ExportButtons
│   └── Profile
│       ├── UserStats
│       └── AccountSettings
└── ErrorBoundary
```

### Component Patterns

#### 1. Container/Presentational Pattern

```typescript
// Container (logic)
const DashboardContainer: React.FC = () => {
  const { data, loading } = useCarbonData();
  
  if (loading) return <LoadingSpinner />;
  
  return <DashboardPresentation data={data} />;
};

// Presentational (UI)
const DashboardPresentation: React.FC<Props> = ({ data }) => {
  return <div>{/* Render data */}</div>;
};
```

#### 2. Compound Components

```typescript
<Card>
  <Card.Header>Title</Card.Header>
  <Card.Body>Content</Card.Body>
  <Card.Footer>Actions</Card.Footer>
</Card>
```

#### 3. Render Props

```typescript
<DataFetcher
  render={(data, loading) => (
    loading ? <Spinner /> : <DataDisplay data={data} />
  )}
/>
```

## State Management

### Context Architecture

```
ThemeProvider (outermost)
└── AuthProvider
    └── DataProvider
        └── App Components
```

### State Layers

1. **Local State** (useState): Component-specific state
2. **Shared State** (Context): Cross-component state
3. **Server State** (Firestore): Persisted data
4. **URL State** (Router): Navigation state

### Context Responsibilities

| Context | Responsibility |
|---------|---------------|
| AuthContext | User authentication state |
| DataContext | Carbon footprint data |
| ThemeContext | UI theme (light/dark) |

## Performance Optimization

### Techniques Implemented

1. **Code Splitting**
   ```typescript
   const Calculator = lazy(() => import('./pages/Calculator'));
   ```

2. **Memoization**
   ```typescript
   const stats = useMemo(() => calculateStats(data), [data]);
   ```

3. **Component Memoization**
   ```typescript
   export const Dashboard = memo(({ data }) => {
     // Component logic
   });
   ```

4. **Callback Optimization**
   ```typescript
   const handleClick = useCallback(() => {
     // Handler logic
   }, [dependencies]);
   ```

5. **Virtual Scrolling** (for large lists)
6. **Image Lazy Loading**
7. **Bundle Optimization**
   - Tree shaking
   - Vendor chunk splitting
   - Dynamic imports

### Performance Metrics

| Metric | Target | Actual |
|--------|--------|--------|
| First Contentful Paint | < 1.5s | ~1.2s |
| Time to Interactive | < 3.5s | ~2.8s |
| Largest Contentful Paint | < 2.5s | ~2.1s |
| Bundle Size (gzipped) | < 600KB | ~500KB |

## Security Architecture

### Security Layers

1. **Authentication**: Firebase Auth with JWT tokens
2. **Authorization**: Firestore security rules
3. **Input Validation**: Client and server-side
4. **XSS Protection**: Input sanitization
5. **CSRF Protection**: SameSite cookies
6. **Rate Limiting**: Client-side throttling

### Security Utilities

```typescript
// Input sanitization
sanitizeNumber(value, min, max);
sanitizeEmail(email);
sanitizeHTML(html);

// Rate limiting
const limiter = new RateLimiter(100, 60000); // 100 requests per minute
if (!limiter.isAllowed(userId)) {
  throw new Error('Rate limit exceeded');
}
```

### Firestore Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /carbonFootprints/{footprintId} {
      allow read, write: if request.auth != null 
        && request.auth.uid == resource.data.userId;
    }
  }
}
```

## Testing Strategy

### Test Pyramid

```
        /\
       /  \  E2E Tests (Planned)
      /____\
     /      \  Integration Tests
    /________\
   /          \  Unit Tests
  /__________  \
```

### Test Coverage

| Layer | Coverage | Tools |
|-------|----------|-------|
| Unit Tests | 90%+ | Jest |
| Integration Tests | 80%+ | React Testing Library |
| E2E Tests | Planned | Playwright |
| Accessibility | 100% | jest-axe |

### Testing Patterns

```typescript
describe('Feature', () => {
  it('should handle normal case', () => {
    // Arrange
    const input = createTestData();
    
    // Act
    const result = functionUnderTest(input);
    
    // Assert
    expect(result).toMatchSnapshot();
  });
});
```

## Deployment Architecture

### CI/CD Pipeline

```
Git Push → GitHub Actions → Tests → Build → Deploy → Vercel
```

### Environments

| Environment | URL | Purpose |
|-------------|-----|---------|
| Development | localhost:5173 | Local development |
| Staging | staging.carbonvault.com | Pre-production testing |
| Production | carbonvault.com | Live application |

### Deployment Process

1. Developer pushes to branch
2. GitHub Actions runs:
   - Linting
   - Type checking
   - Unit tests
   - Build
3. On merge to main:
   - Deploy to staging
   - Run integration tests
   - Deploy to production

### Infrastructure

- **Hosting**: Vercel (CDN + Edge Functions)
- **Database**: Firebase Firestore (multi-region)
- **Auth**: Firebase Auth (global)
- **Storage**: Firebase Storage (multi-region)
- **Monitoring**: Vercel Analytics + Firebase Analytics

## Design Decisions

### Why React?

- Component-based architecture
- Large ecosystem
- Excellent TypeScript support
- Strong community

### Why Firebase?

- Real-time capabilities
- Built-in authentication
- Scalable NoSQL database
- Generous free tier

### Why Vite?

- Fast development server
- Optimized production builds
- Native ES modules
- Excellent TypeScript support

### Why Tailwind CSS?

- Utility-first approach
- Consistent design system
- Small bundle size
- Easy customization

## Future Enhancements

### Planned Features

1. **Real-time Collaboration**: Share footprints with family
2. **Mobile App**: React Native version
3. **Offline Support**: Service workers + IndexedDB
4. **AI Recommendations**: ML-powered insights
5. **Social Features**: Community challenges
6. **API**: Public API for third-party integrations

### Technical Improvements

1. **GraphQL**: Replace REST with GraphQL
2. **Server-Side Rendering**: Next.js migration
3. **Micro-frontends**: Split into smaller apps
4. **WebAssembly**: Performance-critical calculations
5. **Progressive Web App**: Full PWA support

## Conclusion

CarbonVault's architecture is designed for scalability, maintainability, and performance. The modular structure allows for easy feature additions while maintaining code quality and user experience.

For questions or suggestions, please open an issue on GitHub or contact the development team.

---

**Last Updated**: January 21, 2024  
**Version**: 1.1.0  
**Maintainers**: CarbonVault Team