const JWT = require('jsonwebtoken');
const config = require('../config');

const UserModel = require('../database/models/user.model');
const { hashString, compareHash } = require('../utils/hashGenerator');

const signUp = async (userInfo) => {
  const { name, email, password } = userInfo;

  const userExists = await UserModel.findOne({ email }).lean();
  if (userExists) return null;

  const hashedPassword = await hashString(password, 10);
  const newUser = new UserModel({
    name,
    email,
    password: hashedPassword,
  });

  const savedUser = await newUser.save();

  return savedUser;
};

const signIn = async ({ email, password }) => {
  const user = await UserModel.findOne({ email }).lean();
  //   user doesn't exist so stop proceeding.
  if (!user) {
    return null;
  }

  const isPasswordRight = await compareHash(password, user.password);

  if (!isPasswordRight) {
    return null;
  }

  return user;
};

const getUser = async (userId) => {
  const user = await UserModel.findOne({ _id: userId }).lean();
  //   user doesn't exist so stop proceeding.
  if (!user) {
    return null;
  }

  return user;
};

const generateAuthToken = (userId, email) => {
  const payload = { id: userId, email };
  return JWT.sign(payload, config.tokenSecret, { expiresIn: '48h' });
};

module.exports = {
  signUp,
  signIn,
  getUser,
  generateAuthToken,
};
