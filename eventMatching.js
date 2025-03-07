function matchVolunteer(volunteers, events, volunteerId) {
    // Find the volunteer by ID
    const volunteer = volunteers.find(v => v.id === volunteerId);
    if (!volunteer) {
        return { success: false, message: "Volunteer not found" };
    }

    // Check for matching events based on skills
    const matchedEvents = events.filter(event =>
        event.requiredSkills.some(skill => volunteer.skills.includes(skill))
    );

    if (matchedEvents.length === 0) {
        return { success: false, message: "No matching events found for the volunteer" };
    }

    return { success: true, matchedEvents };
}

module.exports = { matchVolunteer };
