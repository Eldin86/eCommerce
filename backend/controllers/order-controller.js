const asyncHandler = require('express-async-handler')
const Order = require('../models/order-model')

//Description: Create new order
//Route: GET /api/orders
//Access: Private
const addOrderItems = asyncHandler(async (req, res) => {
    const {
        orderItems,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice } = req.body

    if (orderItems && orderItems.length === 0) {
        res.status(400)
        throw new Error('No order items')
    } else {
        const order = new Order({
            orderItems,
            //Add user also
            user: req.user._id,
            shippingAddress,
            paymentMethod,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice
        })

        const createdOrder = await order.save()
        res.status(201).json(createdOrder)
    }
})

//Description: Get order by ID
//Route: GET /api/orders/:id
//Access: Private
const getOrderById = asyncHandler(async (req, res) => {
    //iz user schema uzmi name i email?
    // The .populate() is saying to use that user model reference/link to populate the found order object with the user name and email.
    const order = await Order.findById(req.params.id).populate('user', 'name email')

    if (order) {
        res.json(order)
    } else {
        res.status(404)
        throw new Error('Order not found')
    }
})

//Description: Update order to paid
//Route: GET /api/orders/:id/pay
//Access: Private
const updateOrderToPaid = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id)

    if (order) {
        order.isPaid = true
        order.paidAt = Date.now()
        order.paymentResult = {
          id: req.body.id,
          status: req.body.status,
          update_time: req.body.update_time,
          email_address: req.body.payer.email_address,
        }
    
        const updatedOrder = await order.save()
    
        res.json(updatedOrder)
      } else {
        res.status(404)
        throw new Error('Order not found')
    }
})

//Description: Update order to delivered
//Route: GET /api/orders/:id/delivered
//Access: Private/Admin
const updateOrderToDelivered = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id)

    if (order) {
        order.isDelivered = true
        order.deliveredAt = Date.now()
 
        const updatedOrder = await order.save()
    
        res.json(updatedOrder)
      } else {
        res.status(404)
        throw new Error('Order not found')
    }
})


//Description: Get logged in user orders
//Route: GET /api/orders/myorders
//Access: Private
const getMyOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find({user: req.user._id})
    console.log(orders)
    res.json(orders)
})

//Description: Get all orders
//Route: GET /api/orders/
//Access: Private
const getOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find({}).populate('user', 'id name')
    res.json(orders)
})

module.exports = {
    addOrderItems,
    getOrderById,
    updateOrderToPaid,
    getMyOrders,
    getOrders,
    updateOrderToDelivered,
}