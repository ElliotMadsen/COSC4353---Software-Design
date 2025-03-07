const { validateEvent} = require("./createEvent");
const events = [];
describe("Valid Event Creation", () => {
    beforeEach(() => {
        events.length = 0; 
    });

    test("Should create an event if all fields are valid", async () => {
        const eventData = { 
            name: "Beach Cleanup", 
            description: "Beach Cleanups at Galveston.", 
            location: "Galveston", 
            date: "2025-03-10", 
            skills: ["Leadership", "Time Management"],
            urgency: "low"
        };
        const response = validateEvent(eventData);
        expect(response.valid).toBe(true);
        expect(response.message).toBe("Valid event");
    });

    test("Fails if required fields are missing", async () => {
        const eventData = { 
            name: "", 
            description: "", 
            location: "", 
            date: "", 
            skills: [],
            urgency: "" 
        };
        const response = validateEvent(eventData);
        expect(response.valid).toBe(false);
        expect(response.message).toBe("All fields are required");
    });

    test("Fails if event name is too short (Less than 3 character)", () => {
        const eventData = {
            name: "AB",
            description: "Beach Cleanups at Galveston.",
            location: "Galveston",
            date: "2025-03-10",
            skills: ["Leadership", "Time Management"],
            urgency: "low"
        };
        const response = validateEvent(eventData);
        expect(response.valid).toBe(false);
        expect(response.message).toBe("Event Name must be at least 3 characters and a string");
    });

    test("Returns error if location is not a string", () => {
        const eventData = {
            name: "Food Drive",
            description: "Helping to distribute food.",
            location: 12345, // Invalid type
            date: "2025-03-10",
            skills: ["Organizing"],
            urgency: "high"
        };

        const response = validateEvent(eventData);
        expect(response.valid).toBe(false);
        expect(response.message).toBe("Location must be a string");
    });

    test("Returns error if location is not a string", () => {
        const eventData = {
            name: "Food Drive",
            description: "Helping to distribute food.",
            location: 12345, // Invalid type
            date: "2025-03-10",
            skills: ["Organizing"],
            urgency: "high"
        };

        const response = validateEvent(eventData);
        expect(response.valid).toBe(false);
        expect(response.message).toBe("Location must be a string");
    });

    test("Returns error if Description is not a string", () => {
        const eventData = {
            name: "Beach Cleanups at Galveston.",
            description: 123, // Invalid type
            location: "Galveston", 
            date: "2025-03-10",
            skills: ["Leadership", "Time Management"],
            urgency: "high"
        };

        const response = validateEvent(eventData);
        expect(response.valid).toBe(false);
        expect(response.message).toBe("Description must be a string");
    });

    test("Returns error if Skills is not a non-empty array of strings", () => {
        const eventData = {
            name: "Beach Cleanups at Galveston.",
            description: "Clean up to beautify our beach", 
            location: "Galveston", 
            date: "2025-03-10",
            skills: [1], // Invalid type
            urgency: "high"
        };

        const response = validateEvent(eventData);
        expect(response.valid).toBe(false);
        expect(response.message).toBe("Skills must be a non-empty array of strings");
    });

    test("Returns error if Skills is not a non-empty array of strings", () => {
        const eventData = {
            name: "Beach Cleanups at Galveston.",
            description: "Clean up to beautify our beach", 
            location: "Galveston", 
            date: "2025-03-10",
            skills: ["Leadership", "Time Management"],
            urgency: "moderate" // Invalid type
        };

        const response = validateEvent(eventData);
        expect(response.valid).toBe(false);
        expect(response.message).toBe("Urgency must be 'low', 'medium', or 'high'");
    });

    
});