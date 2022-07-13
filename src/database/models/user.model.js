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

    searchName: String,

    searchTitle: String,

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
      minlength: 3,
    },

    website: String,
    isVerified: {
      type: Boolean,
      default: false,
    },

    forgotPassOTP: {
      type: String,
      expires: 30,
    },

    refreshToken: String,

  },
  {
    timestamps: true,
  },
);

userSchema.index({ searchName: 'text', searchTitle: 'text' });

const UserModel = mongoose.model('User', userSchema);

module.exports = UserModel;
