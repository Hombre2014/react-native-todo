const express = require('express');
require('dotenv').config();

const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true }).then(
  () => { console.log('Database is connected') },
).catch(err => console.log(err.message));

const app = express();

app.get('/', (req, res) => {
  res.send('<h1 style="color: red">Hello World!</h1>');
});

app.listen(8000, () => {
  console.log('Server is running on port 8000');
});

