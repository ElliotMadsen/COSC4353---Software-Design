const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const cors = require("cors");

console.log("Server is starting...");

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect("mongodb://0.0.0.0:27017/COSC4353-Database", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// **User Login Schema**
const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const UserModel = mongoose.model("users", UserSchema);

// **User Profile Schema**
const ProfileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "users", unique: true },
  fullName: { type: String },
  address1: { type: String },
  address2: { type: String },
  city: { type: String },
  state: { type: String },
  skills: { type: [String] },
  preferences: { type: Object },
  availability: { type: [String] },
});

const ProfileModel = mongoose.model("update_profiles", ProfileSchema);

// **Event Schema**
const EventSchema = new mongoose.Schema({
  creatorId: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
  name: { type: String, required: true },
  description: { type: String },
  location: { type: String },
  skills: { type: [String] },
  urgency: { type: String },
  date: { type: Date, required: true },
});

const EventModel = mongoose.model("create_event", EventSchema);

// **Matches Schema**
const MatchSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "update_profiles", required: true }, 
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: "create_event", required: true },
  matchedAt: {type: Date, dedfault: Date.now },
});

const MatchModel = mongoose.model("matches", MatchSchema);

// **Signup Route**
app.post("/signup", async (req, res) => {
  try {
    const { email, password } = req.body;
    const existingUser = await UserModel.findOne({ email });

    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new UserModel({ email, password: hashedPassword });

    await newUser.save();
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error creating user" });
  }
});

// **Login Route**
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid email or password" });

    res.status(200).json({ message: "Login successful", userId: user._id });
  } catch (error) {
    res.status(500).json({ message: "Error logging in" });
  }
});

// **Update Profile Route**
app.post("/updateprofile", async (req, res) => {
  try {
    const { userId, fullName, address1, address2, city, state, skills, preferences, availability } = req.body;

    const profile = await ProfileModel.findOneAndUpdate(
      { userId },
      { fullName, address1, address2, city, state, skills, preferences, availability },
      { new: true, upsert: true }
    );

    res.status(200).json({ message: "Profile updated successfully", profile });
  } catch (error) {
    res.status(500).json({ message: "Error updating profile" });
  }
});

// **Get Profile Route**
app.get("/getProfile/:userId", async (req, res) => {
  try {
    const profile = await ProfileModel.findOne({ userId: req.params.userId });
    if (!profile) return res.status(404).json({ message: "Profile not found" });

    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: "Error fetching profile" });
  }
});

// **Create Event Route**
app.post("/application", async (req, res) => {
  try {
    const { creatorId, name, description, location, skills, urgency, date } = req.body;

    const newEvent = new EventModel({ creatorId, name, description, location, skills, urgency, date });
    await newEvent.save();

    res.status(201).json({ message: "Event created successfully", event: newEvent });
  } catch (error) {
    res.status(500).json({ message: "Error creating event" });
  }
});

// **Get All Events Route**
app.get("/getEvents", async (req, res) => {
  try {
    const events = await EventModel.find({});
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: "Error fetching events" });
  }
});

app.listen(3001, () => {
  console.log("Server is running on port 3001");
});

// **Match Volunteer to Event**
app.get("/match/:userId", async (req, res) => {
  try{
    const profile = await ProfileModel.findOne({ _id: req.params.userId});
    if (!profile || !profile.skills || !profile.availability) {
      return res.status(404).json({ message: "Profile or required fields missing" });
    }

    const normalizedAvailability = profile.availability.map(str => {
      const date = new Date(str);
      return date.toISOString().split('T')[0];
    });
    const events = await EventModel.find({ skills: { $in: profile.skills } });
    const matchedEvent = events.find(event => {
      const eventDate = new Date(event.date).toISOString().split('T')[0];
      return normalizedAvailability.includes(eventDate);
    });

    if (!matchedEvent) {
      return res.status(404).json({ message: "No matching event based on user profile"});
    }
    res.status(200).json({ event: matchedEvent });
  } catch (error) {
    console.error("Error matching volunteer:", error);
    res.status(500).json({ message: "Error matching volunteer"});
  }
});

// **Get volunteers**
app.get("/volunteers", async (req, res) => {
  try {
    const volunteers = await ProfileModel.find({}, { _id: 1, fullName: 1, skills: 1 });
    res.status(200).json(volunteers);
  } catch (error) {
    console.error("Error fetching volunteers:", error);
    res.status(500).json({ message: "Error fetching volunteers" });
  }
});

app.post("/match", async (req, res) => {
  try {
    const {userId, eventId } = req.body;

    if (!userId || !eventId) {
      return res.status(400).json( { message: "Missing user or event id"});
    }
    const newMatch = new MatchModel({ userId, eventId });
    await newMatch.save();

    res.status(201).json({ message: "Matched saved" });
  } catch (error){
    console.error("error saving match", error);
    res.status(500).json({ message: "Failed to save the match" });
  }
});
