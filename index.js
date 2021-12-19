const express = require('express');
const mongoose = require('mongoose');
const todoHandler = require('./routeHandler/todoHandler');

const app = express();

app.use(express.json());

// database connection with mongoose
mongoose.connect('mongodb://localhost/todos')
    .then(() => console.log('connection successful'))
    .catch(err => console.log(err));

// application routes
app.use('/todo', todoHandler);

// default error handler
function errorHandler(err, req, res, next) {
    if (res.headerSent) {
        return next(err);
    } else {
        res.status(500).send({ error: err });
    }
}

app.listen(3000, () => {
    console.log('Listening to port 3000');
})