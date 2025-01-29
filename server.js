const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const eventsFilePath = path.join(__dirname, 'conteudos', 'events.json');

// Endpoint to get events
app.get('/events', (req, res) => {
    fs.readFile(eventsFilePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Error reading events file');
        }
        res.json(JSON.parse(data));
    });
});

// Endpoint to save events
app.post('/events', (req, res) => {
    const events = req.body;
    fs.writeFile(eventsFilePath, JSON.stringify(events, null, 2), 'utf8', (err) => {
        if (err) {
            return res.status(500).send('Error writing to events file');
        }
        res.send('Events saved successfully');
    });
});

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});