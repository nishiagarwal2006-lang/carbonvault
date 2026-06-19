import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import DashboardPage from '../../src/pages/DashboardPage';
import { AuthProvider } from '../../src/contexts/AuthContext';
import { ThemeProvider } from '../../src/contexts/ThemeContext';

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

describe('Dashboard Integration Tests', () => {
  const renderDashboard = () => {
    return render(
      <BrowserRouter>
        <ThemeProvider>
          <AuthProvider>
            <DashboardPage />
          </AuthProvider>
        </ThemeProvider>
      </BrowserRouter>
    );
  };

  test('renders dashboard with loading state', () => {
    renderDashboard();
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  test('displays dashboard content after loading', async () => {
    renderDashboard();
    await waitFor(() => {
      expect(screen.queryByRole('status')).not.toBeInTheDocument();
    });
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });
});