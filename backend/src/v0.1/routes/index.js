const express = require('express');
const router = express.Router();

// STRIPE
const stripe = require("../../controllers/stripe_controller/stripeController");
router.post('/payments', stripe.payment)

// PLATES
const plates = require("../../controllers/plate_controller/plateController");
router.get('/plates', plates.getAll)
router.get('/plates/clasification', plates.getPlatesClasification)

// SHIFTS
const shifts = require("../../controllers/shift_controller/shiftController");
router.get('/shifts', shifts.getAll)
router.get('/calendar', shifts.getCalendar);

// ORDERS
const orders = require("../../controllers/order_controller/orderController");
router.post('/orders', orders.newOrder);

// EXTRA INGREDIENTS
const extra = require("../../controllers/extra_controller/extraController");
router.get('/extras', extra.getAll);

module.exports = router;