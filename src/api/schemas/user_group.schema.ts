import Joi from "joi";

export const addUserToGroupSchema = Joi.object({
    userIds: Joi.array().items(Joi.string().uuid()).min(0).required(),
    groupId: Joi.string().uuid(),
});
