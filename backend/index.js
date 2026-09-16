require('@dotenvx/dotenvx').config();

const express = require('express');
const cors = require('cors');
const routes = require('./routes/index');
const PORT = process.env.PORT || 3000;

const app = express();

const allowedOrigins = [
    process.env.FRONTEND_URL,
    'http://localhost:5173'
].filter(Boolean);

const corsOptions = {
    origin(origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    }
};

// Middlewares
app.use(cors(corsOptions));
app.use(express.json());
app.set('trust proxy', 1);

// Routes
// Health check
app.get('/api/health', (req, res) => {
    res.status(200).send('OK');
});

app.use('/api', routes);

//Server start
app.listen(process.env.PORT, () => {
  console.log(`The server started at http://localhost:${process.env.PORT}.`);
});

module.exports = app;