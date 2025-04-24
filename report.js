//make sure to install pdfmake! -->  npm install pdfmake

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const { stringify } = require('csv-stringify');
const PdfPrinter = require('pdfmake');
const path = require('path');

const fonts = {
    Roboto: {
        normal: '../fonts/Roboto-Regular.ttf',
        bold: '../fonts/Roboto-Medium.ttf',
        italics: '../fonts/Roboto-Italic.ttf',
        bolditalics: '../fonts/Roboto-MediumItalic.ttf',
    },
};

const printer = new PdfPrinter(fonts);

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'backend', 'public')));

// --- Connect to the MongoDB database ---
const dbUrl = 'mongodb://127.0.0.1:27017/COSC4353-Database';



mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;


// ---  Schemas ---
const MatchSchema = new mongoose.Schema({
    userID: mongoose.Schema.Types.ObjectId,
    eventID: mongoose.Schema.Types.ObjectId,
    dateMatched: Date,
    confirmed: Boolean
}, { collection: 'matching' });

const EventSchema = new mongoose.Schema({
    name: String,
    description: String,
    location: String,
    skills: [String],
    urgency: String,
    date: Date,
}, { collection: 'create_events' });

const UserProfileSchema = new mongoose.Schema({
    userID: mongoose.Schema.Types.ObjectId,
    fullName: String,
    address1: String,
    address2: String,
    availability: [String],
    city: String,
    preferences: String,
    skills: [String],
    state: String,
}, { collection: 'update_profiles' });

const Match = reportingDb.model('Match', MatchSchema);
const Event = reportingDb.model('Event', EventSchema);
const UserProfile = reportingDb.model('UserProfile', UserProfileSchema);


// --- Volunteer Report (from update_profiles only) ---
app.get('/reports/volunteer-participation', async (req, res) => {
    try {
        const matches = await MatchModel.find({});
        const events = await EventModel.find({});
        const users = await UserProfileModel.find({});

        const reportData = matches.map(match => {
            const volunteer = users.find(u => u._id.toString() === match.userID.toString());
            const event = events.find(e => e._id.toString() === match.eventID.toString());

            return {
                volunteerName: volunteer?.fullName || 'Unknown',
                skills: volunteer?.skills?.join(', ') || 'N/A',
                eventName: event?.name || 'Unknown',
                eventDate: event?.date ? new Date(event.date).toLocaleDateString() : 'N/A',
                confirmed: match.confirmed ? 'Yes' : 'No'
            };
        });

        const format = req.query.format || 'json';

        if (format === 'csv') {
            stringify(reportData, { header: true }, (err, output) => {
                if (err) return res.status(500).send('CSV error');
                res.header('Content-Type', 'text/csv');
                res.header('Content-Disposition', 'attachment; filename="volunteer_participation.csv"');
                res.send(output);
            });
        } else if (format === 'pdf') {
            const documentDefinition = {
                content: [
                    { text: 'Volunteer Participation Report', style: 'header' },
                    ...reportData.map(entry => ([
                        { text: entry.volunteerName, style: 'subheader' },
                        `Skills: ${entry.skills}`,
                        `Event: ${entry.eventName}`,
                        `Date: ${entry.eventDate}`,
                        `Confirmed: ${entry.confirmed}`,
                        '\n',
                    ])),
                ],
                styles: {
                    header: { fontSize: 18, bold: true },
                    subheader: { fontSize: 14, bold: true, margin: [0, 10, 0, 5] },
                },
            };

            const pdfDoc = printer.createPdfKitDocument(documentDefinition);
            const chunks = [];
            pdfDoc.on('data', chunk => chunks.push(chunk));
            pdfDoc.on('end', () => {
                const result = Buffer.concat(chunks);
                res.setHeader('Content-Type', 'application/pdf');
                res.setHeader('Content-Disposition', 'attachment; filename="volunteer_participation.pdf"');
                res.send(result);
            });
            pdfDoc.end();
        } else {
            res.json(reportData);
        }
    } catch (err) {
        console.error('Error generating report:', err);
        res.status(500).send('Error generating report');
    }
});

app.get('/reports/event-assignments', async (req, res) => {
    try {
        const matches = await MatchModel.find({});
        const events = await EventModel.find({});
        const users = await UserProfileModel.find({});

        const eventMap = {};
        matches.forEach(match => {
            const event = events.find(e => e._id.toString() === match.eventID.toString());
            const user = users.find(u => u._id.toString() === match.userID.toString());

            if (!event || !user) return;

            if (!eventMap[event._id]) {
                eventMap[event._id] = {
                    eventName: event.name,
                    date: event.date,
                    location: event.location,
                    description: event.description,
                    assignedVolunteers: []
                };
            }

            eventMap[event._id].assignedVolunteers.push({
                name: user.fullName,
                skills: user.skills?.join(', ') || 'N/A'
            });
        });

        const reportData = Object.values(eventMap);

        const format = req.query.format || 'json';

        if (format === 'csv') {
            const csvData = reportData.flatMap(event =>
                event.assignedVolunteers.map(volunteer => ({
                    eventName: event.eventName,
                    eventDate: new Date(event.date).toLocaleDateString(),
                    eventLocation: event.location,
                    volunteerName: volunteer.name,
                    volunteerSkills: volunteer.skills
                }))
            );

            stringify(csvData, { header: true }, (err, output) => {
                if (err) return res.status(500).send('CSV error');
                res.header('Content-Type', 'text/csv');
                res.header('Content-Disposition', 'attachment; filename="event_assignments.csv"');
                res.send(output);
            });
        } else if (format === 'pdf') {
            const documentDefinition = {
                content: [
                    { text: 'Event Assignment Report', style: 'header' },
                    ...reportData.map(event => ([
                        { text: event.eventName, style: 'subheader' },
                        `Date: ${new Date(event.date).toLocaleDateString()}`,
                        `Location: ${event.location}`,
                        `Description: ${event.description}`,
                        ...event.assignedVolunteers.map(v => `Volunteer: ${v.name} (Skills: ${v.skills})`),
                        '\n',
                    ])),
                ],
                styles: {
                    header: { fontSize: 18, bold: true },
                    subheader: { fontSize: 14, bold: true, margin: [0, 10, 0, 5] },
                },
            };

            const pdfDoc = printer.createPdfKitDocument(documentDefinition);
            const chunks = [];
            pdfDoc.on('data', chunk => chunks.push(chunk));
            pdfDoc.on('end', () => {
                const result = Buffer.concat(chunks);
                res.setHeader('Content-Type', 'application/pdf');
                res.setHeader('Content-Disposition', 'attachment; filename="event_assignments.pdf"');
                res.send(result);
            });
            pdfDoc.end();
        } else {
            res.json(reportData);
        }
    } catch (err) {
        console.error('Error generating report:', err);
        res.status(500).send('Error generating report');
    }
});



// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Reporting service listening on port ${PORT}`);
});

module.exports = app;
