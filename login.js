const users = [
  { email: "admin@example.com", password: "password123" },
  { email: "user@example.com", password: "userpass" }
];

document.getElementById("loginBtn").addEventListener("click", function () {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const errorMessage = document.getElementById("error-message");

  // Simple email validation (checks for @ and .)
  if (!email.includes("@") || !email.includes(".")) {
      errorMessage.textContent = "Please enter a valid email address.";
      return;
  }

  // Check if email and password match
  const user = users.find(u => u.email === email && u.password === password);

  if (!user) {
      errorMessage.textContent = "Invalid email or password. Please try again.";
      return;
  }

  errorMessage.textContent = ""; // Clear previous error messages
  window.location.href = "../Home-Page/index.html"; // Redirect on successful login
});
