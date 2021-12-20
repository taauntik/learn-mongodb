const express = require('express');
const mongoose = require('mongoose');
const todoHandler = require('./routeHandler/todoHandler');
const userHandler = require('./routeHandler/userHandler');
require('dotenv').config();

const app = express();

app.use(express.json());

// database connection with mongoose
mongoose.connect('mongodb://localhost/todos')
    .then(() => console.log('connection successful'))
    .catch(err => console.log(err));

// application routes
app.use('/todo', todoHandler);
app.use('/user', userHandler);

// default error handler
const errorHandler = (err, req, res, next) => {
    console.log(err);
    if (res.headerSent) {
        return next(err);
    } else {
        res.status(500).send({ error: err });
    }
}

app.use(errorHandler);

app.listen(3000, () => {
    console.log('Listening to port 3000');
})