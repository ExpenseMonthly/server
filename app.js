if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
    require('dotenv').config();
}

const express = require('express'),
    mongoose = require('mongoose'),
    cors = require('cors'),
    axios = require('axios'),
    routes = require('./routes'),
    PORT = process.env.PORT || 3000,
    errorHandler = require('./middleware/errorHandler'),
    MONGO_CONNECTION = process.env.MONGO_CONNECTION,
    app = express()

let testing = (process.env.NODE_ENV === 'test') ? '-test' : '';
mongoose.connect(MONGO_CONNECTION + testing, { useNewUrlParser: true, useUnifiedTopology: true }, function (err) {
    if (err) console.log('Database connection failed')
    else console.log('Database connection success')
});

app.use(cors())
    .use(express.json())
    .use(express.urlencoded({ extended: false }))

app.use('/', routes);

app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`App running on port ${PORT}`);
});

module.exports = app