const express = require('express')
const router = express.Router()
const { addOrderItems, getOrderById, updateOrderToPaid, getMyOrders, getOrders, updateOrderToDelivered } = require('../controllers/order-controller')
const auth = require('../middleware/auth-middleware')


router.route('/').post(auth.protect, addOrderItems).get(auth.protect, auth.admin, getOrders)
router.route('/myorders').get(auth.protect, getMyOrders)
router.route('/:id').get(auth.protect, getOrderById)
router.route('/:id/pay').put(auth.protect, updateOrderToPaid)
router.route('/:id/deliver').put(auth.protect, auth.admin, updateOrderToDelivered)


module.exports = router