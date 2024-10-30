import CarsModule from "../modules/CarsModules.mjs";
import { validationResult } from "express-validator";
import CarsDBService from "../services/CarsDBService.mjs";

class CarControllers {
    static async renderCarsList(req, res) {
        const carsData = await CarsDBService.getList();
        console.log(carsData);
        res.render("cars/cars-list", {
            cars: carsData,
        });
    }
    static showCarPage(req, res) {
        const id = CarControllers.getId(req);
        const car = CarsModule.getCarsById(id);
        res.render("cars/car-page", {
            car,
        });
    }
    static createCarForm(req, res) {
        res.render("cars/car-form", {
            car: null,
            errors: [],
        });
    }
    static createEditForm(req, res) {
        const id = CarControllers.getId(req);
        const car = CarsModule.getCarsById(id);
        res.render("cars/car-form", {
            car,
            errors: [],
        });
    }

    static addOrUpdateCar(req, res) {
        const errors = validationResult(req);

        const carData = req.body;
        const id = CarControllers.getId(req);
        console.log(req.file.buffer);
        if (req.file) {
            carData.img = `/${req.file?.filename}`;
        }
        if (!errors.isEmpty()) {
            return res.render("cars/car-form", {
                errors: errors.array(),
                car: carData,
            });
        }
        if (id) {
            CarsModule.updateCarsData(id, carData);
        } else {
            CarsModule.addNewCarsToList(carData);
        }
        res.redirect("/cars");
    }

    static deleteCar(req, res) {
        const id = CarControllers.getId(req, "body");
        console.log(id);
        CarsModule.deleteCarsById(id);
        res.status(200).send("ok");
    }
    static getId(req, props = "params") {
        return req[`${props}`].id;
    }
}
export default CarControllers;
