const express = require('express');
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes here...
app.get('/hello', (req, res) => {
  const name = req.query.name || 'Guest';
  res.json({ greeting: `hello ${name}` });
});
app.post('/travellers', (req, res) => {
  const explorers = [
    { surname: 'Colombo', name: 'Cristoforo' },
    { surname: 'da Verrazzano', name: 'Giovanni' },
    { surname: 'Vespucci', name: 'Amerigo' },
  ];
  const explorer = explorers.find(e => e.surname === req.body.surname);
  res.json(explorer || {});
});

module.exports = app; // ✅ export app for testing
