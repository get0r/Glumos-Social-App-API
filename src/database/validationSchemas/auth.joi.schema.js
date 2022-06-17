const Joi = require('joi');

const schemaOptions = {
  abortEarly: false,
  stripUnknown: true,
};

const nameSchema = Joi.string().min(3).max(255).regex(/^[A-za-z\s]+$/)
  .required();
const usernameSchema = Joi.string().min(3).max(100).regex(/[A-za-z1-9\s]+/)
  .required();
const passwordSchema = Joi.string().min(8).max(255).required();

//  validator for login purpose.
const signInSchema = Joi.object({
  username: usernameSchema,
  password: passwordSchema,
});

const signUpSchema = Joi.object({
  name: nameSchema,
  username: usernameSchema,
  password: passwordSchema,
});

module.exports = {
  schemaOptions,
  signInSchema,
  signUpSchema,
};
