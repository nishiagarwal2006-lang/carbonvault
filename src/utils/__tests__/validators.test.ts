import { 
  validateCalculatorInputs, 
  validateEmail, 
  validatePassword,
  calculatorSchema 
} from '../validators';
import { CalculatorInputs } from '../../types';

describe('Validators', () => {
  describe('validateCalculatorInputs', () => {
    test('returns no errors for valid inputs', () => {
      const validInputs: CalculatorInputs = {
        electricity: 500,
        gas: 40,
        heating: 50,
        carMiles: 500,
        flights: 1000,
        publicTransport: 100,
        meatConsumption: 7,
        vegetarianMeals: 7,
        dairyConsumption: 14,
      };

      const errors = validateCalculatorInputs(validInputs);
      expect(errors).toHaveLength(0);
    });

    test('returns errors for negative values', () => {
      const invalidInputs: CalculatorInputs = {
        electricity: -100,
        gas: -10,
        heating: 50,
        carMiles: 500,
        flights: 1000,
        publicTransport: 100,
        meatConsumption: 7,
        vegetarianMeals: 7,
        dairyConsumption: 14,
      };

      const errors = validateCalculatorInputs(invalidInputs);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors.some(e => e.field === 'electricity')).toBe(true);
      expect(errors.some(e => e.field === 'gas')).toBe(true);
    });

    test('returns error when total meals exceed 21', () => {
      const invalidInputs: CalculatorInputs = {
        electricity: 500,
        gas: 40,
        heating: 50,
        carMiles: 500,
        flights: 1000,
        publicTransport: 100,
        meatConsumption: 15,
        vegetarianMeals: 10,
        dairyConsumption: 14,
      };

      const errors = validateCalculatorInputs(invalidInputs);
      expect(errors.some(e => e.field === 'diet')).toBe(true);
      expect(errors.some(e => e.message.includes('Total meals'))).toBe(true);
    });

    test('validates all fields with zero values', () => {
      const zeroInputs: CalculatorInputs = {
        electricity: 0,
        gas: 0,
        heating: 0,
        carMiles: 0,
        flights: 0,
        publicTransport: 0,
        meatConsumption: 0,
        vegetarianMeals: 0,
        dairyConsumption: 0,
      };

      const errors = validateCalculatorInputs(zeroInputs);
      expect(errors).toHaveLength(1);
      expect(errors[0].field).toBe('general');
      expect(errors[0].message).toContain('at least one value');
    });

    test('validates maximum values', () => {
      const maxInputs: CalculatorInputs = {
        electricity: 99999,
        gas: 99999,
        heating: 99999,
        carMiles: 999999,
        flights: 999999,
        publicTransport: 999999,
        meatConsumption: 21,
        vegetarianMeals: 0,
        dairyConsumption: 28,
      };

      const errors = validateCalculatorInputs(maxInputs);
      expect(errors).toHaveLength(0);
    });

    test('returns multiple errors for multiple invalid fields', () => {
      const multipleInvalidInputs: CalculatorInputs = {
        electricity: -50,
        gas: -20,
        heating: -10,
        carMiles: -100,
        flights: -200,
        publicTransport: -50,
        meatConsumption: 15,
        vegetarianMeals: 10,
        dairyConsumption: -5,
      };

      const errors = validateCalculatorInputs(multipleInvalidInputs);
      expect(errors.length).toBeGreaterThan(1);
    });
  });

  describe('validateEmail', () => {
    test('validates correct email formats', () => {
      expect(validateEmail('test@example.com')).toBe(true);
      expect(validateEmail('user.name@domain.co.uk')).toBe(true);
      expect(validateEmail('test+label@example.com')).toBe(true);
      expect(validateEmail('test@subdomain.example.com')).toBe(true);
    });

    test('invalidates incorrect email formats', () => {
      expect(validateEmail('')).toBe(false);
      expect(validateEmail('test@')).toBe(false);
      expect(validateEmail('test@example')).toBe(false);
      expect(validateEmail('test.example.com')).toBe(false);
      expect(validateEmail('test@example.')).toBe(false);
      expect(validateEmail('test@.com')).toBe(false);
      expect(validateEmail('test@example..com')).toBe(false);
    });

    test('handles edge cases', () => {
      expect(validateEmail('a@b.c')).toBe(true);
      expect(validateEmail('test@domain')).toBe(false);
      expect(validateEmail(' test@example.com ')).toBe(false);
      expect(validateEmail('test@example.com ')).toBe(false);
    });
  });

  describe('validatePassword', () => {
    test('validates strong passwords', () => {
      expect(validatePassword('Password123')).toBe(true);
      expect(validatePassword('StrongP@ssw0rd')).toBe(true);
      expect(validatePassword('MyP@ssword2024')).toBe(true);
      expect(validatePassword('Abc123!@#')).toBe(true);
    });

    test('invalidates passwords without uppercase', () => {
      expect(validatePassword('password123')).toBe(false);
      expect(validatePassword('abc123!@#')).toBe(false);
      expect(validatePassword('lowercase123')).toBe(false);
    });

    test('invalidates passwords without lowercase', () => {
      expect(validatePassword('PASSWORD123')).toBe(false);
      expect(validatePassword('ABC123!@#')).toBe(false);
    });

    test('invalidates passwords without numbers', () => {
      expect(validatePassword('Password')).toBe(false);
      expect(validatePassword('StrongPassword')).toBe(false);
      expect(validatePassword('Abcdefgh')).toBe(false);
    });

    test('invalidates passwords shorter than 8 characters', () => {
      expect(validatePassword('Pass123')).toBe(false);
      expect(validatePassword('Abc123')).toBe(false);
      expect(validatePassword('P@ss12')).toBe(false);
    });

    test('handles edge cases', () => {
      expect(validatePassword('')).toBe(false);
      expect(validatePassword('P@ssw0rd')).toBe(true);
      expect(validatePassword('12345678')).toBe(false);
      expect(validatePassword('abcdefgh')).toBe(false);
      expect(validatePassword('ABCDEFGH')).toBe(false);
    });
  });

  describe('calculatorSchema (Zod Schema)', () => {
    test('validates correct data types', () => {
      const validData = {
        electricity: 500,
        gas: 40,
        heating: 50,
        carMiles: 500,
        flights: 1000,
        publicTransport: 100,
        meatConsumption: 7,
        vegetarianMeals: 7,
        dairyConsumption: 14,
      };

      expect(() => calculatorSchema.parse(validData)).not.toThrow();
    });

    test('throws error for negative numbers', () => {
      const invalidData = {
        electricity: -500,
        gas: 40,
        heating: 50,
        carMiles: 500,
        flights: 1000,
        publicTransport: 100,
        meatConsumption: 7,
        vegetarianMeals: 7,
        dairyConsumption: 14,
      };

      expect(() => calculatorSchema.parse(invalidData)).toThrow();
    });

    test('throws error for non-number values', () => {
      const invalidData = {
        electricity: '500',
        gas: 40,
        heating: 50,
        carMiles: 500,
        flights: 1000,
        publicTransport: 100,
        meatConsumption: 7,
        vegetarianMeals: 7,
        dairyConsumption: 14,
      };

      expect(() => calculatorSchema.parse(invalidData)).toThrow();
    });

    test('throws error for missing fields', () => {
      const invalidData = {
        electricity: 500,
        gas: 40,
        // heating is missing
        carMiles: 500,
        flights: 1000,
        publicTransport: 100,
        meatConsumption: 7,
        vegetarianMeals: 7,
        dairyConsumption: 14,
      };

      expect(() => calculatorSchema.parse(invalidData)).toThrow();
    });
  });

  describe('Integration Tests', () => {
    test('validateCalculatorInputs catches Zod validation errors', () => {
      const invalidInputs: CalculatorInputs = {
        electricity: -100,
        gas: 40,
        heating: 50,
        carMiles: 500,
        flights: 1000,
        publicTransport: 100,
        meatConsumption: 15,
        vegetarianMeals: 10,
        dairyConsumption: 14,
      };

      const errors = validateCalculatorInputs(invalidInputs);
      
      // Should catch both negative value and meal limit errors
      expect(errors.length).toBeGreaterThanOrEqual(2);
      expect(errors.some(e => e.field === 'electricity')).toBe(true);
      expect(errors.some(e => e.field === 'diet')).toBe(true);
    });

    test('all validators work together', () => {
      const email = 'test@example.com';
      const password = 'ValidPass123';
      const inputs: CalculatorInputs = {
        electricity: 500,
        gas: 40,
        heating: 50,
        carMiles: 500,
        flights: 1000,
        publicTransport: 100,
        meatConsumption: 7,
        vegetarianMeals: 7,
        dairyConsumption: 14,
      };

      expect(validateEmail(email)).toBe(true);
      expect(validatePassword(password)).toBe(true);
      expect(validateCalculatorInputs(inputs)).toHaveLength(0);
    });

    test('validator chain fails appropriately', () => {
      const email = 'invalid-email';
      const password = 'weak';
      const inputs: CalculatorInputs = {
        electricity: -100,
        gas: 40,
        heating: 50,
        carMiles: 500,
        flights: 1000,
        publicTransport: 100,
        meatConsumption: 15,
        vegetarianMeals: 10,
        dairyConsumption: 14,
      };

      expect(validateEmail(email)).toBe(false);
      expect(validatePassword(password)).toBe(false);
      expect(validateCalculatorInputs(inputs).length).toBeGreaterThan(0);
    });
  });

  describe('Performance Tests', () => {
    test('validateCalculatorInputs handles large numbers efficiently', () => {
      const largeInputs: CalculatorInputs = {
        electricity: 99999,
        gas: 99999,
        heating: 99999,
        carMiles: 999999,
        flights: 999999,
        publicTransport: 999999,
        meatConsumption: 21,
        vegetarianMeals: 0,
        dairyConsumption: 28,
      };

      const start = performance.now();
      const errors = validateCalculatorInputs(largeInputs);
      const end = performance.now();

      expect(errors).toHaveLength(0);
      expect(end - start).toBeLessThan(100); // Should complete in less than 100ms
    });

    test('validateCalculatorInputs handles many invalid fields efficiently', () => {
      const manyInvalidInputs: CalculatorInputs = {
        electricity: -1,
        gas: -1,
        heating: -1,
        carMiles: -1,
        flights: -1,
        publicTransport: -1,
        meatConsumption: -1,
        vegetarianMeals: -1,
        dairyConsumption: -1,
      };

      const start = performance.now();
      const errors = validateCalculatorInputs(manyInvalidInputs);
      const end = performance.now();

      expect(errors.length).toBeGreaterThan(0);
      expect(end - start).toBeLessThan(100); // Should complete in less than 100ms
    });
  });

  describe('Error Message Tests', () => {
    test('error messages are user-friendly and descriptive', () => {
      const invalidInputs: CalculatorInputs = {
        electricity: -100,
        gas: 40,
        heating: 50,
        carMiles: 500,
        flights: 1000,
        publicTransport: 100,
        meatConsumption: 15,
        vegetarianMeals: 10,
        dairyConsumption: 14,
      };

      const errors = validateCalculatorInputs(invalidInputs);
      
      const electricityError = errors.find(e => e.field === 'electricity');
      expect(electricityError?.message).toContain('positive');
      
      const dietError = errors.find(e => e.field === 'diet');
      expect(dietError?.message).toContain('Total meals');
    });

    test('error messages include field names for context', () => {
      const invalidInputs: CalculatorInputs = {
        electricity: 500,
        gas: -10,
        heating: 50,
        carMiles: 500,
        flights: 1000,
        publicTransport: 100,
        meatConsumption: 7,
        vegetarianMeals: 7,
        dairyConsumption: 14,
      };

      const errors = validateCalculatorInputs(invalidInputs);
      const gasError = errors.find(e => e.field === 'gas');
      expect(gasError?.field).toBe('gas');
      expect(gasError?.message).toBeDefined();
    });
  });
});