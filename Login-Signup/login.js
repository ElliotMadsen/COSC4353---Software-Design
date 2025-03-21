document.getElementById("loginBtn").addEventListener("click", async function () {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const errorMessage = document.getElementById("error-message");

  try {
      const response = await fetch("http://localhost:3001/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (!response.ok) {
          errorMessage.textContent = data.message;
          return;
      }

      alert("Login successful!");
      window.location.href = "../Home-Page/index.html"; // Redirect on success
  } catch (error) {
      errorMessage.textContent = "Error logging in. Try again later.";
  }
});
