const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const app = express();

const { validateEvent } = require("./createEvent");
const { matchVolunteer } = require("./eventMatching");
const { updateEvent } = require("./updateEvent");

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

mongoose.connect('mongodb://localhost:27017/volunteer_management')
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));


app.post("/create-event", async (req, res) => {
    try{
        const result = await validateEvent(req.body);
        if(result.valid) {
            return res.json({ success: true, message: "Event created successfully", event: result.event });
        }
        else {
            return res.status(400).json({ success: false, message: result.message });
        }
    } 

    catch (error) {
        console.error("Error creating event:", error);
        return res.status(500).json({success: false, message: "Server error"});
    }

});

app.post("/match-volunteer", async (req, res) => {
    try {
        const { volunteerID, eventName } = req.body;
        if(!volunteerID || !eventName){
            return res.status(400).json({ success: false, message: "Volunteer ID and event name are required" });
        }

        const result = await matchVolunteer( volunteerID, eventName);

        if(result.success){
            return res.json(result);
        }
        else {
            return res.status(404).json(result);
        }
    }
    catch (error) {
        console.error("Error matching volunteer:", error);
        return res.status(500).json({ success: false, message: "Server error" });
      }
});

app.put("/update-event", async (req, res) => {
    try {
      const { eventId, updatedData } = req.body;
      
      if (!eventId || !updatedData) {
        return res.status(400).json({ success: false, message: "Event ID and updated data are required" });
      }
      
      const result = await updateEvent(eventId, updatedData);
      
      if (result.success) {
        return res.json(result);
      } else {
        return res.status(404).json(result);
      }
    } catch (error) {
      console.error("Error updating event:", error);
      return res.status(500).json({ success: false, message: "Server error" });
    }
});

app.get("/get-volunteers", async (req, res) => {
    try {
      const Volunteer = mongoose.model('Volunteer');
      const volunteers = await Volunteer.find();
      res.json({ success: true, volunteers });
    } catch (error) {
      console.error("Error fetching volunteers:", error);
      return res.status(500).json({ success: false, message: "Server error" });
    }
});

app.get("/get-matched-event/:volunteerId", async (req, res) => {
    try {
        const volunteerId = req.params.volunteerId;
        const Match = mongoose.model('Match');
        const Event = mongoose.model('Event');

        const match = await Match.findOne({volunteerID}).sort({dateMatched: -1});

        if (!match) {
            return res.json({ success: true, event: null });
        }

        const event = await Event.findById(match.eventId);
    
    if (!event) {
      return res.json({ success: true, event: null });
    }
    
    return res.json({ success: true, event });
  } 
  
  catch (error) {
    console.error("Error fetching matched event:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

app.post("/confirm-match", async (req, res) => {
    try {
        const { volunteerId, matchedEvent } = req.body;
        
        if (!volunteerId || !matchedEvent) {
          return res.status(400).json({ success: false, message: "Volunteer ID and matched event are required" });
        }
        
        const Volunteer = mongoose.model('Volunteer');
        const Event = mongoose.model('Event');
        const Match = mongoose.model('Match');
        
        const volunteer = await Volunteer.findById(volunteerId);
        const event = await Event.findOne({ name: matchedEvent });
        
        if (!volunteer || !event) {
          return res.status(404).json({ success: false, message: "Volunteer or event not found" });
        }
        
        // Check if already matched
        const existingMatch = await Match.findOne({ 
          volunteerId: volunteer._id, 
          eventId: event._id,
          confirmed: true
        });
        
        if (existingMatch) {
          return res.json({ 
            success: true, 
            message: "Match already confirmed", 
            match: existingMatch 
          });
        }
        
        // Create a new match
        const newMatch = new Match({
          volunteerId: volunteer._id,
          eventId: event._id,
          dateMatched: new Date(),
          confirmed: true
        });
        
        await newMatch.save();
        
        return res.json({ 
          success: true, 
          message: "Match confirmed successfully", 
          match: newMatch 
        });
      } catch (error) {
        console.error("Error confirming match:", error);
        return res.status(500).json({ success: false, message: "Server error" });
      }
});

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
    
module.exports = { app };