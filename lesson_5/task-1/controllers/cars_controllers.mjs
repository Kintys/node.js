import CarsModule from "../modules/CarsModules.mjs";
class CarControllers {
    static renderCarsList(req, res) {
        const carsData = CarsModule.loadCarsList();
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
        });
    }
    static createEditForm(req, res) {
        const id = CarControllers.getId(req);
        const car = CarsModule.getCarsById(id);
        res.render("cars/car-form", {
            car,
        });
    }
    static addNewCar(req, res) {
        const imgUrl = `/${req.file.filename}` ?? "";
        const newCarData = {
            ...req.body,
            img: imgUrl,
        };
        CarsModule.addNewCarsToList(newCarData);
        res.redirect("/cars");
    }

    static updateCar(req, res) {
        const upgradeCarData = req.body;
        const id = CarControllers.getId(req);
        if (req.file) {
            upgradeCarData.img = `/${req.file.filename}`;
        }
        CarsModule.upgradeCarData(id, upgradeCarData);
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
