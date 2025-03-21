
document.addEventListener("DOMContentLoaded", function () {
    const currentPage = window.location.pathname;
    if (currentPage.includes('EventForm.html')) {
        initializeEventForm();
    }
    else if (currentPage.includes('VolunteerMatching.html')){
        initializeVolunteerMatching();
    }

    document.querySelectorAll("textarea").forEach((textarea) => {
        textarea.addEventListener("input", function () {
            this.style.height = "auto"; // Resets its height
            this.style.height = this.scrollHeight + "px";
        });
    });
});

//EventForm
function initializeEventForm() {
    const dropdown = document.getElementById("dropdown");
    const selectedOptions = document.getElementById("selected-options");
    const optionsContainer = document.getElementById("options");
    const checkboxes = optionsContainer.querySelectorAll("input[type='checkbox']");
    const eventForm = document.getElementById("eventForm");

    dropdown.addEventListener("click", function (event) {
        event.stopPropagation();
        dropdown.classList.toggle("active");
    });
    document.addEventListener("click", function () {
        dropdown.classList.remove("active");
    });

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
    //for submission
    eventForm.addEventListener("submit", async function (event) {
        event.preventDefault();

    //get form values
    const eventName = document.getElementById("eventName").value.trim();
    const eventDescription = document.getElementById("eventDescription").value.trim();
    const eventLocation = document.getElementById("eventLocation").value.trim();
    const eventUrgency = document.getElementById("eventUrgency").value;
    const eventDate = document.getElementById("eventDate").value;
    const selectedSkills = Array.from(checkboxes)
        .filter(checkbox => checkbox.checked)
        .map(checkbox => checkbox.value);

        if (!eventName || !eventDescription || !eventLocation || !eventDate || selectedSkills.length === 0) {
            alert("Please fill out missing fields");
            return;
        }
        // make event data

        const eventData = {
            name: eventName,
            description: eventDescription,
            location: eventLocation,
            skills: selectedSkills,
            urgency: eventUrgency,
            date: eventDate
        };

        try {
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
                eventForm.reset();
                selectedOptions.textContent = "Select skills";
            }

            else {
                alert(`Error: ${result.message}`)
            }
        } 
        
        catch(error) {
            alert("Error submitting form.");
            console.error(error);
        }
    });
}

//Volunteer matching form


//functio to display volunteers that matched
function displayMatchedVolunteers(volunteers){
    const container = document.getElementById("volunteersContainer") || 
    document.querySelector(".event_content");

    if (container) {
        const heading = document.createElement("h2");
        heading.textContent = "Matched Volunteers";

        const volunteersGrid = document.createElement("div");
        volunteersGrid.className = "volunteers-grid";

        if (volunteers.length === 0) {
            const noResults = document.createElement("p");
            noResults.textContent = "No volunteers found matching your criteria.";
            volunteersGrid.appendChild(noResults);
        } 
        else {

            volunteers.forEach(volunteer => {
                const card = document.createElement("div");
                card.className = "volunteer-card";

                card.innerHTML = `
                    <h3>${volunteer.name}</h3>
                    <p><strong>Skills:</strong> ${volunteer.skills.join(", ")}</p>
                    <p><strong>Location:</strong> ${volunteer.location}</p>
                    <p><strong>Availability:</strong> ${volunteer.availability}</p>
                    <button class="match-btn" data-volunteer-id="${volunteer.id}">Match</button>
                `;

                volunteersGrid.appendChild(card);
            });
            
            document.querySelectorAll(".match-btn").forEach(button => {
                button.addEventListener("click", function() {
                    const volunteerId = this.getAttribute("data-volunteer-id");
                    matchVolunteer(volunteerId);
                });
            });
        }


        const existingResults = document.getElementById("volunteersResults");
        
        if (existingResults) {
            existingResults.remove();
        }

        const resultsContainer = document.createElement("div");

        resultsContainer.id = "volunteersResults";
        resultsContainer.appendChild(heading);
        resultsContainer.appendChild(volunteersGrid);

        container.appendChild(resultsContainer);
    }
}

async function matchVolunteer(volunteerId) {
    // Get the event details from the form
    const isEventPage = window.location.pathname.includes('EventForm.html');
    let eventName;
    
    if (isEventPage) {
        const eventNameInput = document.getElementById("eventName");
        eventName = eventNameInput.value.trim();
    } else {
        // On the matching page, get the event from the matched event input
        const matchedEventInput = document.getElementById("matchedEvent");
        eventName = matchedEventInput.value.trim();
    }
    
    if (!eventName) {
        alert("Please enter an event name to match with a volunteer");
        return;
    }
    
    try {
        // Send match request to the backend API
        const response = await fetch("http://localhost:5000/match-volunteer", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                volunteerId: volunteerId,
                eventName: eventName
            })
        });
        
        const result = await response.json();
        
        if (response.ok) {
            alert(`Volunteer successfully matched to event: ${eventName}`);
        } else {
            alert(`Error: ${result.message}`);
        }
    } 
    
    catch (error) {
        alert("Error matching volunteer. Please try again.");
        console.error(error);
    }
}



function initializeVolunteerMatching() {
    const volunteerSelect = document.getElementById("volunteer");
    const matchedEventInput = document.getElementById("matchedEvent");
    const matchingForm = document.getElementById("volMatchingForm");

    // Load volunteers and events for dropdown
    fetchVolunteers(volunteerSelect);

    volunteerSelect.addEventListener("change", async function () {
        const selectedVolunteerId = this.value;
        if (!selectedVolunteerId) return;

        try {
            const response = await fetch(`http://localhost:5000/get-matched-event/${selectedVolunteerId}`);
            const result = await response.json();

            if (response.ok && result.event) {
                matchedEventInput.value = result.event.name;
            } else {
                matchedEventInput.value = "No matched event";
            }
        } catch (error) {

            console.error("Error fetching matched event", error);
        }
    });

    matchingForm.addEventListener("submit", async function (e) {
        e.preventDefault();
        const volunteerId = volunteerSelect.value;
        const matchedEvent = matchedEventInput.value;

        if (!volunteerId || !matchedEvent) {
            alert("Select a volunteer to confirm match.");
            return;
        }

        try {
            const response = await fetch("http://localhost:5000/confirm-match", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ volunteerId, matchedEvent })
            });

            const result = await response.json();
            if (response.ok) {
                alert("Volunteer match confirmed!");
                matchingForm.reset();
                matchedEventInput.value = "";
            } else {
                alert(`Error: ${result.message}`);
            }
        } catch (error) {
            alert("Error confirming match.");
            console.error(error);
        }
    });
}

async function fetchVolunteers(selectElement) {
    try {
        const response = await fetch("http://localhost:5000/get-volunteers");
        const result = await response.json();

        if (response.ok && result.volunteers.length > 0) {
            result.volunteers.forEach(volunteer => {
                const option = document.createElement("option");
                option.value = volunteer.id;
                option.textContent = volunteer.name;
                selectElement.appendChild(option);
            });
        } else {
            const option = document.createElement("option");
            option.textContent = "No volunteers available";
            selectElement.appendChild(option);
        }
    } catch (error) {
        console.error("Error fetching volunteers", error);
    }
}
