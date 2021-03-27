import Joi from 'joi';

export const userSchema = Joi.object({
    password: Joi.string()
        .alphanum()
        .min(5)
        .max(35)
        .required(),
    login: Joi.string()
        .alphanum()
        .min(3)
        .max(25)
        .required(),
    age: Joi.number()
        .min(4)
        .max(130)
        .required(),
    isDeleted: Joi.boolean()
        .required(),
    id: Joi.string()
        .uuid()
});

// export const UserSchema = BaseUserSchema(BaseUserSchema)