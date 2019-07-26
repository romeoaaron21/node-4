const express = require('express');
const massive = require('massive');
const users = require('../controllers/users')

const jwt = require('jsonwebtoken');
const secret = require('../secret');

massive({
    host: 'localhost',
    port: 5432,
    database: 'node4db',
    user: 'postgres',
    password: 'node4db',
})
.then(db => {
    const PORT = 3002;
    const app = express();

    app.set('db', db);
    app.use(express.json());

    app.listen(PORT, () => {
        console.log(`Running on port ${PORT}`)
    })

    app.post('/api/register', users.register)
    app.get('/api/protected/data', function(req, res) {
        if(!req.headers.authorization) {
            return res.status(401).end();
        }
        try{
            const token = req.headers.authorization.split(' ')[1];
            jwt.verify(token, secret);
            res.status(200).json({ data: 'here is the protexted data' });
        } catch(err) {
            console.error(err);
            res.status(401).end();
        }
    });
    app.post('/api/login', users.login);
})

