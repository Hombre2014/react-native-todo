const express = require('express');
require('dotenv').config();
require('./models/db');
const userRouter = require('./routes/user');

const app = express();

// For Reference instead of using app.use(express.json());
// app.use((req, res, next) => {
//   req.on('data', chunk => {
//     const data = JSON.parse(chunk);
//     req.body = data;
//     next();
//   });
// });

const User = require('./models/user');

app.use(express.json());
app.use(userRouter);

const test = async (email, password) => {
  const user = await User.findOne({ email: email });
  // const result = await user.comparePassword(password);
  // console.log(result);
}

test('yuriy15@hombre.com', '123456');

app.get('/test', (req, res) => {
  res.send('Hello World');
});

app.get('/', (req, res) => {
  res.json({ success: true, message: 'Hello World' });
});

app.listen(8000, () => {
  console.log('Server is running on port 8000');
});
