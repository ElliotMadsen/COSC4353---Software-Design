document.getElementById("signupForm").addEventListener("submit", async function (event) {
    event.preventDefault(); // Prevent form submission

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
    const errorMessage = document.getElementById("error-message");

    if (password !== confirmPassword) {
        errorMessage.textContent = "Passwords do not match.";
        return;
    }

    try {
        const response = await fetch("http://localhost:3001/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();
        if (!response.ok) {
            errorMessage.textContent = data.message;
            return;
        }

        alert("Account successfully created!");
        window.location.href = "login.html"; // Redirect to login
    } catch (error) {
        errorMessage.textContent = "Error signing up. Try again later.";
    }
});
