const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  avatar: Buffer,
});

userSchema.statics.isThisEmailInUse = async function (email) {
  if (!email) throw new Error('Email is required');
  try {
    const user = await this.findOne({ email });
    if (user) return false;
    return true;
  } catch (error) {
    console.log('Error while saving user with the same email. ', error.message);
    return false;
  }
};

module.exports = mongoose.model('User', userSchema);
