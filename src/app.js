const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// static
app.use(express.static("public"));

// view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// database
mongoose.connect('mongodb+srv://gk1803:khanhdz2004@cluster0.t5tpijc.mongodb.net/?appName=Cluster0')
.then(()=>console.log("MongoDB Connected"))
.catch(err=>console.log(err));

// routes
app.use("/bookings", require("./routes/bookingRoutes"));
app.use("/cars", require("./routes/carRoutes"));

// dashboard
const Booking = require("./models/bookingModel");
const Car = require("./models/carModel");

app.get("/", async(req,res)=>{

const bookings = await Booking.countDocuments();
const cars = await Car.countDocuments();

res.render("dashboard",{bookings,cars});

});
app.use(cookieParser());

// cors
app.use(cors({
    origin:"http://localhost:3000",
    methods:["GET","POST","PUT","DELETE"],
    allowedHeaders:["Content-Type","Authorization"]
}));

//auth
app.use("/auth", require("./routes/authRoutes"));

app.listen(3000, () => {
console.log("Server running at http://localhost:3000");
});