const { validateZipCode, processUserData } = require('./backend.js');

describe('User Profile Management Tests', () => {
  describe('validateZipCode', () => {
    it('should return true for a valid zip code', () => {
      expect(validateZipCode('12345')).toBe(true);
    });

    it('should return false for an invalid zip code', () => {
      expect(validateZipCode('1234')).toBe(false);
      expect(validateZipCode('abcde')).toBe(false);
      expect(validateZipCode('123456')).toBe(false);
      expect(validateZipCode(12345)).toBe(false);
    });
  });

  describe('processUserData', () => {
    it('should add a "processed" status to user data', () => {
      const userData = {
        fullName: 'Alice',
        address1: '123 Main St',
        city: 'Anytown',
        state: 'CA',
        zip: '54321',
        skills: ['Leadership'],
        availability: ['Monday']
      };
      const result = processUserData(userData);
      expect(result.data.status).toBe('processed');
      expect(result.data.fullName).toBe('Alice');
      expect(result.data.zip).toBe('54321');
    });

    it('should return an error for missing fullName', () => {
      const userData = {
        address1: '123 Main St',
        city: 'Anytown',
        state: 'CA',
        zip: '90210',
        skills: ['JavaScript'],
        availability: ['Monday']
      };
      const result = processUserData(userData);
      expect(result).toEqual({ success: false, message: 'Full Name is required.' });
    });

    it('should return an error for missing address1', () => {
      const userData = {
        fullName: 'John Doe',
        city: 'Anytown',
        state: 'CA',
        zip: '90210',
        skills: ['JavaScript'],
        availability: ['Monday']
      };
      const result = processUserData(userData);
      expect(result).toEqual({ success: false, message: 'Address 1 is required.' });
    });

    it('should return an error for missing city', () => {
      const userData = {
        fullName: 'John Doe',
        address1: '123 Main st',
        state: 'CA',
        zip: '90210',
        skills: ['JavaScript'],
        availability: ['Monday']
      };
      const result = processUserData(userData);
      expect(result).toEqual({ success: false, message: 'City is required.' });
    });

    it('should return an error for missing state', () => {
      const userData = {
        fullName: 'John Doe',
        address1: '123 Main st',
        city: "anytown",
        zip: '90210',
        skills: ['JavaScript'],
        availability: ['Monday']
      };
      const result = processUserData(userData);
      expect(result).toEqual({ success: false, message: 'State is required.' });
    });

    it('should return an error for missing zip', () => {
      const userData = {
        fullName: 'John Doe',
        address1: '123 Main st',
        city: "anytown",
        state: 'CA',
        skills: ['JavaScript'],
        availability: ['Monday']
      };
      const result = processUserData(userData);
      expect(result).toEqual({ success: false, message: 'Zip Code is required.' });
    });

    it('should return an error for missing skills', () => {
      const userData = {
        fullName: 'John Doe',
        address1: '123 Main st',
        city: "anytown",
        state: 'CA',
        zip: "90210",
        skills: [],
        availability: ['Monday']
      };
      const result = processUserData(userData);
      expect(result).toEqual({ success: false, message: 'Skills are required.' });
    });

    it('should return an error for missing availability', () => {
      const userData = {
        fullName: 'John Doe',
        address1: '123 Main st',
        city: "anytown",
        state: 'CA',
        zip: "90210",
        skills: ['Javascript'],
        availability: []
      };
      const result = processUserData(userData);
      expect(result).toEqual({ success: false, message: 'Availability is required.' });
    });

    it('should return an error for invalid zip', () => {
      const userData = {
        fullName: 'John Doe',
        address1: '123 Main St',
        city: 'Anytown',
        state: 'CA',
        zip: 'invalid',
        skills: ['JavaScript'],
        availability: ['Monday']
      };
      const result = processUserData(userData);
      expect(result).toEqual({ success: false, message: 'Invalid Zipcode' });
    });

    it('should return an error for fullName too long', () => {
      const userData = {
        fullName: "a".repeat(51),
        address1: '123 Main St',
        city: 'Anytown',
        state: 'CA',
        zip: '90210',
        skills: ['JavaScript'],
        availability: ['Monday']
      };
      const result = processUserData(userData);
      expect(result).toEqual({ success: false, message: 'Full Name exceeds 50 characters.' });
    });

    it('should return an error for address1 too long', () => {
      const userData = {
        fullName: "John Doe",
        address1: 'a'.repeat(101),
        city: 'Anytown',
        state: 'CA',
        zip: '90210',
        skills: ['JavaScript'],
        availability: ['Monday']
      };
      const result = processUserData(userData);
      expect(result).toEqual({ success: false, message: 'Address 1 exceeds 100 characters.' });
    });

    it('should return an error for address2 too long', () => {
      const userData = {
        fullName: "John Doe",
        address1: '123 Main St',
        address2: 'a'.repeat(101),
        city: 'Anytown',
        state: 'CA',
        zip: '90210',
        skills: ['JavaScript'],
        availability: ['Monday']
      };
      const result = processUserData(userData);
      expect(result).toEqual({ success: false, message: 'Address 2 exceeds 100 characters.' });
    });

    it('should return an error for city too long', () => {
      const userData = {
        fullName: "John Doe",
        address1: '123 Main St',
        city: 'a'.repeat(101),
        state: 'CA',
        zip: '90210',
        skills: ['JavaScript'],
        availability: ['Monday']
      };
      const result = processUserData(userData);
      expect(result).toEqual({ success: false, message: 'City exceeds 100 characters.' });
    });
  });
});