const express = require('express');
const router = express.Router();

const { createUser, userSignIn } = require('../controllers/user');
const {
  validateUserSignUp,
  userValidation,
  validateUserSignIn,
} = require('../middleware/validation/user');

const User = require('../models/user');

const { isAuth } = require('../middleware/auth');

const multer = require('multer');
const sharp = require('sharp');

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb('Invalid image file', false);
  }
};

const uploads = multer({ storage, fileFilter });

router.post('/create-user', validateUserSignUp, userValidation, createUser);
router.post('/sign-in', validateUserSignIn, userValidation, userSignIn);
router.post('/upload-profile', isAuth, uploads.single('profile'), async (req, res) => {
  const { user } = req;
  if (!user) return res.status(401).json({ success: false, message: 'Unauthorized access!' });

  try {
    const profileBuffer = req.file.buffer;
    const { width, height } = await sharp(profileBuffer).metadata();
    const avatar = await sharp(profileBuffer).resize(Math.round(width / 2), Math.round(height / 2)).toBuffer();
    await User.findByIdAndUpdate(user._id, { avatar });
    res.status(201).json({ success: true, message: 'Profile picture uploaded successfully!' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error! Please, try again later.' });
    console.log(error);
  }
});

module.exports = router;
