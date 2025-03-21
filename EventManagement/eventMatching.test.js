const { matchVolunteer } = require('./eventMatching');
const Volunteer = require('./models/Volunteer');
const Event = require('./models/Event');
const Match = require('./models/Match');

jest.mock('./models/Volunteer');
jest.mock('./models/Event');
jest.mock('./models/Match');

describe("Volunteer Matching", () => {
    beforeEach(() => {
        jest.clearAllMocks(); 
    });

    test("Returns 'Volunteer not found' if volunteer is not found", async () => {
        Volunteer.findById.mockResolvedValue(null);  // No volunteer found

        const result = await matchVolunteer("vol123", "Event A");
        expect(result.success).toBe(false);
        expect(result.message).toBe("Volunteer not found");
    });

    test("Fails if event is not found", async () => {
        Volunteer.findById.mockResolvedValue({ 
            _id: "vol123", 
            name: "John", 
            skills: ["Leadership"] 
        });
        Event.findOne.mockResolvedValue(null);  

        const result = await matchVolunteer("vol123", "Event A");
        expect(result.success).toBe(false);
        expect(result.message).toBe("Event not found");
    });

    test("Fails if volunteer does not have required skills", async () => {
        Volunteer.findById.mockResolvedValue({ 
            _id: "vol123", 
            name: "John", 
            skills: ["Cooking"] });
        Event.findOne.mockResolvedValue({ 
            _id: "evt456", 
            name: "Event A", 
            skills: ["First Aid"] });

        const result = await matchVolunteer("vol123", "Event A");
        expect(result.success).toBe(false);
        expect(result.message).toBe("Volunteer doesn't have required skills for this event");
    });

    test("Matches a volunteer to an event based on skills", async () => {
        const mockVolunteer = { 
            _id: "vol123", 
            name: "John", 
            skills: ["First Aid", "Cooking"] 
        };
        const mockEvent = { 
            _id: "evt456", 
            name: "Event A", 
            skills: ["First Aid"] 
        };
        const mockMatch = {
            _id: "match789",
            volunteerId: "vol123",
            eventId: "evt456",
            dateMatched: new Date(),
            save: jest.fn().mockResolvedValue(true)
        };
        Volunteer.findById.mockResolvedValue(mockVolunteer);
        Event.findOne.mockResolvedValue(mockEvent);
        Match.mockImplementation(() => mockMatch);

        const result = await matchVolunteer("vol123", "Event A");

        expect(result.success).toBe(true);
        expect(result.message).toBe("Volunteer matched successfully");
        expect(result.match.volunteerId).toBe(mockVolunteer._id);
        expect(result.match.eventId).toBe(mockEvent._id);
        expect(result.match.volunteerName).toBe(mockVolunteer.name);
        expect(result.match.eventName).toBe(mockEvent.name);
        expect(Match).toHaveBeenCalledWith({
            volunteerId: mockVolunteer._id,
            eventId: mockEvent._id,
            dateMatched: expect.any(Date),
            confirmed: false
        });
        expect(mockMatch.save).toHaveBeenCalled();
    });

    test("Handles server/database error", async () => {
        Volunteer.findById.mockRejectedValue(new Error("DB failure"));

        const result = await matchVolunteer("vol123", "Event A");
        expect(result.success).toBe(false);
        expect(result.message).toBe("Server error during matching");
    });
});

