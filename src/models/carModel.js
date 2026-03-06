const mongoose = require("mongoose");

const carSchema = new mongoose.Schema({
    carNumber: {
        type: String,
        required: true,
        unique: true
    },
    capacity: Number,
    status: {
        type: String,
        enum: ["available", "rented", "maintenance"],
        default: "available"
    },
    pricePerDay: Number,
    features: [String]
});

module.exports = mongoose.model("Car", carSchema);
