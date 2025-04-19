// Fetch notifications from the backend
function fetchNotifications() {
    fetch('/notifications')
        .then(response => response.json())
        .then(data => {
            console.log("Fetched notifications:", data); // Debug log

            const notificationList = document.getElementById('notification-list');
            notificationList.innerHTML = '';

            data.forEach(notification => {
                const li = document.createElement('li');

                // FIX: Use the `message` field inside the object
                li.textContent = notification.message;

                notificationList.appendChild(li);
            });
        })
        .catch(error => console.error('Error fetching notifications:', error));
}



// Fetch volunteer history from the backend and display in a table
function fetchVolunteerHistory() {
    fetch('/volunteer-history')
        .then(response => response.json())
        .then(data => {
            const historyBody = document.getElementById('history-body');
            historyBody.innerHTML = '';
            data.forEach(history => {
                const row = document.createElement('tr');

                const dateObj = new Date(history.eventDate);
                const formattedDate = dateObj.toISOString().split('T')[0];

                row.innerHTML = `
                    <td>${history.eventName}</td>
                    <td>${formattedDate}</td>
                    <td>${history.location}</td>
                    <td>${history.status}</td>
                `;
                historyBody.appendChild(row);
            });
        })
        .catch(error => console.error('Error fetching volunteer history:', error));
}

// Show section and highlight tab
function showSection(section, clickedLink) {
    document.querySelectorAll('.section').forEach(sec => sec.classList.add('hidden'));
    document.querySelectorAll('.tab-link').forEach(link => link.classList.remove('active'));

    if (section === 'notifications') {
        document.getElementById('notifications').classList.remove('hidden');
        fetchNotifications();
    } else if (section === 'history') {
        document.getElementById('volunteer-history').classList.remove('hidden');
        fetchVolunteerHistory();
    }

    if (clickedLink) {
        clickedLink.classList.add('active');
    }
}

// Set default tab on page load
window.addEventListener('DOMContentLoaded', () => {
    showSection('notifications', document.querySelector('.tab-link'));
});
