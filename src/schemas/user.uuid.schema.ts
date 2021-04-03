import Joi from 'joi';

export const userUUIDSchema = Joi.object({
    id: Joi.string()
        .uuid()
        .required()
});