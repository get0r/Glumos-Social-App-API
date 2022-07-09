const Joi = require('joi');

module.exports = {
  profileUpdateSchema: Joi.object({
    fullName: Joi.string().min(3).max(255).regex(/^[A-za-z\s]+$/),
    title: Joi.string().min(3),
    bio: Joi.string().min(3),
  }).min(1).required().options({ stripUnknown: true }),
};
