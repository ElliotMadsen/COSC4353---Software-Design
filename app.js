// Sample data for notifications and volunteer history
const notifications = [
    "You have been assigned to the Cooking Event on 2023-10-15.",
    "New event created: Community Clean-Up on 2023-10-20.",
    "Reminder: Your next event is on 2023-10-18."
];

const volunteerHistory = [
    {
        eventName: "Cooking Class",
        eventDate: "2023-10-15",
        location: "Community Center",
        status: "Completed"
    },
    {
        eventName: "Beach Clean-Up",
        eventDate: "2023-09-10",
        location: "Local Beach",
        status: "Completed"
    },
    {
        eventName: "Food Drive",
        eventDate: "2023-08-25",
        location: "City Hall",
        status: "Pending"
    }
];

// Function to display notifications
function displayNotifications() {
    const notificationList = document.getElementById('notification-list');
    notifications.forEach(notification => {
        const li = document.createElement('li');
        li.textContent = notification;
        notificationList.appendChild(li);
    });
}

// Function to display volunteer history
function displayVolunteerHistory() {
    const historyBody = document.getElementById('history-body');
    volunteerHistory.forEach(history => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${history.eventName}</td>
            <td>${history.eventDate}</td>
            <td>${history.location}</td>
            <td>${history.status}</td>
        `;
        historyBody.appendChild(row);
    });
}

// Function to show the selected section
function showSection(section) {
    // Hide all sections
    document.querySelectorAll('.section').forEach(sec => {
        sec.classList.add('hidden');
    });

    // Show the selected section
    if (section === 'notifications') {
        document.getElementById('notifications').classList.remove('hidden');
    } else if (section === 'history') {
        document.getElementById('volunteer-history').classList.remove('hidden');
    } else if (section === 'profile') {
        document.getElementById('profile-section').classList.remove('hidden');
    }
}

// Call the functions to display data
displayNotifications();
displayVolunteerHistory();