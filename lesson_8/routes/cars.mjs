import { Router } from "express";
import CarsControllers from "../controllers/cars_controllers.mjs";
import upload from "../utils/UploadFileManager.mjs";
import { checkSchema } from "express-validator";
import CarsValidator from "../validators/carsValidators.mjs";
const router = Router();

// 1)додати до кожного елемента даних у вашому проєкті поле «owner» - де зберігається id властника (самі власники зберігається у окремій колекції «owners» (піб власника, адерса)). Організувати вибірку даних з відображення інформації про власників у списку елементів даних
// 2)розмістити базу даних у “Atlas” та пов’язати з здеплоєним проєктом (вказати список валідних IP адрес)

router.get("/", CarsControllers.renderCarsList);

router.get("/add", CarsControllers.createCarForm);
router.get("/edit/:id", CarsControllers.createEditForm);
router.get("/owner", CarsControllers.createOwnerForm);

router.post("/add-owner", CarsControllers.addNewOwner);

router.post("/:id", upload.single("img"), checkSchema(CarsValidator.carsSchema), CarsControllers.addOrUpdateCar);

router.post("/", upload.single("img"), checkSchema(CarsValidator.carsSchema), CarsControllers.addOrUpdateCar);

router.delete("/delete", CarsControllers.deleteCar);
export default router;
