const Booking = require('../models/bookingModel');
const Car = require('../models/carModel');

// get bookings 
exports.getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.find();
       res.status(200).json(bookings);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }

};



exports.getExpiredBookings = async (req, res) => {
    try {
        const now = new Date();

        const past24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000);

        const bookings = await Booking.find({
            $and: [
                {
                    $or: [
                        { endDate: null },
                        { endDate: { $exists: false } }
                    ]
                },
                {
                    startDate: { $lt: past24Hours }
                }
            ]
        });

        res.status(200).json(bookings);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

//post booking

exports.createBooking = async (req, res) => {
    try {
        const { customerName, carNumber, startDate, endDate } = req.body;

        if (!customerName || !carNumber || !startDate) {
            return res.status(400).json({
                message: "customerName, carNumber and startDate are required"
            });
        }

        const start = new Date(startDate);

        if (isNaN(start.getTime())) {
            return res.status(400).json({
                message: "Invalid startDate format"
            });
        }

        let end = null;

        if (endDate) {
            end = new Date(endDate);

            if (isNaN(end.getTime())) {
                return res.status(400).json({
                    message: "Invalid endDate format"
                });
            }

            if (start >= end) {
                return res.status(400).json({
                    message: "End date must be after start date"
                });
            }
        }

     
        const car = await Car.findOne({ carNumber });

        if (!car) {
            return res.status(404).json({
                message: "Car not found"
            });
        }

       
        let conflictingBooking = null;

        if (end) {
            conflictingBooking = await Booking.findOne({
                carNumber,
                startDate: { $lt: end },
                endDate: { $gt: start }
            });

            if (conflictingBooking) {
                return res.status(400).json({
                    message: "Car is already booked for the selected dates"
                });
            }
        }

       
        let totalPrice = 0;

        if (end) {
            const days =
                (end - start) / (1000 * 60 * 60 * 24);

            totalPrice = days * car.pricePerDay;
        }


        const newBooking = new Booking({
            customerName,
            carNumber,
            startDate: start,
            endDate: end || null,
            totalPrice
        });

       
        if (end) {
            car.status = "rented";
            await car.save();
        }

        const savedBooking = await newBooking.save();

       res.status(201).json({ message: "Booking created successfully", booking: savedBooking });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

// put booking
exports.updateBooking = async (req, res) => {
    try {
        const booking = await Booking.findByIdAndUpdate(
            req.params.bookingId,
            req.body,
            { new: true }
        );
        res.status(200).json(booking);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }

};

//delete booking
exports.deleteBooking = async (req, res) => {
    try {
        const booking = await Booking.findByIdAndDelete(req.params.bookingId);
        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }
        await Booking.findByIdAndDelete(req.params.bookingId);

        await Car.updateOne(
            { carNumber: booking.carNumber },
            { status: "available" }
        );

        res.redirect("/bookings/delete-success");
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.renderBookings = async (req, res) => {
    const bookings = await Booking.find();
    res.render("bookings", { bookings });
}

