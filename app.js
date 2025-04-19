const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const VolunteerHistory = require('./models/VolunteerHistory');
const Notification = require('./models/Notification'); // NEW

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static('public'));

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/volunteerOrg', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('✅ Connected to MongoDB...'))
  .catch(err => console.error('❌ Could not connect to MongoDB...', err));

// ==============================
// NOTIFICATIONS (NOW FROM DB)
// ==============================

// GET all notifications
app.get('/notifications', async (req, res) => {
  try {
    const notifications = await Notification.find();
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// POST a new notification
app.post('/notifications', async (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ error: "Message is required" });
  if (typeof message !== 'string') return res.status(400).json({ error: "Message must be a string" });

  try {
    const newNotification = new Notification({ message });
    await newNotification.save();
    res.status(201).json({ message: "Notification saved successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to save notification" });
  }
});

// ==============================
// VOLUNTEER HISTORY
// ==============================

// GET history
app.get('/volunteer-history', async (req, res) => {
  try {
    const history = await VolunteerHistory.find();
    res.json(history);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// UPDATE history status
app.put('/volunteer-history/:id', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status) return res.status(400).json({ error: 'Status is required' });

  try {
    const updated = await VolunteerHistory.findOneAndUpdate({ id: parseInt(id) }, { status }, { new: true });
    if (!updated) return res.status(404).json({ error: 'Volunteer event not found' });

    res.json({ message: 'Status updated successfully', updated });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Handle unknown routes
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

module.exports = app;
