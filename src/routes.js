const express = require('express');

const routes = express.Router();
const fs = require('fs');

const readFile = () => {
  const content = fs.readFileSync('./src/models/agenda.json', 'utf-8');
  return JSON.parse(content);
};

const writeFile = (content) => {
  const updateFile = JSON.stringify(content);
  fs.writeFileSync('./src/models/agenda.json', updateFile, 'utf-8');
};

routes.post('/register', (req, res) => {
  const { prova, data, horario, local } = req.body;

  const reading = readFile();

  const id = reading.length + 1;

  reading.push({ id, prova, data, horario, local });

  writeFile(reading);

  res.send({ id, prova, data, horario, local });
});

module.exports = routes;
