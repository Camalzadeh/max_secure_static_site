// app.js
const express = require('express');
const app = express();

// Define a simple route
app.get('/', (req, res) => {
    res.send('Hello, Express!');
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
