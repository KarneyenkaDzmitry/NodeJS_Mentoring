import { Router } from "express";
import * as controller from "../controllers/error.service.controller";

const router = Router();

router.get("/uncaughtException", controller.uncaughtException);
router.get("/unhandledRejectionError", controller.unhandledRejectionError);

export { router };
