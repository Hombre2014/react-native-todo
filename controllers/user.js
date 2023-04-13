const jwt = require('jsonwebtoken');
const User = require('../models/user');
const sharp = require('sharp');
const cloudinary = require('../helper/imageUpload');

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

exports.userSignIn = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) return res.json({
    success: false,
    message: 'User not found with the given email!',
  });

  const isMatch = await user.comparePassword(password)
  if (!isMatch) return res.json({
    success: false,
    message: 'Email/Password does not match',
  });

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

  res.json({ success: true, user, token });
};

exports.uploadProfile = async (req, res) => {
  const { user } = req;
  if (!user) return res.status(401).json({ success: false, message: 'Unauthorized access!' });
  console.log(req.file);


  try {
    const result = await cloudinary.uploader.upload(req.file.path, {
      public_id: `${user._id}_profile`,
      width: 500,
      height: 500,
      crop: 'fill',
    });
    // const profileBuffer = req.file.buffer;
    // const { width, height } = await sharp(profileBuffer).metadata();
    // const avatar = await sharp(profileBuffer).resize(Math.round(width / 2), Math.round(height / 2)).toBuffer();
    await User.findByIdAndUpdate(user._id, { avatar: result.url });
    res.status(201).json({ success: true, message: 'Profile picture uploaded successfully!' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error! Please, try again later.' });
    console.log(error);
  }
};
