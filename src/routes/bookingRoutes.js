const express = require("express");
const router = express.Router();
const bookingController = require("../controllers/bookingController");

// API
router.get("/", bookingController.getAllBookings);

// view danh sách booking
router.get("/view", bookingController.renderBookings);

// 👉 route hiển thị form tạo booking
router.get("/create", (req, res) => {
    res.render("createBooking");
});

// create booking
router.post("/", bookingController.createBooking);

// update
router.put("/:bookingId", bookingController.updateBooking);

// delete
router.delete("/:bookingId", bookingController.deleteBooking);

// expired
router.get("/expired", bookingController.getExpiredBookings);


// render delete success page
router.get("/delete-success", (req, res) => {
    res.render("deleteSuccess");
});
router.get("/create-success", (req, res) => {
    res.render("createBookingSuccess");
});
router.post("/delete/:bookingId", bookingController.deleteBooking);
module.exports = router;