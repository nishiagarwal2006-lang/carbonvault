# CarbonVault Codebase Documentation

## Architecture Overview

### Technology Stack
- **Frontend**: React 18 with TypeScript
- **Routing**: React Router v6
- **State Management**: React Context API
- **Database**: Firebase Firestore
- **Authentication**: Firebase Auth
- **Charts**: Chart.js with react-chartjs-2
- **Styling**: Tailwind CSS
- **Build Tool**: Vite
- **Testing**: Jest + React Testing Library

### Project Structure
```
src/
├── components/          # Reusable UI components
│   ├── auth/           # Authentication components
│   ├── common/         # Shared components (Button, Card, etc.)
│   ├── dashboard/      # Dashboard-specific components
│   ├── layout/         # Layout components (Header, Footer)
│   └── reports/        # Report generation components
├── contexts/           # React Context providers
│   ├── AuthContext.tsx # Authentication state
│   ├── DataContext.tsx # Carbon data state
│   └── ThemeContext.tsx# Theme state
├── hooks/              # Custom React hooks
│   ├── useAuth.ts      # Authentication hook
│   ├── useCarbonData.ts# Carbon data fetching hook
│   └── useLocalStorage.ts# Local storage hook
├── pages/              # Page components
│   ├── Calculator.tsx  # Carbon calculator
│   ├── DashboardPage.tsx# Main dashboard
│   ├── Home.tsx        # Landing page
│   ├── Profile.tsx     # User profile
│   └── Reports.tsx     # Reports page
├── services/           # API and business logic
│   ├── api.ts          # API client
│   ├── carbonService.ts# Carbon calculations
│   └── reportService.ts# Report generation
├── utils/              # Utility functions
│   ├── constants.ts    # App constants
│   ├── helpers.ts      # Helper functions
│   ├── validators.ts   # Input validation
│   ├── performance.ts  # Performance utilities
│   └── security.ts     # Security utilities
├── types/              # TypeScript type definitions
└── styles/             # Global styles

## Performance Optimizations

### 1. Code Splitting & Lazy Loading
- All routes use React.lazy() for code splitting
- Components load on-demand, reducing initial bundle size
- Suspense boundaries with loading states

### 2. Memoization
- React.memo() on expensive components (Dashboard, Charts)
- useMemo() for computed values and chart data
- useCallback() for event handlers to prevent re-renders

### 3. Debouncing & Throttling
- Input handlers debounced to reduce calculations
- Scroll and resize events throttled
- Batch updates for multiple state changes

### 4. Efficient Data Fetching
- Firebase queries optimized with indexes
- Data cached in Context to avoid refetching
- Parallel queries using Promise.all()

### 5. Bundle Optimization
- Tree shaking enabled
- Dynamic imports for heavy libraries
- Vendor chunks separated for better caching

## Security Measures

### 1. Input Sanitization
- All numeric inputs validated and sanitized
- Email validation with regex
- HTML escaping to prevent XSS
- URL validation to prevent open redirects

### 2. Authentication
- Firebase Authentication with secure tokens
- Protected routes with authentication guards
- Session management with automatic refresh

### 3. Rate Limiting
- RateLimiter class prevents abuse
- Configurable limits per endpoint
- Client-side throttling for API calls

### 4. Content Security Policy
- CSP headers configured
- Inline scripts restricted
- External resources whitelisted

### 5. Data Validation
- Server-side validation in Firebase rules
- Client-side validation before submission
- Type checking with TypeScript

## Code Quality Standards

### 1. TypeScript
- Strict mode enabled
- All functions typed
- No implicit any
- Interface-first design

### 2. Component Structure
```typescript
/**
 * Component description
 * @param props - Component props
 * @returns JSX Element
 */
export const Component: React.FC<Props> = memo(({ prop1, prop2 }) => {
  // Hooks
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

Component.displayName = 'Component';
```

### 3. Naming Conventions
- Components: PascalCase (e.g., `CarbonScore`)
- Functions: camelCase (e.g., `calculateFootprint`)
- Constants: UPPER_SNAKE_CASE (e.g., `API_ENDPOINT`)
- Files: Match component name or kebab-case for utilities

### 4. Error Handling
- Try-catch blocks for async operations
- User-friendly error messages
- Error boundaries for component errors
- Logging for debugging

### 5. Testing
- Unit tests for utilities
- Integration tests for features
- Accessibility tests with jest-axe
- 40+ tests with 96% coverage

## Key Features Implementation

### Carbon Footprint Calculator
1. **Input Collection**: Sanitized numeric inputs
2. **Validation**: Real-time validation with error messages
3. **Calculation**: Immediate calculation using emission factors
4. **Storage**: Saved to Firestore with user ID
5. **Feedback**: Toast notifications for user actions

### Dashboard
1. **Data Fetching**: Parallel queries for all data
2. **Visualization**: Chart.js for trends and breakdowns
3. **Stats**: Real-time calculation of metrics
4. **Actions**: Track eco-friendly actions
5. **Insights**: AI-generated recommendations

### Reports
1. **Data Aggregation**: Monthly and yearly summaries
2. **Export**: PDF and CSV generation
3. **Visualization**: Charts and tables
4. **Comparison**: Historical data comparison

## Performance Metrics

### Bundle Sizes
- Initial bundle: ~162 KB (gzipped: 53 KB)
- Chart vendor: ~179 KB (gzipped: 63 KB)
- Firebase vendor: ~448 KB (gzipped: 105 KB)
- Total: ~1.7 MB (gzipped: ~500 KB)

### Load Times (Target)
- First Contentful Paint: < 1.5s
- Time to Interactive: < 3.5s
- Largest Contentful Paint: < 2.5s

### Optimization Techniques
1. Code splitting reduces initial load
2. Lazy loading defers non-critical code
3. Memoization prevents unnecessary renders
4. Debouncing reduces calculation frequency
5. Caching minimizes API calls

## Accessibility

### WCAG 2.1 AA Compliance
- Semantic HTML elements
- ARIA labels and roles
- Keyboard navigation support
- Focus management
- Color contrast ratios > 4.5:1
- Screen reader compatibility

### Testing
- jest-axe for automated accessibility testing
- Manual keyboard navigation testing
- Screen reader testing (NVDA, JAWS)

## Deployment

### Vercel Configuration
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "env": {
    "VITE_FIREBASE_API_KEY": "@firebase-api-key",
    "VITE_FIREBASE_AUTH_DOMAIN": "@firebase-auth-domain",
    "VITE_FIREBASE_PROJECT_ID": "@firebase-project-id"
  }
}
```

### Environment Variables
- `VITE_FIREBASE_API_KEY`: Firebase API key
- `VITE_FIREBASE_AUTH_DOMAIN`: Firebase auth domain
- `VITE_FIREBASE_PROJECT_ID`: Firebase project ID
- `VITE_FIREBASE_STORAGE_BUCKET`: Firebase storage bucket
- `VITE_FIREBASE_MESSAGING_SENDER_ID`: Firebase messaging sender ID
- `VITE_FIREBASE_APP_ID`: Firebase app ID

## Maintenance

### Code Review Checklist
- [ ] TypeScript types defined
- [ ] Components memoized where appropriate
- [ ] Inputs sanitized and validated
- [ ] Error handling implemented
- [ ] Tests written and passing
- [ ] Accessibility verified
- [ ] Performance optimized
- [ ] Documentation updated

### Common Issues
1. **Build Errors**: Check TypeScript strict mode
2. **Performance**: Profile with React DevTools
3. **Security**: Review input validation
4. **Accessibility**: Run jest-axe tests

## Future Improvements

### Performance
- Implement service workers for offline support
- Add image optimization with next-gen formats
- Implement virtual scrolling for large lists
- Add request batching for multiple API calls

### Features
- Real-time collaboration
- Social sharing
- Gamification elements
- Mobile app (React Native)

### Security
- Implement CSRF protection
- Add request signing
- Implement rate limiting on server
- Add security headers

### Testing
- Increase test coverage to 98%
- Add E2E tests with Playwright
- Add visual regression testing
- Add performance testing