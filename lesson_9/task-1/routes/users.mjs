import { Router } from "express";
import UserController from "../controllers/userControllers.mjs";
const router = Router();

/* GET users listing. */
router.get("/login", UserController.registerForm);

router.post("/login", UserController.registerUser);
export default router;
