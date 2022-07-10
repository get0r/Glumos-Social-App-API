const Joi = require('joi');

module.exports = {
  objectIdSchema: Joi.string().length(24).required(),
  reqStringSchema: Joi.string().required(),
  postSchema: Joi.object({
    detail: Joi.string().min(3).required(),
  }, { }).options({ stripUnknown: true, allowUnknown: false }),
};
