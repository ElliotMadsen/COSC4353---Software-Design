document.addEventListener("DOMContentLoaded", function () {
    const eventForm = document.getElementById("eventForm");
    const matchForm = document.getElementById("volMatchingForm");
  
    if (eventForm) setupEventForm();
    if (matchForm) setupMatchingForm(); // we’ll create this function next
  
    autoResizeTextareas();
});
  
function setupEventForm() {
    const dropdown = document.getElementById("dropdown");
    const selectedOptions = document.getElementById("selected-options");
    const optionsContainer = document.getElementById("options");
    const checkboxes = optionsContainer.querySelectorAll("input[type='checkbox']");
    const eventForm = document.getElementById("eventForm");
  
    if (dropdown && selectedOptions && optionsContainer) {
        dropdown.addEventListener("click", function () {
            dropdown.classList.toggle("active");
        });
  
        optionsContainer.addEventListener("click", function (e) {
            e.stopPropagation();
        });
  
        checkboxes.forEach((checkbox) => {
            checkbox.addEventListener("change", function () {
                updateSelectedOptions();
            });
        });
  
        function updateSelectedOptions() {
        const selected = Array.from(checkboxes)
            .filter((checkbox) => checkbox.checked)
            .map((checkbox) => checkbox.value);
            selectedOptions.textContent = selected.length ? selected.join(", ") : "Select skills";
        }
    }
  
    eventForm.addEventListener("submit", async function (event) {
        event.preventDefault();
  
        const eventName = document.getElementById("eventName").value.trim();
        const eventDescription = document.getElementById("eventDescription").value.trim();
        const eventLocation = document.getElementById("eventLocation").value.trim();
        const eventUrgency = document.getElementById("eventUrgency").value;
        const eventDate = document.getElementById("eventDate").value;
        const selectedSkills = Array.from(checkboxes)
            .filter((checkbox) => checkbox.checked)
            .map((checkbox) => checkbox.value);
  
        if (!eventName || !eventDescription || !eventLocation || !eventDate || selectedSkills.length === 0) {
            alert("Please fill out missing fields");
            return;
        }
  
        try {
            const response = await fetch("http://localhost:3001/application", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name: eventName,
                description: eventDescription,
                location: eventLocation,
                urgency: eventUrgency,
                date: eventDate,
                skills: selectedSkills,
            }),
        });
  
        const data = await response.json();
        if (!response.ok) {
            alert(data.message);
            return;
        }
  
        alert("Event created successfully!");
        eventForm.reset();
        selectedOptions.textContent = "Select skills";
        } catch (error) {
            alert("Error creating event. Try again later.");
        }
    });
}
  
function autoResizeTextareas() {
    document.querySelectorAll("textarea").forEach((textarea) => {
        textarea.addEventListener("input", function () {
            this.style.height = "auto";
            this.style.height = this.scrollHeight + "px";
        });
    });
}
  
async function setupMatchingForm() {
    const volunteerSelect = document.getElementById("volunteerSelect");
    const matchedEventInput = document.getElementById("matchedEvent");
    const matchForm = document.getElementById("volMatchingForm");
  
    let volunteers = [];
  
    try {
        // Fetch all volunteers
        const res = await fetch("http://localhost:3001/volunteers");
        volunteers = await res.json();
  
        if (!volunteers.length) {
            const opt = document.createElement("option");
            opt.textContent = "No volunteers found";
            opt.disabled = true;
            volunteerSelect.appendChild(opt);
            return;
        }
        // dropdown
        volunteers.forEach(vol => {
            const option = document.createElement("option");
            option.value = vol._id;
            option.textContent = vol.fullName;
            volunteerSelect.appendChild(option);
        });
  
        //auto-match event
        volunteerSelect.addEventListener("change", async function () {
            const selectedId = this.value;
            if (!selectedId) return;
    
            try {
            const matchRes = await fetch(`http://localhost:3001/match/${selectedId}`);
            const matchData = await matchRes.json();
    
            if (!matchRes.ok || !matchData.event) {
                matchedEventInput.value = "No matched event found";
                return;
            }
    
                matchedEventInput.value = matchData.event.name;
                matchedEventInput.dataset.eventId = matchData.event._id;
            } catch (err) {
                console.error("Error fetching matched event:", err);
                matchedEventInput.value = "Error fetching match";
            }
        });
  
    // match submission
    matchForm.addEventListener("submit", async function (e) {
        e.preventDefault();
  
        const userId = volunteerSelect.value;
        const eventId = matchedEventInput.dataset.eventId;
  
        if (!userId || !eventId) {
            alert("Please select a volunteer and matched event.");
            return;
        }
  
        try {
            const saveRes = await fetch("http://localhost:3001/match", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId, eventId }),
            });
  
            const saveData = await saveRes.json();
            if (!saveRes.ok) {
                alert("Failed to save match.");
                return;
            }
            alert("Volunteer matched successfully!");
        } 
        catch (err) {
            console.error("Match save error:", err);
            alert("Error saving match");
        }
    });
  
    } catch (err) {
        console.error("Setup error:", err);
    }
}