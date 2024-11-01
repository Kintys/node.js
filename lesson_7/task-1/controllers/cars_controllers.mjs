// import CarsModule from "../modules/CarsModules.mjs";
import { validationResult } from "express-validator";
import CarsDBService from "../services/CarsDBService.mjs";

class CarControllers {
    static async renderCarsList(req, res) {
        const carsData = await CarsDBService.getList();
        const newData = CarControllers.getNewDataWithBase64(carsData);

        res.render("cars/cars-list", {
            cars: newData,
        });
    }
    static createCarForm(req, res) {
        res.render("cars/car-form", {
            car: null,
            errors: [],
        });
    }
    static async createEditForm(req, res) {
        const id = CarControllers.getId(req);
        const car = await CarsDBService.getById(id);
        res.render("cars/car-form", {
            car,
            errors: [],
        });
    }

    static async addOrUpdateCar(req, res) {
        const errors = validationResult(req);

        const carData = req.body;
        const id = CarControllers.getId(req);
        if (req.file) {
            carData.img = req.file?.buffer;
        }
        if (!errors.isEmpty()) {
            return res.render("cars/car-form", {
                errors: errors.array(),
                car: carData,
            });
        }
        if (id) {
            await CarsDBService.update(id, carData);
        } else {
            await CarsDBService.create(carData);
        }
        res.redirect("/cars");
    }

    static async deleteCar(req, res) {
        const id = CarControllers.getId(req, "body");
        await CarsDBService.deleteById(id);
        res.status(200).send("ok");
    }
    static getId(req, props = "params") {
        return req[`${props}`].id;
    }
    static getNewDataWithBase64(data) {
        return data.map((element) => {
            return {
                ...element._doc,
                img: `data:image/gif;base64,${Buffer.from(element.img).toString("base64")}`,
            };
        });
    }
}
export default CarControllers;
