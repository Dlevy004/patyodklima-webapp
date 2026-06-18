const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// testing endpoint
app.get('/', (req, res) => {
  res.json({ message: 'Hello World!' });
});

//server start
app.listen(PORT, () => {
  console.log(`The server started at http://localhost:${PORT}.`);
});