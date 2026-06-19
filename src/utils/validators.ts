import { CalculatorInputs, ValidationError } from '../types';
import { z } from 'zod';

export const calculatorSchema = z.object({
  electricity: z.number().min(0).max(99999),
  gas: z.number().min(0).max(99999),
  heating: z.number().min(0).max(99999),
  carMiles: z.number().min(0).max(999999),
  flights: z.number().min(0).max(999999),
  publicTransport: z.number().min(0).max(999999),
  meatConsumption: z.number().min(0).max(21),
  vegetarianMeals: z.number().min(0).max(21),
  dairyConsumption: z.number().min(0).max(28),
});

export function validateCalculatorInputs(inputs: CalculatorInputs): ValidationError[] {
  const errors: ValidationError[] = [];

  // Check for negative values
  Object.entries(inputs).forEach(([key, value]) => {
    if (value < 0) {
      errors.push({
        field: key,
        message: `${key} must be a positive number`,
      });
    }
  });

  // Specific validations
  if (inputs.meatConsumption + inputs.vegetarianMeals > 21) {
    errors.push({
      field: 'diet',
      message: 'Total meals per week cannot exceed 21',
    });
  }

  return errors;
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePassword(password: string): boolean {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  return passwordRegex.test(password);
}