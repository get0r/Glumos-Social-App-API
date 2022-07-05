const JWT = require('jsonwebtoken');
const _ = require('lodash');
const { tokenSecret } = require('../config');
const { hashString, compareHash } = require('../utils/hashGenerator');

const config = require('../config');
const UserModel = require('../database/models/user.model');

const generateToken = (userId, secret, options) => {
  const payload = { id: userId };
  return JWT.sign(payload, secret, options);
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

/**
 * Find a user by their email address.
 * @param email - The email address of the user you want to find.
 */
const findUserByEmail = async (email) => UserModel.findOne({ email }).lean();

/**
 * Get a user by their refresh token.
 * @param refreshToken - The refresh token that was sent to the client.
 */
const getUserByToken = async (refreshToken) => {
  const user = await UserModel.findOne({ refreshToken }).lean();
  if (!user) return null;
  return _.omit(user, ['password', 'refreshToken', '__v', 'forgotPassOTP', 'refreshToken']);
};
/**
 * It takes in a user's information, checks if the email already exists,
 * hashes the password, creates a
 * new user, and saves the user to the database
 * @param userInfo - an object containing the user's full name, title, bio, email, and password.
 * @returns The user object
 */
const signUp = async (userInfo) => {
  const {
    fullName, title, bio, email, password,
  } = userInfo;

  const emailExists = await findUserByEmail(email);
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

  return _.omit(savedUser, ['password', 'refreshToken', '__v', 'forgotPassOTP']);
};

/**
 * It takes an email and password, finds the user in the database, compares the password with the
 * hashed password in the database, and returns the user if the password is correct
 * @returns The user object.
 */
const signIn = async ({ email, password }) => {
  const user = await findUserByEmail(email);
  //   user doesn't exist so stop proceeding.
  if (!user) { return null; }

  const isPasswordRight = await compareHash(password, user.password);

  if (!isPasswordRight) { return null; }

  return _.omit(user, ['password', 'refreshToken', '__v', 'forgotPassOTP']);
};

/**
 * Get a user by their userId.
 * @param userId - The user's id.
 * @returns The user object.
 */
const getUser = async (userId) => {
  const user = await UserModel.findOne({ _id: userId }).lean();
  //   user doesn't exist so stop proceeding.
  if (!user) {
    return null;
  }

  return _.omit(user, ['password', 'refreshToken', '__v', 'forgotPassOTP']);
};

/**
 * It finds a user by their userId, email, and createdAt, and if it finds one, it updates the user's
 * isVerified field to true
 * @param userId - The user's id
 * @param email - The email address of the user.
 * @param createdAt - The date the user was created.
 * @returns The updated user
 */
const verifyUser = async (userId, email, createdAt) => {
  const user = await UserModel.findOne({ _id: userId, email, createdAt }).lean();
  if (!user) return null;

  const isUpdated = await UserModel.updateOne(
    { _id: userId, email, createdAt },
    { $set: { isVerified: true } },
  );
  return isUpdated;
};

const updateUser = async (userId, updatedObject) => {
  const user = await getUser(userId);
  if (!user) return null;

  const newUserObject = { ...user, ...updatedObject };
  return UserModel.updateOne({ _id: userId }, newUserObject);
};

module.exports = {
  signUp,
  signIn,
  verifyUser,
  verifyJWToken,
  getUser,
  getUserByToken,
  findUserByEmail,
  updateUser,
  generateToken,
  generateVerificationToken,
};
