import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import DashboardPage from '../../src/pages/DashboardPage';
import { AuthProvider } from '../../src/contexts/AuthContext';
import { ThemeProvider } from '../../src/contexts/ThemeContext';
import { DataProvider } from '../../src/contexts/DataContext';
import { getDocs } from 'firebase/firestore';

// Mock Firebase
jest.mock('../../src/lib/firebase', () => ({
  db: {
    collection: jest.fn(),
    query: jest.fn(),
    where: jest.fn(),
    getDocs: jest.fn(),
    orderBy: jest.fn(),
    limit: jest.fn(),
  },
}));

// Mock Firestore getDocs to return empty results
jest.mock('firebase/firestore', () => ({
  ...jest.requireActual('firebase/firestore'),
  getDocs: jest.fn().mockResolvedValue({
    empty: true,
    docs: [],
  }),
}));

describe('Dashboard Integration Tests', () => {
  const renderDashboard = () => {
    return render(
      <BrowserRouter>
        <ThemeProvider>
          <AuthProvider>
            <DataProvider>
              <DashboardPage />
            </DataProvider>
          </AuthProvider>
        </ThemeProvider>
      </BrowserRouter>
    );
  };

  test('renders dashboard with empty state when no user', () => {
    renderDashboard();
    // Dashboard shows empty state when there's no data
    expect(screen.getByText('Welcome to CarbonVault!')).toBeInTheDocument();
  });

  test('displays call to action when no data', async () => {
    renderDashboard();
    
    // Since there's no user/data, the dashboard should show empty state
    await waitFor(
      () => {
        expect(screen.getByText('Calculate Your Footprint')).toBeInTheDocument();
      },
      {
        timeout: 1000,
      }
    );
  });
});