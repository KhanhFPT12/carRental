const express = require("express");
const router = express.Router();
const carController = require("../controllers/carController");

router.get("/", carController.getAllCars);

// route render UI
router.get("/view", carController.renderCars);

router.get("/create", (req,res)=>{
    res.render("createCar");
});
router.get("/create-success", (req, res) => {
    res.render("createCarSuccess");
});

router.post("/", carController.createCar);

module.exports = router;