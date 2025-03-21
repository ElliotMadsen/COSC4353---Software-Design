const Volunteer = require('./models/Volunteer');
const Event = require('./models/Event');
const Match = require('./models/Match');

async function matchVolunteer(volunteerId, eventName) {
    try {
        const volunteer = await Volunteer.findById(volunteerId);
        const event = await Event.findOne({name: eventName});

        if(!volunteer){
            return {success: false, message:"Volunteer not found"};
        }
        if (!event) {
            return { success: false, message: "Event not found" };
        }

        const hasRequiredSkills = event.skills.some(skill => volunteer.skills.includes(skill));
        if (!hasRequiredSkills) {
            return { success: false, message: "Volunteer doesn't have required skills for this event" };
        }

        //create a match record
        const match = new Match({
            volunteerId: volunteer._id,
            eventId: event._id,
            dateMatched: new Date(),
            confirmed: false
        });

        await match.save();
        return {
            success: true, 
            message: "Volunteer matched successfully", 
            match: {
                id: match._id,
                volunteerId: volunteer._id,
                eventId: event._id,
                volunteerName: volunteer.name,
                eventName: event.name,
                dateMatched: match.dateMatched
            }
        };
    }

    catch (error) {
        console.log("Error in matching Volunteer:", error);
        return {success: false, message: "Server error during matching"};
    }
}

module.exports = { matchVolunteer };
