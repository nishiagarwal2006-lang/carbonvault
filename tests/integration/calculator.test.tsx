import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import Calculator from '../../src/pages/Calculator';
import { AuthProvider } from '../../src/contexts/AuthContext';
import { ThemeProvider } from '../../src/contexts/ThemeContext';

// Mock Firebase
jest.mock('../../src/lib/firebase', () => ({
  db: {
    collection: jest.fn(),
    addDoc: jest.fn(),
  },
}));

describe('Calculator Integration Tests', () => {
  const renderCalculator = () => {
    return render(
      <BrowserRouter>
        <ThemeProvider>
          <AuthProvider>
            <Calculator />
          </AuthProvider>
        </ThemeProvider>
      </BrowserRouter>
    );
  };

  test('renders calculator form correctly', () => {
    renderCalculator();
    expect(screen.getByText('Carbon Footprint Calculator')).toBeInTheDocument();
    expect(screen.getByText('Energy Consumption')).toBeInTheDocument();
    expect(screen.getByText('Travel')).toBeInTheDocument();
    expect(screen.getByText('Diet')).toBeInTheDocument();
  });

  test('handles input changes', async () => {
    renderCalculator();
    const electricityInput = screen.getByLabelText('Electricity (kWh/month)');
    await userEvent.clear(electricityInput);
    await userEvent.type(electricityInput, '500');
    expect(electricityInput).toHaveValue(500);
  });

  test('validates form submission', async () => {
    renderCalculator();
    const submitButton = screen.getByText('Calculate Footprint');
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/Please fix the following errors/i)).toBeInTheDocument();
    });
  });
});