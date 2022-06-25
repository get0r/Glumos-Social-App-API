const Joi = require('joi');

module.exports = {
  objectIdSchema: Joi.string().length(24).required(),
};
