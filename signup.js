document.getElementById("signupForm").addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent form submission
  
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
    const errorMessage = document.getElementById("error-message");
  
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
        errorMessage.textContent = "Please enter a valid email address.";
        return;
    }
  
    // Check if password is empty
    if (password === "" || confirmPassword === "") {
        errorMessage.textContent = "Password fields cannot be empty.";
        return;
    }
  
    // Password match validation
    if (password !== confirmPassword) {
        errorMessage.textContent = "Passwords do not match.";
        return;
    }
  
    // Optionally, password strength validation
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
        errorMessage.textContent = "Password must be at least 8 characters long and include one uppercase letter and one number.";
        return;
    }
  
    errorMessage.textContent = ""; // Clear previous error messages
  
    alert("Account successfully created!");
    window.location.href = "login.html"; // Redirect to login page after signup
  
    document.getElementById("signupForm").reset();
  });