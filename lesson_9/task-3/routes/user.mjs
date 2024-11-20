import { Router } from "express";
import UserController from "../controllers/userController.mjs";
const router = Router();

/* GET home page. */

router.get("/", UserController.registerForm);
router.post("/", UserController.registerUser);

export default router;
