import { Router } from "express";
import CarsControllers from "../controllers/cars_controllers.mjs";
import upload from "../utils/UploadFileManager.mjs";
const router = Router();

router.get("/", CarsControllers.renderCarsList);
router.get("/add", CarsControllers.createCarForm);
router.get("/edit/:id", CarsControllers.createEditForm);
router.get("/:id", CarsControllers.showCarPage);

router.post("/:id", upload.single("img"), CarsControllers.updateCar);
router.post("/", upload.single("img"), CarsControllers.addNewCar);

router.delete("/delete", CarsControllers.deleteCar);
export default router;
