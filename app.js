const express = require('express');

const app = express();

app.get('/', (req, res) => {
  res.send('<h1 style="color: red">Hello World!</h1>');
});

app.listen(8000, () => {
  console.log('Server is running on port 8000');
});

