document.addEventListener("DOMContentLoaded", function () {
    const dropdown = document.getElementById("dropdown");
    const selectedOptions = document.getElementById("selected-options");
    const optionsContainer = document.getElementById("options");
    const checkboxes = optionsContainer.querySelectorAll("input[type='checkbox']");
    const eventForm = document.getElementById("eventForm");

    // Toggle dropdown visibility so when you click on the selected options box it shows
    dropdown.addEventListener("click", function (event) {
        dropdown.classList.toggle("active");
    });

    // Update display that shows which skills were checked
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener("change", function () {
            updateSelectedOptions();
        });
    });

    function updateSelectedOptions() {
        let selected = [];
        checkboxes.forEach(checkbox => {
            if (checkbox.checked) {
                selected.push(checkbox.value);
            }
        });

        selectedOptions.textContent = selected.length > 0 ? selected.join(", ") : "Select skills";
    }

    // Form Submission Handling
    eventForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        // Get form values
        const eventName = document.getElementById("eventName").value.trim();
        const eventDescription = document.getElementById("eventDescription").value.trim();
        const eventLocation = document.getElementById("eventLocation").value.trim();
        const eventUrgency = document.getElementById("eventUrgency").value;
        const eventDate = document.getElementById("eventDate").value;
        const selectedSkills = Array.from(checkboxes)
            .filter(checkbox => checkbox.checked)
            .map(checkbox => checkbox.value);

        // Ensure all fields are filled
        if (!eventName || !eventDescription || !eventLocation || !eventDate || selectedSkills.length === 0) {
            alert("Please fill out missing fields");
            return;
        }

        // Create event data
        const eventData = {
            name: eventName,
            description: eventDescription,
            location: eventLocation,
            urgency: eventUrgency,
            date: eventDate,
            skills: selectedSkills
        };

        try {
            // Send data to the backend API (POST request)
            const response = await fetch("http://localhost:5000/create-event", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(eventData)
            });

            const result = await response.json();

            if (response.ok) {
                alert("Event created successfully!");
                // Optionally reset the form after submission
                eventForm.reset();
            } else {
                alert(`Error: ${result.message}`);
            }
        } catch (error) {
            alert("Error submitting form. Please try again.");
            console.error(error);
        }
    });
});

// Auto-expand text box for event description or location as the user types
document.querySelectorAll("textarea").forEach((textarea) => {
    textarea.addEventListener("input", function () {
        this.style.height = "auto"; // Resets its height
        this.style.height = this.scrollHeight + "px"; // Sets it as its new height
    });
});