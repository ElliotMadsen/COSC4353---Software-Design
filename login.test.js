
/**
 * @jest-environment jsdom
 */

const fs = require("fs");
const path = require("path");

describe("Login functionality", () => {
  let loginScript;

  beforeAll(() => {
    // Load the login.html file into the test environment
    document.body.innerHTML = fs.readFileSync(
      path.resolve(__dirname, "../login.html"),
      "utf8"
    );

    // Load login.js
    loginScript = require("../login");
  });

  test("shows error for invalid email format", () => {
    document.getElementById("email").value = "invalidEmail";
    document.getElementById("password").value = "password123";
    document.getElementById("loginBtn").click();

    expect(document.getElementById("error-message").textContent).toBe(
      "Please enter a valid email address."
    );
  });

  test("shows error for incorrect credentials", () => {
    document.getElementById("email").value = "wrong@example.com";
    document.getElementById("password").value = "wrongpass";
    document.getElementById("loginBtn").click();

    expect(document.getElementById("error-message").textContent).toBe(
      "Invalid email or password. Please try again."
    );
  });

  test("redirects on successful login", () => {
    delete window.location;
    window.location = { href: "" }; // Mock window.location

    document.getElementById("email").value = "admin@example.com";
    document.getElementById("password").value = "password123";
    document.getElementById("loginBtn").click();

    expect(window.location.href).toBe("../Home-Page/index.html");
  });
});
