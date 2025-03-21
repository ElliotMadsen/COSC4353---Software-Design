const { validateEvent} = require("./createEvent");
const Event = require('./models/Event');

jest.mock('./models/Event', () => {
    return jest.fn().mockImplementation((data) => {
        return {
            ...data,
            save: jest.fn().mockResolvedValue(data)
        };
    });
});

describe("Valid Event Creation", () => {
    beforeEach(() => {
        jest.clearAllMocks();  
    });

    test("Should create an event if all fields are valid", async () => {
        const eventData = { 
            name: "Beach Cleanup", 
            description: "Beach Cleanups at Galveston.", 
            location: "Galveston", 
            date: new Date(), 
            skills: ["Leadership", "Time Management"],
            urgency: "low"
        };
        console.log('Testing with data:', eventData);
  
        const result = await validateEvent(eventData);
        console.log('Result:', result);

        expect(result.valid).toBe(true);
        expect(result.message).toBe('Valid event');
        expect(result.event).toBeDefined();
        expect(Event).toHaveBeenCalledWith(eventData);
        expect(Event.mock.instances[0].save).toHaveBeenCalled();
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
        const result = await validateEvent(eventData);
        expect(result.valid).toBe(false);
        expect(result.message).toBe('All fields are required');
        expect(Event).not.toHaveBeenCalled();
    });

    test("Fails if event name is too short (Less than 3 character)", async () => {
        const eventData = {
            name: "AB",
            description: "Beach Cleanups at Galveston.",
            location: "Galveston",
            date: new Date(),
            skills: ["Leadership", "Time Management"],
            urgency: "low"
        };
        const result = await validateEvent(eventData);
        expect(result.valid).toBe(false);
        expect(result.message).toBe('Event Name must be at least 3 characters and a string');
        expect(Event).not.toHaveBeenCalled();
    });

    test("Returns error if location is not a string", async () => {
        const eventData = {
            name: "Food Drive",
            description: "Helping to distribute food.",
            location: 12345, // Invalid type
            date: new Date(),
            skills: ["Organizing"],
            urgency: "high"
        };

        const result = await validateEvent(eventData);
        expect(result.valid).toBe(false);
        expect(result.message).toBe('Location must be a string');
        expect(Event).not.toHaveBeenCalled();
    });


    test("Returns error if Description is not a string", async () => {
        const eventData = {
            name: "Beach Cleanups at Galveston.",
            description: 123, // Invalid type
            location: "Galveston", 
            date: new Date(),
            skills: ["Leadership", "Time Management"],
            urgency: "high"
        };

        const result = await validateEvent(eventData);
        expect(result.valid).toBe(false);
        expect(result.message).toBe('Description must be a string');
        expect(Event).not.toHaveBeenCalled();
    });

    test("Returns error if Skills is not a non-empty array of strings", async () => {
        const eventData = {
            name: "Beach Cleanups at Galveston.",
            description: "Clean up to beautify our beach", 
            location: "Galveston", 
            date: new Date(),
            skills: [1], // Invalid type
            urgency: "high"
        };

        const result = await validateEvent(eventData);
    
        expect(result.valid).toBe(false);
        expect(result.message).toBe('Skills must be a non-empty array of strings');
        expect(Event).not.toHaveBeenCalled();
    });

    test('should handle database errors', async () => {
        const eventData = {
          name: 'Beach Cleanup',
          description: 'Community cleanup at Main Beach',
          location: 'Main Beach',
          date: new Date(),
          skills: ['Organizing', 'Environment'],
          urgency: 'Medium'
        };
    
        // Mock implementation to throw an error
        const mockErrorSave = jest.fn().mockRejectedValue(new Error('Database connection error'));
            Event.mockImplementationOnce(() => ({
                ...eventData,
                save: mockErrorSave
            }));

        const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

        const result = await validateEvent(eventData);
    
        expect(result.valid).toBe(false);
        expect(result.message).toBe('Error saving event to database');
        expect(consoleSpy).toHaveBeenCalled();
        expect(mockErrorSave).toHaveBeenCalled();
    
        consoleSpy.mockRestore();
    });
    
});