const helmet = require('helmet');
const Joi = require('@hapi/joi');
const logger = require('./logger');
const express = require('express');
const morgan = require('morgan');
const app = express();

console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
console.log(`app: ${app.get('env')}`);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(helmet());
app.use(morgan());

app.use(logger);

const genres = [
  { id: 1, name: 'Drama' },
  { id: 2, name: 'Comedy' },
  { id: 3, name: 'Thriller' },
  { id: 4, name: 'Horror' }
];

app.get('/', (req, res) => {
  res.sendFile('index.html', { root: __dirname });
});

app.get('/api/genres', (req, res) => {
  res.send(genres);
});

app.get('/api/genres/:id', (req, res) => {
  const genre = genres.find(g => g.id === parseInt(req.params.id));

  if (!genre) {
    return res.status(404).send('The genre with the given ID was not found.');
  } else {
    return res.send(genre);
  }
});

app.post('/api/genres', (req, res) => {
  const { error } = validateGenre(req.body); // result.error

  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  const genre = {
    id: genres.length + 1,
    name: req.body.name
  };

  genres.push(genre);
  res.send(genre);
});

app.put('/api/genres/:id', (req, res) => {
  const genre = genres.find(g => g.id === parseInt(req.params.id));

  if (!genre) {
    return res.status(404).send('The genre with the given ID was not found.');
  }

  const { error } = validateGenre(req.body); // result.error

  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  genre.name = req.body.name;

  res.send(genre);
});

app.delete('/api/genres/:id', (req, res) => {
  const genre = genres.find(g => g.id === parseInt(req.params.id));

  if (!genre) {
    return res.status(404).send('The genre with the given ID was not found.');
  }

  const index = genres.indexOf(genre);
  genres.splice(index, 1);

  res.send(genre);
});

function validateGenre(genre) {
  const schema = {
    name: Joi.string()
      .min(3)
      .required()
  };

  return Joi.validate(genre, schema);
}

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});
