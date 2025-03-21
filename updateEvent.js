// Function to update an event

const Event = require('./models/Event');

async function updateEvent(eventId, updatedData) {
    try{
        if (updatedData.name && (updatedData.name.length < 3 || typeof updatedData.name !== 'string')) {
            return { success: false, message: "Event Name must be at least 3 characters and a string" };
        }
        if (updatedData.location && typeof updatedData.location !== "string") {
            return { success: false, message: "Location must be a string" };
        }
        if (updatedData.description && typeof updatedData.description !== "string") {
            return { success: false, message: "Description must be a string" };
        }
        if (updatedData.skills && (!Array.isArray(updatedData.skills) || updatedData.skills.length === 0 || updatedData.skills.some(skill => typeof skill !== "string"))) {
            return { success: false, message: "Skills must be a non-empty array of strings" };
        }
        if (updatedData.urgency && !["Low", "Medium", "High"].includes(updatedData.urgency)) {
            return { success: false, message: "Urgency must be 'Low', 'Medium', or 'High'" };
        }
        //update event in MongoDb
        const event = await Event.findByIdAndUpdate(
            eventId, 
            updatedData,
            {new: true, runValidators: true}
        );

        if(!event){
            if (!event) {
                return { success: false, message: "Event not found" };
            }
            return { success: true, message: "Event updated successfully", event };
        } 
    }
        
    catch (error) {
        console.error("Error updating event:", error);
        return { success: false, message: "Server error during update" };
    }
}

module.exports = { updateEvent };