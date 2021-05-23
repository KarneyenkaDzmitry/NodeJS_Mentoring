import { Router } from "express";
import * as controller from "../controllers/login.service.controller";
import { validateBody } from "../controllers/validation.controller";
import { loginSchema } from "../schemas/login.schema";

const router = Router();

router.post("/", validateBody(loginSchema), controller.login);

export { router };
