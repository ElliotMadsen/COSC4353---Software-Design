const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(cors());

// Sample data for notifications and volunteer history
let notifications = [
    "You have been assigned to the Cooking Event on 2023-10-15.",
    "New event created: Community Clean-Up on 2023-10-20.",
    "Reminder: Your next event is on 2023-10-18."
];

let volunteerHistory = [
    { id: 1, eventName: "Cooking Class", eventDate: "2023-10-15", location: "Community Center", status: "Completed" },
    { id: 2, eventName: "Beach Clean-Up", eventDate: "2023-09-10", location: "Local Beach", status: "Completed" },
    { id: 3, eventName: "Food Drive", eventDate: "2023-08-25", location: "City Hall", status: "Pending" }
];

// Routes

// Get all notifications
app.get('/notifications', (req, res) => {
    res.json(notifications);
});

// Add a new notification
app.post('/notifications', (req, res) => {
    const { message } = req.body;

    if (!message) {
        return res.status(400).json({ error: "Message is required" });
    }

    if (typeof message !== "string") {
        return res.status(400).json({ error: "Message must be a string" });
    }

    notifications.push(message);
    res.status(201).json({ message: "Notification added successfully" });
});

// Get volunteer history
app.get('/volunteer-history', (req, res) => {
    res.json(volunteerHistory);
});

// Update volunteer history status
app.put('/volunteer-history/:id', (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const volunteer = volunteerHistory.find(v => v.id === parseInt(id));

    if (!volunteer) {
        return res.status(404).json({ error: "Volunteer event not found" });
    }

    if (!status) {
        return res.status(400).json({ error: "Status is required" });
    }

    volunteer.status = status;
    res.json({ message: "Status updated successfully", volunteer });
});

// Handle unknown routes
app.all('*', (req, res) => {
    res.status(404).json({ error: "Route not found" });
});

// Start the server only if this file is run directly
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
}

// Export the app for testing
module.exports = app;
