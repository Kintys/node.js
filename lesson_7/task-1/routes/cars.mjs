import { Router } from "express";
import CarsControllers from "../controllers/cars_controllers.mjs";
import upload from "../utils/UploadFileManager.mjs";
import { checkSchema } from "express-validator";
import CarsValidator from "../validators/carsValidators.mjs";
const router = Router();

// Задача. Додати до попереднього ДЗ проєкту валідацію даних.
router.get("/", CarsControllers.renderCarsList);

router.get("/add", CarsControllers.createCarForm);
router.get("/edit/:id", CarsControllers.createEditForm);

router.post("/:id", upload.single("img"), checkSchema(CarsValidator.carsSchema), CarsControllers.addOrUpdateCar);

router.post("/", upload.single("img"), checkSchema(CarsValidator.carsSchema), CarsControllers.addOrUpdateCar);

router.delete("/delete", CarsControllers.deleteCar);
export default router;
