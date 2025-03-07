
// validate event function
function validateEvent(eventData) {
    if (!eventData.name || !eventData.description || !eventData.location || !eventData.date || eventData.skills.length === 0) {
        return { valid: false, message: "All fields are required" };
    }
    if (eventData.name && (eventData.name.length < 3 || typeof eventData.name !== 'string')) {
        return { valid: false, message: "Event Name must be at least 3 characters and a string" };
    }
    if (typeof eventData.location !== "string"){
        return { valid: false, message: "Location must be a string" };
    }
    if (typeof eventData.description !== "string"){
        return { valid: false, message: "Description must be a string" };
    }
    if (!Array.isArray(eventData.skills) || eventData.skills.length === 0 || eventData.skills.some(skill => typeof skill !== "string")) {
        return { valid: false, message: "Skills must be a non-empty array of strings" };
    }
    if (!["low", "medium", "high"].includes(eventData.urgency)) {
        return { valid: false, message: "Urgency must be 'low', 'medium', or 'high'" };
    }

    return { valid: true, message: "Valid event" };
}

module.exports = { validateEvent };