const User = require('../models/user');

exports.createUser = async (req, res) => {
  const { fullName, email, password } = req.body;
  const isNewUser = await User.isThisEmailInUse(email);
  if (!isNewUser) return res.json({
    success: false,
    message: 'This email is already in use!',
  });

  const user = await User({
    fullName,
    email,
    password,
  });
  await user.save();
  res.json(user);
};
