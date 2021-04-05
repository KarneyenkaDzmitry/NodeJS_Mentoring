import { Router } from "express";
import { validatePrams, validateBody } from "../controllers/validation.controller";
import * as controller from "../controllers/user.controller";
import { userUUIDSchema } from "../../schemas/user.uuid.schema";
import { userSchema } from "../../schemas/user.schema";

const router = Router();

router.get("/list", controller.getUsers);
router.post("/", validateBody(userSchema), controller.createUser);
router
    .all("/:id", validatePrams(userUUIDSchema))
    .get("/:id", controller.getUserById)
    .put("/:id", validateBody(userSchema), controller.updateUser)
    .delete("/:id", controller.deleteUser);
export { router };
