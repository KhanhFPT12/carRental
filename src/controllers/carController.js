const Car = require("../models/carModel");

// API
exports.getAllCars = async (req, res) => {
    try {
        const cars = await Car.find();
        res.render("cars", { cars });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// render UI
exports.renderCars = async (req, res) => {
    try {
        const cars = await Car.find();
        res.render("cars", { cars });
    } catch (error) {
        res.status(500).send(error.message);
    }
};

// create car
exports.createCar = async (req, res) => {
    try {
        const car = new Car(req.body);
        await car.save();

       res.redirect("/cars/create-success");
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};