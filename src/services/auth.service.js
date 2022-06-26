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

/**
 * Find a user by email and return the result as a plain JavaScript object.
 * @param email - The email address of the user you want to find.
 */
const findUserByEmail = async (email) => (
  UserModel.findOne({ email }, { password: 0, forgotPassOTP: 0 }).lean()
);

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

  return savedUser;
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

  return user;
};

/**
 * Get a user by their userId.
 * @param userId - The user's id.
 * @returns The user object.
 */
const getUser = async (userId) => {
  const user = await UserModel.findOne({ _id: userId }, { password: 0, forgotPassOTP: 0 }).lean();
  //   user doesn't exist so stop proceeding.
  if (!user) {
    return null;
  }

  return user;
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

  const updatedUser = await UserModel.updateOne(
    { _id: userId, email, createdAt },
    { $set: { isVerified: true } },
  );
  return updatedUser;
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
  findUserByEmail,
  updateUser,
  generateAuthToken,
  generateVerificationToken,
};
