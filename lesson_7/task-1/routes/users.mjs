import express from "express";
import { checkSchema } from "express-validator";
import UserController from "../controllers/userControllers.mjs";
import UserValidator from "../validators/userValidators.mjs";

const router = express.Router();

router.get("/", UserController.usersList);
router.get("/register/:id?", UserController.registerForm);
router.post("/register/:id?", checkSchema(UserValidator.userSchema), UserController.registerUser);
router.delete("/", UserController.deleteUser);

export default router;
