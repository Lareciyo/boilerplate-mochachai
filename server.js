const express = require('express');
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from 'public' (e.g., style.css, client.js)
app.use(express.static('public'));

// Serve the index.html file
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});

// Route #1 (For Functional Test #1 and #2)
app.get('/hello', (req, res) => {
  const name = req.query.name || 'Guest';
  res.json({ greeting: `hello ${name}` });
});

// In-memory data lookup function (The actual 'database' for the app/tests)
const findExplorer = (surname) => {
  const explorers = [
    { surname: 'Colombo', name: 'Cristoforo', dates: '1451 - 1506' },
    { surname: 'da Verrazzano', name: 'Giovanni', dates: '1485 - 1528' },
    { surname: 'Vespucci', name: 'Amerigo', dates: '1454 - 1512' },
  ];
  return explorers.find(e => e.surname === surname);
};


// Route #2: POST /travellers (For Functional Tests with chai-http #3 and #4)
app.post('/travellers', (req, res) => {
  const explorer = findExplorer(req.body.surname);
  setTimeout(() => {
    res.json(explorer || {});
  }, 500); // Simulate network latency
});

// Route #3: PUT /travellers (CRUCIAL FIX: For Zombie.js/client.js functional tests #5 and #6)
app.put('/travellers', (req, res) => {
  const explorer = findExplorer(req.body.surname);
  setTimeout(() => {
    res.json(explorer || { dates: 'N/A' }); 
  }, 500); 
});

module.exports = app; // ✅ export app for testing (without starting the listener!)