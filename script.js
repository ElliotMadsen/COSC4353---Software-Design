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
    eventForm.addEventListener("submit", function (event) {
        event.preventDefault();

        //.value.trim() gets the current value from a form element like <input> or <textarea> while it removes whitespace before and after
        const eventName = document.getElementById("eventName").value.trim();
        const eventDescription = document.getElementById("eventDescription").value.trim();
        const eventLocation = document.getElementById("eventLocation").value.trim();
        const eventUrgency = document.getElementById("eventUrgency").value;
        const eventDate = document.getElementById("eventDate").value;
        //.value gives you access to the current value inside <input> <textarea> etc
        const selectedSkills = Array.from(checkboxes)
            .filter(checkbox => checkbox.checked)
            .map(checkbox => checkbox.value);

        //ensures all parts are filled
        if (!eventName || !eventDescription || !eventLocation || !eventDate || selectedSkills.length === 0) {
            alert("Please fill out missing fields");
            return;
        }

        alert(`Event Created Successfully!
            Name: ${eventName}
            Description: ${eventDescription}
            Location: ${eventLocation}
            Urgency: ${eventUrgency}
            Date: ${eventDate}
            Skills: ${selectedSkills.join(", ")}
        `);
    });
});

//auto expands text box for like event description or even location as the user types
//.querySelectorAll
document.querySelectorAll("textarea").forEach((textarea) => {  
    textarea.addEventListener("input", function () {
        this.style.height = "auto"; // Resets it's height
        this.style.height = this.scrollHeight + "px"; // Sets it as it's new height
    });
});

//fake data as an example, would connect to a database when we begin working on the back-end
window.onload = function() {
    const volunteerData = {
        name: "Jane Doe", matchedEvent: "Beach Cleanup" 
    };

    document.getElementById('volunteerName').value = volunteerData.name;
    document.getElementById('matchedEvent').value = volunteerData.matchedEvent;
};

document.getElementById('volMatchingForm').addEventListener('submit', function(event){
    event.preventDefault();
    alert('Volunteer matched with event: ' + document.getElementById('matchedEvent').value);
});
