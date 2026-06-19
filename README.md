# CarbonVault - Carbon Footprint Tracker

## Overview

CarbonVault is a comprehensive web application that helps individuals understand, track, and reduce their carbon footprint through interactive tools, personalized insights, and gamified action tracking. Built with modern web technologies and designed with accessibility and user experience at its core.

## Features

### Carbon Footprint Calculator
- Track emissions from energy consumption (electricity, gas, heating)
- Monitor travel impact (car miles, flights, public transport)
- Log dietary choices (meat consumption, vegetarian meals)
- Real-time calculation with instant visual feedback

### Personalized Insights
- AI-powered recommendations using Groq API
- Actionable insights based on your carbon profile
- Easy-to-read card format for quick understanding

### Interactive Dashboard
- Carbon score with visual gauge
- Monthly trend charts (line and bar graphs)
- Category breakdown visualization (pie charts)
- Action tracker with progress monitoring
- Comparison to national averages

### Gamified Action Tracker
- Log eco-friendly actions (renewable energy, cycling, plant-based meals)
- Points and badges system
- Progress visualization showing environmental impact
- Personal milestone tracking

### Exportable Reports
- PDF reports with carbon footprint summary and charts
- CSV export of historical data
- Professional report formatting with key metrics

### Secure Authentication
- Firebase Authentication (email/password)
- Google sign-in option
- Secure data storage with Firestore
- Privacy-compliant data handling

## Technology Stack

### Frontend
- **React 18+** with TypeScript for type safety
- **Tailwind CSS** for modern, responsive styling
- **Chart.js** for interactive data visualization
- **React Router v6** for navigation
- **React Hook Form** for form management
- **Zod** for schema validation

### Backend & Services
- **Firebase**: Authentication and Firestore database
- **Groq API**: AI-powered insights generation
- **Vercel Serverless Functions**: Backend API endpoints

### Testing
- **Jest** for unit and integration testing
- **React Testing Library** for component testing
- **jest-axe** for accessibility testing

### Deployment
- **Vercel** for hosting and serverless functions
- Environment variables for secure configuration

## Getting Started

### Prerequisites
- Node.js 18+ and npm/yarn
- Firebase account (free tier)
- Groq API key (free tier)
- Vercel account (for deployment)

### Local Development

1. **Clone the repository**
```bash
git clone <your-repository-url>
cd carbonvault