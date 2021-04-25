import Joi from "joi";

export const UUIDSchema = Joi.object({
    id: Joi.string().uuid().required(),
});
