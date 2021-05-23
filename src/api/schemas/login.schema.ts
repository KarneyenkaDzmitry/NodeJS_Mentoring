import Joi from "joi";

export const loginSchema = Joi.object({
    password: Joi.string().alphanum().min(5).max(35).required(),
    username: Joi.string().alphanum().min(3).max(25).required(),
});
