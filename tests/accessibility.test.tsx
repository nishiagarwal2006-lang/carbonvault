import React from 'react';
import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../src/contexts/AuthContext';
import { ThemeProvider } from '../src/contexts/ThemeContext';
import { DataProvider } from '../src/contexts/DataContext';
import Home from '../src/pages/Home';
import Login from '../src/components/auth/Login';
import Calculator from '../src/pages/Calculator';

expect.extend(toHaveNoViolations);

// Mock auth context
jest.mock('../src/contexts/AuthContext', () => ({
  useAuth: () => ({
    user: null,
    loading: false,
    login: jest.fn(),
    register: jest.fn(),
    loginWithGoogle: jest.fn(),
    logout: jest.fn(),
  }),
  AuthProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

describe('Accessibility Tests', () => {
  const renderWithProviders = (component: React.ReactElement) => {
    return render(
      <BrowserRouter>
        <ThemeProvider>
          <AuthProvider>
            <DataProvider>
              {component}
            </DataProvider>
          </AuthProvider>
        </ThemeProvider>
      </BrowserRouter>
    );
  };

  test('Home page has no accessibility violations', async () => {
    const { container } = renderWithProviders(<Home />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test('Login page has no accessibility violations', async () => {
    const { container } = renderWithProviders(<Login />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test('Calculator page has no accessibility violations', async () => {
    const { container } = renderWithProviders(<Calculator />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});