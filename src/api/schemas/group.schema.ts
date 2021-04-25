import Joi from "joi";

export const groupSchema = Joi.object({
    permissions: Joi.array()
        .items(Joi.string().label("READ").label("WRITE").label("DELETE").label("SHARE").label("UPLOAD_FILES"))
        .min(0)
        .max(5)
        .required(),
    name: Joi.string().alphanum().min(3).max(25).required(),
    id: Joi.string().uuid(),
});
