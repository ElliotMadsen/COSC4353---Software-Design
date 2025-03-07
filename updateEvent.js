// Function to update an event
function updateEvent(events, eventId, updatedData) {

    const eventIndex = events.findIndex(event => event.id === eventId);
    if (eventIndex === -1) {
        return { success: false, message: "Event not found" };
    }
    
    // Validate update fields
    if (updatedData.name && updatedData.name.length < 3) {
        return { success: false, message: "Event Name must be at least 3 characters" };
    }
    if (updatedData.requiredSkills && !Array.isArray(updatedData.requiredSkills)) {
        return { success: false, message: "Required skills must be an array" };
    }
    
    // Update the event
    const updatedEvent = { ...events[eventIndex], ...updatedData };

    // Replace past event 
    events[eventIndex] = updatedEvent;

    return { success: true, updatedEvent };
}
module.exports = { updateEvent };