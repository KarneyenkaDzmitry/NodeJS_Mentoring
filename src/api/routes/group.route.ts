import { Router } from "express";
import { validatePrams, validateBody } from "../controllers/validation.controller";
import * as controller from "../controllers/group.controller";
import { UUIDSchema } from "../schemas/uuid.schema";
import { groupSchema } from "../schemas/group.schema";
import { addUserToGroupSchema } from "../schemas/user_group.schema";

const router = Router();

router.get("/list", controller.getGroups);
router.post("/users", validateBody(addUserToGroupSchema), controller.addUsersToGroup);
router.post("/", validateBody(groupSchema), controller.createGroup);
router
    .all("/:id", validatePrams(UUIDSchema))
    .get("/:id", controller.getGroup)
    .put("/:id", validateBody(groupSchema), controller.updateGroup)
    .delete("/:id", controller.deleteGroup);
export { router };
