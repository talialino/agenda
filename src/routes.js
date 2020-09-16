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

  const selectConflict = reading.findIndex(
    (position) => position.data === data && position.horario === horario
  );

  try {
    if (reading[selectConflict]) {
      return res.status(409).send({ Error: 'Hour existing in day' });
    }
    const id = Math.random().toString(32).substr(2, 5);

    reading.push({ id, prova, data, horario, local });

    writeFile(reading);
    return res.status(201).send({ id, prova, data, horario, local });
  } catch (err) {
    res.status(404).send(err, 'Not created');
  }
});

routes.put('/modify/:id', (req, res) => {
  const { id } = req.params;
  const { prova, data, horario, local } = req.body;
  const reading = readFile();

  try {
    const selectId = reading.findIndex((position) => position.id === id);

    const {
      id: rId,
      prova: rProva,
      data: rData,
      horario: rHorario,
      local: rLocal,
    } = reading[selectId];

    const newObject = {
      id: rId,
      prova: prova || rProva,
      data: data || rData,
      horario: horario || rHorario,
      local: local || rLocal,
    };

    reading[selectId] = newObject;
    writeFile(reading);
    res.status(200).send('Sucessfull!');
  } catch (err) {
    res.status(304).send(err, 'Not modified');
  }
});

routes.get('/view', (req, res) => {
  const reading = readFile();
  try {
    res.status(302).send(reading);
  } catch (err) {
    res.status(404).send(err, 'Not viewed');
  }
});

routes.delete('/delete/:id', (req, res) => {
  const { id } = req.params;
  const reading = readFile();
  const selectId = reading.findIndex((position) => position.id === id);

  reading.splice(selectId, 1);

  writeFile(reading);
  try {
    res.status(200).send('Deleted with sucessfull!');
  } catch (err) {
    res.status(404).send(err, 'Not deleted');
  }
});

module.exports = routes;
