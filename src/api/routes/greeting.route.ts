import { Router } from "express";
import * as controller from "../controllers/greeting.controller";

const router = Router();

router.get("/", controller.helloWorld);

export { router };
