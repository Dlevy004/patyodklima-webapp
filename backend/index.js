const express = require('express');
const cors = require('cors');
const routes = require('./routes/index');

require('@dotenvx/dotenvx').config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

app.set('trust proxy', 1);

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Hello World!' });
});

// Health
app.get('/api/health', (req, res) => {
    res.status(200).send('OK');
});

app.use('/api', routes);

//server start
app.listen(process.env.PORT, () => {
  console.log(`The server started at http://localhost:${process.env.PORT}.`);
});

module.exports = app;