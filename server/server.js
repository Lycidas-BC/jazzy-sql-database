const express = require('express');
const bodyParser = require('body-parser');
const pg = require('pg');

// Setup PG to connect to the database
const Pool = pg.Pool;
const pool = new Pool({
    database: 'jazzy_sql',
    host: 'localhost',
    port: 5432,
    max: 10,
    idleTimeoutMillis: 30000
});

const app = express();
const PORT = 5000;

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('server/public'));

app.listen(PORT, () => {
    console.log('listening on port', PORT)
});

app.get('/artist', (req, res) => {
    console.log(`In /artist GET`);
    let queryText = 'SELECT "name", "birthdate" FROM artist ORDER BY "birthdate" DESC;';
    pool.query(queryText)
        .then((result) => {
            res.send(result.rows);
        })
        .catch((err) => {
            console.log(`Error making query ${queryText}`, err);
            res.sendStatus(500);
        });
});

app.post('/artist', (req, res) => {
    const newArtist= req.body;
    const queryText = `INSERT INTO artist ("name", "birthdate")
        VALUES ($1, $2);`;
    pool.query(queryText, [newArtist.name, newArtist.birthdate])
        .then((result) => {
            res.sendStatus(201);
        })
        .catch((err) => {
            console.log(`Error making query ${queryText}`, err);
            res.sendStatus(500);
        });
});

app.get('/song', (req, res) => {
    console.log(`In /songs GET`);
    let queryText = 'SELECT "title", "length", "released" FROM song ORDER BY "title" ASC;';
    pool.query(queryText)
        .then((result) => {
            res.send(result.rows);
        })
        .catch((err) => {
            console.log(`Error making query ${queryText}`, err);
            res.send
        });
});

app.post('/song', (req, res) => {
    const newSong = req.body;
    const queryText = `INSERT INTO songs ("title", "length", "released")
        VALUES ($1, $2, $3);`;
    pool.query(queryText, [newSong.title, newSong.length, newSong.released])
        .then((result) => {
            res.sendStatus(201);
        })
        .catch((err) => {
            console.log(`Error making query ${queryText}`, err);
            res.sendStatus(500);
        });
});


