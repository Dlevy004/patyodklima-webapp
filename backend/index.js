require('@dotenvx/dotenvx').config();

const express = require('express');
const cors = require('cors');
const routes = require('./routes/index');
const helmet = require('helmet');
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
app.use(helmet());

// Routes
// Health check
app.get('/api/health', (req, res) => {
    res.status(200).send('OK');
});

app.use('/api', routes);

// 404 - Not found route
app.use((req, res) => {
    res.status(404).json({ message: 'Not found' });
});

// global error handling
app.use((err, req, res, next) => {
    console.error(err);
    res.status(err.status || 500).json({ message: err.message || 'Internal server error' });
});

//Server start
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`The server started at http://localhost:${PORT}.`);
    });
}

module.exports = app;