const startupDebugger = require('debug')('app:startup');
const dbDebugger = require('debug')('app:db');
// or debug(); instead of console.log();
// const debug = require('debug')('app:startup'):
const config = require('config');
const helmet = require('helmet');
const logger = require('./middleware/logger');
const genres = require('./routes/genres');
const home = require('./routes/home');
const about = require('./routes/about');
const morgan = require('morgan');
const express = require('express');
const app = express();

app.set('view engine', 'pug');
app.set('views', './views'); // default

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(helmet());
app.use('/api/genres', genres);
app.use('/', home);
app.use('/', about);

// Configuration
console.log(`Application name: ${config.get('name')}`);
console.log(`Mail server: ${config.get('mail.host')}`);
console.log(`Mail password: ${config.get('mail.password')}`);

if (app.get('env') === 'development') {
  app.use(morgan('tiny'));
  startupDebugger('Morgan enabled...');
}

// Db work...
dbDebugger('Connected to the database...');

app.use(logger);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});
