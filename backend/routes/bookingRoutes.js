const express = require('express');

const router = express.Router();

const bookingController =
require('../controllers/bookingController');

router.post(
'/lock',
bookingController.lockSlot
);

router.put(
'/confirm/:id',
bookingController.confirmBooking
);

router.get(
'/all',
bookingController.getBookings
);

module.exports = router;