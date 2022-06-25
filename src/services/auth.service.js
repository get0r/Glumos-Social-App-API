const JWT = require('jsonwebtoken');
const { tokenSecret } = require('../config');

const config = require('../config');

const UserModel = require('../database/models/user.model');
const { hashString, compareHash } = require('../utils/hashGenerator');

const generateAuthToken = (userId, email) => {
  const payload = { id: userId, email };
  return JWT.sign(payload, config.tokenSecret, { expiresIn: '48h' });
};

const generateVerificationToken = (userId, email, createdAt) => {
  const payload = { id: userId, email, createdAt };
  return JWT.sign(payload, config.tokenSecret, { expiresIn: '30d' });
};

const verifyJWToken = async (token) => {
  const verifiedObject = await JWT.verify(token, tokenSecret);
  if (!verifiedObject) return null;
  return verifiedObject;
};

const signUp = async (userInfo) => {
  const {
    fullName, title, bio, email, password,
  } = userInfo;

  const emailExists = await UserModel.findOne({ email }).lean();
  if (emailExists) return null;

  const hashedPassword = await hashString(password, 10);
  const newUser = new UserModel({
    fullName,
    title,
    bio,
    email,
    password: hashedPassword,
  });

  const savedUser = await newUser.save();

  return savedUser;
};

const signIn = async ({ email, password }) => {
  const user = await UserModel.findOne({ email }).lean();
  //   user doesn't exist so stop proceeding.
  if (!user) { return null; }

  const isPasswordRight = await compareHash(password, user.password);

  if (!isPasswordRight) { return null; }

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

const verifyUser = async (userId, email, createdAt) => {
  const updatedUser = await UserModel.updateOne(
    { _id: userId, email, createdAt },
    { $set: { isVerified: true } },
  );
  return updatedUser;
};

module.exports = {
  signUp,
  signIn,
  verifyUser,
  verifyJWToken,
  getUser,
  generateAuthToken,
  generateVerificationToken,
};
