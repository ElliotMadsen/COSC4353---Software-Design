const { matchVolunteer } = require('./eventMatching');

describe("Volunteer Matching", () => {
    const volunteers = [
        { id: 1, name: "Jane Doe", skills: ["Leadership", "Mentoring"] },
        { id: 2, name: "John Doe", skills: ["Fundraising", "Data-Entry"] }
    ];

    const events = [
        { id: 100, name: "Beach Cleanup", requiredSkills: ["Leadership", "Time Management"] },
        { id: 101, name: "Charity Auction", requiredSkills: ["Fundraising", "Data-Entry"] }
    ];

    test("Matches a volunteer to an event based on skills", async () => {
        expect(matchVolunteer(volunteers, events, 1)).toEqual({
            success: true,
            matchedEvents: [
                { id: 100, name: "Beach Cleanup", requiredSkills: ["Leadership", "Time Management"] }
            ]
        });
    });

    test("Returns 'No match found' when there is no match", async () => {
        expect(matchVolunteer(volunteers, events, 3)).toEqual({
            success: false,
            message: "Volunteer not found"
        });
    });

    test("Returns 'Volunteer not found' if volunteer is not found", async () => {
        const volunteer = { id: 3, name: "Jack Smith", skills: ["Cooking"] };
        expect(matchVolunteer([volunteer], events, 3)).toEqual({
            success: false,
            message: "No matching events found for the volunteer"
        });
    });
});

