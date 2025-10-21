'use strict';
const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files and index
app.use(express.static(__dirname + '/public'));
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});

// In-memory data for explorers
const explorers = [
  { surname: 'Colombo', name: 'Cristoforo', dates: '1451 - 1506' },
  { surname: 'da Verrazzano', name: 'Giovanni', dates: '1485 - 1528' },
  { surname: 'Vespucci', name: 'Amerigo', dates: '1454 - 1512' },
  { surname: 'Polo', name: 'Marco', dates: '1254 - 1324' },
];

// GET /hello endpoint
app.get('/hello', (req, res) => {
  const name = req.query.name || 'Guest';
  res.json({ greeting: `hello ${name}` });
});

// POST /travellers endpoint
app.post('/travellers', (req, res) => {
  const surname = req.body.surname;
  if (!surname) return res.json({ name: 'unknown' });

  const explorer = explorers.find(
    e => e.surname.toLowerCase() === surname.toLowerCase()
  );

  if (explorer) return res.json(explorer);
  return res.json({ name: 'unknown' });
});

// PUT /travellers endpoint for the front-end form
app.put('/travellers', (req, res) => {
  const surname = req.body.surname;
  if (!surname) return res.json({ name: 'unknown' });

  const explorer = explorers.find(
    e => e.surname.toLowerCase() === surname.toLowerCase()
  );

  if (explorer) return res.json(explorer);
  return res.json({ name: 'unknown' });
});

// Start server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

module.exports = app;
