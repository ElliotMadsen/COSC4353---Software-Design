const request = require('supertest');
const app = require('./server');

describe('Volunteer Organization API', () => {
    
    it('GET /notifications should return a list of notifications', async () => {
        const response = await request(app).get('/notifications');
        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toBeTruthy();
    });

    it('GET /volunteer-history should return a list of history items', async () => {
        const response = await request(app).get('/volunteer-history');
        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toBeTruthy();
    });

    it('POST /notifications should add a notification', async () => {
        const response = await request(app).post('/notifications').send({ message: "Test notification" });
        expect(response.statusCode).toBe(201);
        expect(response.body).toHaveProperty("message");
    });

    it('POST /notifications should return 400 if message is missing', async () => {
        const response = await request(app).post('/notifications').send({});
        expect(response.statusCode).toBe(400);
    });

    it('POST /notifications should return 400 if message is not a string', async () => {
        const response = await request(app).post('/notifications').send({ message: 12345 });
        expect(response.statusCode).toBe(400);
    });

    it('PUT /volunteer-history/:id should update volunteer status', async () => {
        const response = await request(app).put('/volunteer-history/1').send({ status: "Completed" });
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty("message", "Status updated successfully");
    });

    it('PUT /volunteer-history/:id should return 404 if ID is not found', async () => {
        const response = await request(app).put('/volunteer-history/999').send({ status: "Completed" });
        expect(response.statusCode).toBe(404);
    });

    it('PUT /volunteer-history/:id should return 400 if status is empty', async () => {
        const response = await request(app).put('/volunteer-history/1').send({});
        expect(response.statusCode).toBe(400);
    });

    it('GET /unknown-route should return 404 for unknown endpoints', async () => {
        const response = await request(app).get('/unknown-route');
        expect(response.statusCode).toBe(404);
    });

});
