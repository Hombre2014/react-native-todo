const express = require('express');
require('dotenv').config();
require('./models/db');

const app = express();
const User = require('./models/user');

const email = 'john@email.com';

app.post('/create-user', async (req, res) => {
  const isNewUser = await User.isThisEmailInUse(email);
  if (!isNewUser) return res.json({
    success: false,
    message: 'This email is already in use!',
  });

  const user = await User({
    fullName: 'John Doe',
    email: email,
    password: '123456',
  });
  await user.save();
  res.json(user);
});

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.listen(8000, () => {
  console.log('Server is running on port 8000');
});
