const app = require('./app');

const PORT = Number(process.env.PORT) || 3000;

app.listen(PORT, () => {
    console.log(`The server started at http://localhost:${PORT}.`);
});