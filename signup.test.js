/**
 * @jest-environment jsdom
 */

const fs = require('fs');
const path = require('path');
const { fireEvent } = require('@testing-library/dom');
require('@testing-library/jest-dom'); // To use jest-dom matchers

describe('Signup Form Validation', () => {
  let signupScript;

  beforeAll(() => {
    // Load the signup.html file into the test environment
    document.body.innerHTML = fs.readFileSync(
      path.resolve(__dirname, '../signup.html'),
      'utf8'
    );

    // Load signup.js (make sure it's required in a way that doesn't use ES modules)
    signupScript = require('../signup');
  });

  test('displays error for invalid email', () => {
    fireEvent.input(document.getElementById('email'), { target: { value: 'invalidEmail' } });
    fireEvent.submit(document.getElementById('signupForm'));

    expect(document.getElementById('error-message').textContent).toBe(
      'Please enter a valid email address.'
    );
  });

  test('displays error for empty password fields', () => {
    fireEvent.input(document.getElementById('email'), { target: { value: 'test@example.com' } });
    fireEvent.input(document.getElementById('password'), { target: { value: '' } });
    fireEvent.input(document.getElementById('confirmPassword'), { target: { value: '' } });
    fireEvent.submit(document.getElementById('signupForm'));

    expect(document.getElementById('error-message').textContent).toBe(
      'Password fields cannot be empty.'
    );
  });

  test('displays error for non-matching passwords', () => {
    fireEvent.input(document.getElementById('email'), { target: { value: 'test@example.com' } });
    fireEvent.input(document.getElementById('password'), { target: { value: 'Password123' } });
    fireEvent.input(document.getElementById('confirmPassword'), { target: { value: 'Password321' } });
    fireEvent.submit(document.getElementById('signupForm'));

    expect(document.getElementById('error-message').textContent).toBe(
      'Passwords do not match.'
    );
  });

  test('displays error for weak password', () => {
    fireEvent.input(document.getElementById('email'), { target: { value: 'test@example.com' } });
    fireEvent.input(document.getElementById('password'), { target: { value: 'weakpass' } });
    fireEvent.input(document.getElementById('confirmPassword'), { target: { value: 'weakpass' } });
    fireEvent.submit(document.getElementById('signupForm'));

    expect(document.getElementById('error-message').textContent).toBe(
      'Password must be at least 8 characters long and include one uppercase letter and one number.'
    );
  });

  test('successfully submits when all fields are valid', () => {
    // Mock alert before submitting the form
    global.alert = jest.fn();
    
    fireEvent.input(document.getElementById('email'), { target: { value: 'test@example.com' } });
    fireEvent.input(document.getElementById('password'), { target: { value: 'Password123' } });
    fireEvent.input(document.getElementById('confirmPassword'), { target: { value: 'Password123' } });
    fireEvent.submit(document.getElementById('signupForm'));
  
    expect(document.getElementById('error-message').textContent).toBe('');
    expect(global.alert).toHaveBeenCalledWith('Account successfully created!');
  });
});
