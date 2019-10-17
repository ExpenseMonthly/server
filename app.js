if (process.env.NODE_ENV === 'development') {
    require('dotenv').config();
}

const express = require('express'),
      mongoose = require('mongoose'),
      cors = require('cors'),
      axios = require('axios'),
      routes = require('./routes'),
      PORT = process.env.PORT || 3000,
      errorHandler = require('./middlewares/errorHandler'),
      MONGO_CONNECTION = process.env.MONGO_CONNECTION,
      app = express()

mongoose.connect(MONGO_CONNECTION, { useNewUrlParser: true, useUnifiedTopology: true }, function(err) {
  if(err) console.log('Database connection failed')
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