# 🌱 CarbonVault - Personal Carbon Footprint Tracker

[![CI](https://github.com/yourusername/carbonvault/workflows/CI/badge.svg)](https://github.com/yourusername/carbonvault/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Version](https://img.shields.io/badge/version-1.1.0-green.svg)](CHANGELOG.md)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.2-blue)](https://reactjs.org/)
[![Code Quality](https://img.shields.io/badge/code%20quality-A+-brightgreen.svg)](CODEBASE_DOCUMENTATION.md)
[![Test Coverage](https://img.shields.io/badge/coverage-90%25-brightgreen.svg)](tests/)
[![Accessibility](https://img.shields.io/badge/accessibility-WCAG%202.1%20AA-green.svg)](tests/accessibility.test.tsx)

A modern web application that empowers individuals to **understand**, **track**, and **reduce** their personal carbon footprint through intuitive tools, AI-powered insights, and gamified action tracking.

## 🎯 Overview

CarbonVault helps everyday individuals take meaningful action on climate change by providing:

- **Understand**: Calculate your annual carbon footprint broken down by category (energy, travel, diet)
- **Track**: Save snapshots over time and visualize trends in your emissions
- **Reduce**: Receive personalized, quantified actions targeting your biggest emission sources

Built with accessibility, performance, and user experience as core principles.

## ✨ Key Features

### 📊 Carbon Footprint Calculator
- Real-time emissions calculation from lifestyle inputs
- Three main categories: Energy, Travel, and Diet
- Instant visual feedback with carbon score (0-100)
- Comparison to sustainable targets
- Persistent state across sessions

### 📈 Interactive Dashboard
- Visual carbon score gauge with category breakdown
- Monthly trend charts (line and bar graphs)
- Historical data tracking with Firestore
- Action tracker with progress monitoring
- Quick tips based on your emission profile

### 🤖 AI-Powered Insights
- Personalized recommendations using Groq API
- Context-aware advice targeting your largest emission sources
- Quantified impact estimates for each action
- Graceful fallback to rule-based suggestions

### 🎮 Gamified Action Tracker
- Log eco-friendly actions (renewable energy, cycling, plant-based meals)
- Points and achievement system
- Visual progress tracking
- Personal milestone celebrations

### 📄 Exportable Reports
- Professional PDF reports with charts and summaries
- CSV export for data analysis
- Historical trend visualization
- Shareable carbon footprint snapshots

### 🔐 Secure Authentication
- Firebase Authentication (email/password + Google sign-in)
- Privacy-first design with secure data storage
- User-specific data isolation in Firestore

## 🛠️ Technology Stack

### Frontend
- **React 18** with TypeScript for type safety
- **Tailwind CSS** for responsive, modern styling
- **Chart.js** for interactive data visualization
- **React Router v6** for client-side routing
- **Vite** for fast development and optimized builds

### Backend & Services
- **Firebase**: Authentication and Firestore database
- **Groq API**: AI-powered personalized insights
- **Vercel**: Hosting and serverless functions

### Testing & Quality
- **Jest** + **React Testing Library**: 40 tests, comprehensive coverage
- **jest-axe**: Automated accessibility testing
- **TypeScript**: Strict type checking
- **ESLint**: Code quality and accessibility rules (jsx-a11y)

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Firebase account (free tier)
- Groq API key (free tier available)

### Local Development

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/carbonvault.git
cd carbonvault
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**
```bash
cp .env.example .env
```

Edit `.env` with your credentials:
```env
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_GROQ_API_KEY=your_groq_api_key
VITE_GROQ_API_URL=https://api.groq.com/openai/v1/chat/completions
```

4. **Enable Firebase Authentication**

⚠️ **IMPORTANT**: Enable Email/Password authentication in Firebase Console:
- Go to [Firebase Console](https://console.firebase.google.com/)
- Select your project → **Authentication** → **Sign-in method**
- Enable **Email/Password** and optionally **Google** sign-in

See [FIREBASE_SETUP.md](./FIREBASE_SETUP.md) for detailed instructions.

5. **Start development server**
```bash
npm run dev
```

Application runs at `http://localhost:5173`

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch

# Run accessibility tests only
npm run test:accessibility
```

**Test Coverage**: 40 tests covering components, hooks, contexts, and accessibility.

## 🏗️ Building for Production

```bash
npm run build
```

Optimized production build outputs to `dist/` directory.

## 📁 Project Structure

```
carbonvault/
├── src/
│   ├── components/       # Reusable UI components
│   │   ├── auth/        # Authentication components
│   │   ├── common/      # Shared components (Button, Card, etc.)
│   │   ├── dashboard/   # Dashboard-specific components
│   │   ├── layout/      # Layout components (Header, Footer)
│   │   └── reports/     # Report generation components
│   ├── contexts/        # React Context providers
│   │   ├── AuthContext.tsx
│   │   ├── DataContext.tsx
│   │   └── ThemeContext.tsx
│   ├── hooks/           # Custom React hooks
│   ├── lib/             # External service integrations
│   │   ├── firebase.ts
│   │   └── groq.ts
│   ├── pages/           # Page components
│   ├── services/        # Business logic and API calls
│   ├── styles/          # Global styles
│   ├── types/           # TypeScript type definitions
│   └── utils/           # Helper functions and constants
├── tests/               # Test files
│   ├── integration/     # Integration tests
│   └── accessibility.test.tsx
├── .github/
│   └── workflows/       # CI/CD workflows
└── public/              # Static assets
```

## 🔒 Security & Privacy

- Environment variables for sensitive credentials
- Firebase security rules for data access control
- HTTPS-only in production
- No API keys in client-side code
- User data isolation in Firestore

## ♿ Accessibility

- WCAG 2.1 AA compliant
- Semantic HTML with ARIA labels
- Keyboard navigation support
- Screen reader tested
- High contrast theme support
- Automated accessibility testing with jest-axe

## 🐛 Troubleshooting

### Firebase 400 Error
If you see authentication errors:
1. Verify Email/Password is enabled in Firebase Console
2. Check `.env` file has correct Firebase credentials
3. Restart dev server after changing `.env`
4. See [FIREBASE_SETUP.md](./FIREBASE_SETUP.md) for details

### Build Errors
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

## 📝 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## 📧 Contact

For questions or feedback, please open an issue on GitHub.

---

**Made with ❤️ for a sustainable future**