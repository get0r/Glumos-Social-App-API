const Joi = require('joi');

module.exports = {
  objectIdSchema: Joi.string().length(24).required(),
  reqStringSchema: Joi.string().required(),
};
