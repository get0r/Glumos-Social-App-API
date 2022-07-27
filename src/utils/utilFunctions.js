const crypto = require('crypto');

module.exports = {
  generateOTPDigit: () => Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000,
  generateRandomChars: (bytes = 16) => crypto.randomBytes(bytes).toString('hex'),
  createEdgeNGrams: (str) => {
    if (str && str.length > 3) {
      const minGram = 3;
      const maxGram = str.length;

      return str.split(' ').reduce((ngrams, token) => {
        let acc = ngrams;
        if (token.length > minGram) {
          for (let i = minGram; i <= maxGram && i <= token.length; ++i) {
            acc = [...acc, token.substr(0, i)];
          }
        } else {
          acc = [...acc, token];
        }
        return acc;
      }, []).join(' ');
    }

    return str;
  },

};
