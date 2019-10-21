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
// mongoose.connect(MONGO_CONNECTION + testing, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false }, function (err) {

mongoose.connect(MONGO_CONNECTION + '-test', { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false }, function (err) {
    if (err) console.log('Database connection failed')
    else console.log(`Database connected to : ${MONGO_CONNECTION}${testing}`)
})
// mongoose.connect(MONGO_CONNECTION + testing, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false }, function (err) {
//     if (err) {
//         console.log('Database connection failed'); console.log(err);
//     }
//     else console.log(`Database connected to : ${MONGO_CONNECTION}`)
// });

app.use(cors())
    .use(express.json({limit: Infinity}))
    .use(express.urlencoded({ extended: false, limit: Infinity }))

app.use('/', routes);

app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`🚀 App running on port ${PORT}`);
});

module.exports = app