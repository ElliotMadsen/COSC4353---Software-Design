// Fetch notifications from the backend
function fetchNotifications() {
    fetch('http://localhost:3000/notifications')
        .then(response => response.json())
        .then(data => {
            const notificationList = document.getElementById('notification-list');
            notificationList.innerHTML = ''; // Clear previous entries
            data.forEach(notification => {
                const li = document.createElement('li');
                li.textContent = notification;
                notificationList.appendChild(li);
            });
        })
        .catch(error => console.error('Error fetching notifications:', error));
}

// Fetch volunteer history from the backend and display in a table
function fetchVolunteerHistory() {
    fetch('http://localhost:3000/volunteer-history')
        .then(response => response.json())
        .then(data => {
            const historyBody = document.getElementById('history-body');
            historyBody.innerHTML = ''; // Clear previous entries
            data.forEach(history => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${history.eventName}</td>
                    <td>${history.eventDate}</td>
                    <td>${history.location}</td>
                    <td>${history.status}</td>
                `;
                historyBody.appendChild(row);
            });
        })
        .catch(error => console.error('Error fetching volunteer history:', error));
}

// Function to show the selected section
function showSection(section) {
    // Hide all sections
    document.querySelectorAll('.section').forEach(sec => {
        sec.classList.add('hidden');
    });

    // Show the selected section and fetch data if needed
    if (section === 'notifications') {
        document.getElementById('notifications').classList.remove('hidden');
        fetchNotifications();
    } else if (section === 'history') {
        document.getElementById('volunteer-history').classList.remove('hidden');
        fetchVolunteerHistory();
    } else if (section === 'profile') {
        document.getElementById('profile-section').classList.remove('hidden');
    }
}

// Call functions on page load to display data
fetchNotifications();
fetchVolunteerHistory();
