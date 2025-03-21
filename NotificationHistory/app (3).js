// Fetch notifications from the backend
function fetchNotifications() {
    fetch('/notifications')
        .then(response => response.json())
        .then(data => {
            const notificationList = document.getElementById('notification-list');
            notificationList.innerHTML = '';
            data.forEach(notification => {
                const li = document.createElement('li');
                li.textContent = notification;
                notificationList.appendChild(li);
            });
        })
        .catch(error => console.error('Error fetching notifications:', error));
}

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

function showSection(section) {
    document.querySelectorAll('.section').forEach(sec => sec.classList.add('hidden'));

    if (section === 'notifications') {
        document.getElementById('notifications').classList.remove('hidden');
        fetchNotifications();
    } else if (section === 'history') {
        document.getElementById('volunteer-history').classList.remove('hidden');
        fetchVolunteerHistory();
    }
}

window.addEventListener('DOMContentLoaded', () => {
    fetchNotifications();
    fetchVolunteerHistory();
});
