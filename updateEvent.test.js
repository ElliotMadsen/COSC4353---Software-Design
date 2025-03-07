const { updateEvent } = require("./updateEvent");

describe("Update Event", () => {
    let events;
    beforeEach(() => {
        events = [
            { id: 100, name: "Beach Cleanup", requiredSkills: ["Leadership", "Time Management"], description: "Clean the beach", location: "Beach" },
            { id: 101, name: "Charity Auction", requiredSkills: ["Fundraising", "Data-Entry"], description: "Help with auction", location: "Community Center" }
        ];
    });

    test("Updates an event successfully", async () => {
        const updatedData = {
            name: "Beach Cleanup 2025",
            requiredSkills: ["Leadership"],
            description: "Join us for a beach cleanup to beautify our beaches."
        };
        const result = updateEvent(events, 100, updatedData);
        expect(result.success).toBe(true);
        expect(result.updatedEvent.name).toBe("Beach Cleanup 2025");
        expect(result.updatedEvent.requiredSkills).toEqual(["Leadership"]);
        expect(result.updatedEvent.description).toBe("Join us for a beach cleanup to beautify our beaches.");
    });

    test("Returns an error if the event is not found", async () => {
        const updatedData = {
            name: "Non-Existent Event",
            requiredSkills: ["Leadership"],
            description: "This event doesn't exist."
        };
        const result = updateEvent(events, 999, updatedData);
        expect(result.success).toBe(false);
        expect(result.message).toBe("Event not found");
    });

    test("Returns a validation error if the name is too short", async () => {
        const updatedData = {
            name: "AB", // Invalid name
            requiredSkills: ["Leadership"],
            description: "Invalid event name"
        };

        const result = updateEvent(events, 100, updatedData);
        expect(result.success).toBe(false);
        expect(result.message).toBe("Event Name must be at least 3 characters");
    });

    test("Should handle empty update and leave event unchanged", () => {
        const result = updateEvent(events, 100, {});
        expect(result.success).toBe(true);
        expect(result.updatedEvent.name).toBe("Beach Cleanup");
        expect(result.updatedEvent.requiredSkills).toEqual(["Leadership", "Time Management"]);
    });


});
