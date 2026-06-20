const express = require('express');
const cors = require('cors');
require('dotenv').config();

const routes = require('./routes/index');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Hello World!' });
});

app.use('/api', routes);

//server start
app.listen(process.env.PORT, () => {
  console.log(`The server started at http://localhost:${process.env.PORT}.`);
});

module.exports = app;