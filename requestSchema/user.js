const joi = require("joi");

const createUserSchema = joi.object({
  name: joi.string().alphanum().min(3).max(30).required(),
  password: joi
    .string()
    .pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)[A-Za-z\d@#$%^&+=_!]{8,}$/)
    .required()
    .messages({
      "string.pattern.base":
        "Password must contain One upper case, One lower case, One Digit and One of this special characters @#$%^&+=_!",
    }),
  email: joi.string().email().min(5).max(50).optional(),
  role: joi.string().required(),
});

const loginUserSchema = joi.object({
  email: joi.string().email().min(5).max(50).optional(),
  password: joi
    .string()
    .pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)[A-Za-z\d@#$%^&+=_!]{8,}$/)
    .required()
    .messages({
      "string.pattern.base":
        "Password must contain One upper case, One lower case, One Digit and One of this special characters @#$%^&+=_!",
    }),
});

module.exports = {
  createUserSchema,
  loginUserSchema,
};
