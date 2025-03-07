const express = require("express");
const cors = require("cors");
const app = express();

const { validateEvent } = require("./createEvent");
const { matchVolunteer } = require("./eventMatching");
const { updateEvent } = require("./updateEvent");

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

app.listen(5000, () => console.log("Server running on http://localhost:5000"));

const events = [
    { id: 100, name: "Beach Cleanup", requiredSkills: ["Leadership", "Time Management"] },
    { id: 101, name: "Charity Auction", requiredSkills: ["Fundraising", "Data-Entry"] }
];
const volunteers = [
    { id: 1, name: "Jane Doe", skills: ["Leadership", "Mentoring"] },
    { id: 2, name: "John Doe", skills: ["Fundraising", "Data-Entry"] }
];

app.post("/create-event", (req, res) => res.json(validateEvent(events, req.body)));
app.post("/match-volunteer", (req, res) => res.json(matchVolunteer(volunteers, events, req.body.volunteerId)));
app.put("/update-event", (req, res) => res.json(updateEvent(events, req.body.eventId, req.body.updatedData)));


module.exports = { app };