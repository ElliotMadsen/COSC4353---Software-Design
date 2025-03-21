const { updateEvent } = require("./updateEvent");
const Event = require('./models/Event');

jest.mock('./models/Event');

describe("Update Event Function", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    test("Updates an event successfully", async () => {
        const updatedData = {
            _id: "event123",
            name: "Updated Event",
            location: "Updated Location",
            description: "Updated Description",
            skills: ["Skill1", "Skill2"],
            urgency: "High"
        };
        Event.findByIdAndUpdate.mockResolvedValue(mockEvent);

        const result = await updateEvent("event123", {
            name: "Updated Event",
            location: "Updated Location",
            description: "Updated Description",
            skills: ["Skill1", "Skill2"],
            urgency: "High"
        });

        expect(Event.findByIdAndUpdate).toHaveBeenCalledWith(
            "event123",
            expect.any(Object),
            { new: true, runValidators: true }
        );

        expect(result.success).toBe(true);
        expect(result.message).toBe("Event updated successfully");
        expect(result.event).toEqual(mockEvent);
    });

    test("Returns an error if the event is not found", async () => {
        Event.findByIdAndUpdate.mockResolvedValue(null);
        const result = await updateEvent("event123", { name: "Valid Name" });
        expect(result.success).toBe(false);
        expect(result.message).toBe("Event not found");
    });

    test("Returns a validation error if the name is too short", async () => {
        const result = await updateEvent("event123", { name: "ab" });
        expect(result.success).toBe(false);
        expect(result.message).toBe("Event Name must be at least 3 characters and a string");

        const result2 = await updateEvent("event123", { name: 123 });
        expect(result2.success).toBe(false);
        expect(result2.message).toBe("Event Name must be at least 3 characters and a string");
    });

    test("Fails if location is not a string", async () => {
        const result = await updateEvent("event123", { location: 456 });
        expect(result.success).toBe(false);
        expect(result.message).toBe("Location must be a string");
    });

    test("Fails if description is not a string", async () => {
        const result = await updateEvent("event123", { description: {} });
        expect(result.success).toBe(false);
        expect(result.message).toBe("Description must be a string");
    });

    test("Fails if skills is not an array or has non-string elements", async () => {
        const result1 = await updateEvent("event123", { skills: "not-an-array" });
        expect(result1.success).toBe(false);
        expect(result1.message).toBe("Skills must be a non-empty array of strings");

        const result2 = await updateEvent("event123", { skills: [] });
        expect(result2.success).toBe(false);
        expect(result2.message).toBe("Skills must be a non-empty array of strings");

        const result3 = await updateEvent("event123", { skills: ["Valid", 123] });
        expect(result3.success).toBe(false);
        expect(result3.message).toBe("Skills must be a non-empty array of strings");
    });

    test("Fails if urgency is invalid", async () => {
        const result = await updateEvent("event123", { urgency: "Critical" });
        expect(result.success).toBe(false);
        expect(result.message).toBe("Urgency must be 'Low', 'Medium', or 'High'");
    });

    test("Should handle empty update and leave event unchanged", () => {
        const result = updateEvent(events, 100, {});
        expect(result.success).toBe(true);
        expect(result.updatedEvent.name).toBe("Beach Cleanup");
        expect(result.updatedEvent.requiredSkills).toEqual(["Leadership", "Time Management"]);
    });

    test("Handles server/database error", async () => {
        Event.findByIdAndUpdate.mockRejectedValue(new Error("Database error"));

        const result = await updateEvent("event123", { name: "Valid Name" });
        expect(result.success).toBe(false);
        expect(result.message).toBe("Server error during update");
    });

});
