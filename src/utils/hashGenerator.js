const bcrypt = require('bcrypt');
const ApiError = require('../helpers/error/ApiError');

/**
 * It takes a string and returns a hash of that string
 * @param str - The string to be hashed.
 * @param [saltRounds=10] - The number of rounds to process the data for. The more rounds, the more
 * secure, but the slower. The default is 10.
 * @returns A promise that resolves to a string.
 */
const hashString = async (str, saltRounds = 10) => {
  try {
    const salt = await bcrypt.genSalt(saltRounds);

    return await bcrypt.hash(str, salt); // password hash
  } catch (e) {
    throw new ApiError(e.message);
  }
};

/**
 * It takes a string and a hash, and returns true if the string matches the hash
 * @param newStr - The string you want to compare to the hash.
 * @param hash - The hash to compare the new string to.
 * @returns A promise that resolves to a boolean.
 */
const compareHash = async (newStr, hash) => {
  try {
    return await bcrypt.compare(newStr, hash);
  } catch (e) {
    throw new ApiError(e.message);
  }
};

module.exports = {
  hashString,
  compareHash,
};
