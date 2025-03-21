// server.js
const app = require('./backend/backend');
app.listen(3000, () => {
    console.log('Backend server running on http://localhost:3000');
});