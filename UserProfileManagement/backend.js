const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'updateprofile.html'));
});

mongoose.connect('mongodb://localhost:27017/userProfiles')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Error connecting to MongoDB:', err));

const userProfileSchema = new mongoose.Schema({
    fullName: { type: String, required: true, maxlength: 50 },
    address1: { type: String, required: true, maxlength: 100 },
    address2: { type: String, maxlength: 100 },
    city: { type: String, required: true, maxlength: 100 },
    state: { type: String, required: true },
    zip: { type: String, required: true, validate: /^[0-9]{5}$/ },
    skills: [String],
    preferences: String,
    availability: [String]
});

const UserProfile = mongoose.model('UserProfile', userProfileSchema);

app.post('/submitProfile', (req, res) => {
    console.log('Received form data:', req.body); // Check the incoming data
    const formData = req.body;

    const backendResponse = processUserData(formData);  // Calling the local function

    if (backendResponse.success) {
        const newUserProfile = new UserProfile({
            fullName: formData.fullName,
            address1: formData.address1,
            address2: formData.address2,
            city: formData.city,
            state: formData.state,
            zip: formData.zip,
            skills: formData.skills,
            preferences: formData.preferences,
            availability: formData.availability
        });

        newUserProfile.save()
            .then(() => {
                console.log('Profile saved successfully!'); // Confirm save
                res.status(200).json({
                    success: true,
                    message: 'Profile saved successfully!',
                    data: backendResponse.data
                });
            })
            .catch(err => {
                console.error('Error saving profile:', err);
                res.status(500).json({
                    success: false,
                    message: 'Error saving profile to database.'
                });
            });
    } else {
        res.status(400).json({
            success: false,
            message: backendResponse.message
        });
    }
});
app.post('/update-profile', async (req, res) => {
  const formData = req.body;
  console.log('Received update form data:', formData);

  const backendResponse = processUserData(formData);

  if (backendResponse.success) {
      try {
          const updatedProfile = await UserProfile.findOneAndUpdate(
              { fullName: formData.fullName }, // Use fullName as the unique identifier
              {
                  address1: formData.address1,
                  address2: formData.address2,
                  city: formData.city,
                  state: formData.state,
                  skills: formData.skills,
                  preferences: formData.preferences,
                  availability: formData.availability,
              },
              { new: true, runValidators: true }
          );

          if (updatedProfile) {
              res.json({ success: true, message: 'Profile updated successfully.', data: updatedProfile });
          } else {
              res.status(404).json({ success: false, message: 'Profile not found.' });
          }
      } catch (error) {
          console.error('Error updating profile:', error);
          res.status(500).json({
              success: false,
              message: 'Error updating profile.',
              error: error.message
          });
      }
  } else {
      res.status(400).json({
          success: false,
          message: backendResponse.message
      });
  }
});

app.listen(3000, () => {
    console.log('Backend server running on http://localhost:3000');
});

function validateZipCode(zipCode) {
  if (typeof zipCode !== 'string' || zipCode.length !== 5 || !/^\d+$/.test(zipCode)) {
    return false;
  }
  return true;
}

function processUserData(userData) {
  if (!userData.fullName) {
    return { success: false, message: "Full Name is required." };
  }
  if (!userData.address1) {
    return { success: false, message: "Address 1 is required." };
  }
  if (!userData.city) {
    return { success: false, message: "City is required." };
  }
  if (!userData.state) {
    return { success: false, message: "State is required." };
  }
  if (!userData.zip) {
    return { success: false, message: "Zip Code is required." };
  }
  if (userData.skills.length === 0) {
    return { success: false, message: "Skills are required." };
  }
  if (userData.availability.length === 0) {
    return { success: false, message: "Availability is required." };
  }
  if (!validateZipCode(userData.zip)) {
    return { success: false, message: "Invalid Zipcode" };
  }

  if (userData.fullName.length > 50) {
    return { success: false, message: "Full Name exceeds 50 characters." };
  }
  if (userData.address1.length > 100) {
    return { success: false, message: "Address 1 exceeds 100 characters." };
  }
  if (userData.address2 && userData.address2.length > 100) {
    return { success: false, message: "Address 2 exceeds 100 characters." };
  }
  if (userData.city.length > 100) {
    return { success: false, message: "City exceeds 100 characters." };
  }

  let storedData = {
    ...userData,
    status: "processed"
  };
  return { success: true, message: "Data processed", data: storedData };
}

console.log("Static files served from:", path.join(__dirname, 'public'));
app.use(express.static(path.join(__dirname, 'public')));

// At the end of backend.js, add:
module.exports = {
  app,
  validateZipCode,
  processUserData
};