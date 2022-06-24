const mongoose = require('mongoose');

/* Creating a schema for the user model. */
const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      trim: true,
      required: true,
      minlength: 3,
      maxlength: 255,
    },

    title: {
      type: String,
      trim: true,
      required: true,
      minlength: 3,
      maxlength: 255,
    },

    ppLink: String,

    email: {
      type: String,
      trim: true,
      required: true,
      minlength: 3,
      maxlength: 100,
    },

    password: {
      type: String,
      required: true,
      minlength: 8,
      maxlength: 255,
    },

    bio: {
      type: String,
      trim: true,
      required: true,
      minlength: 3,
      maxlength: 255,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

const UserModel = mongoose.model('User', userSchema);

module.exports = UserModel;
