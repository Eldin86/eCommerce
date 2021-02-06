import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Button, Row, Col, ListGroup, Image } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import CheckoutSteps from '../components/CheckoutSteps'
import { createOrder } from '../actions/orderActions'

const PlaceOrder = ({history}) => {
    const cart = useSelector(state => state.cart)
    const dispatch = useDispatch()

    //Calculate prices
    //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat#browser_compatibility
    const addDecimals = (num) => {
        return (Math.round(num * 100) / 100).toFixed(2)
    }
    //adding cart.itemesPrice, cart.shippingPrice, cart.taxPrice, cart.totalPrice to initial state, cart object
    cart.itemesPrice = addDecimals(cart.cartItems.reduce(
        (acc, item) => acc + item.price * item.qty, 
        0
    ))
        //Price less than 100$ shipping price is 0 else 100$
    cart.shippingPrice = addDecimals(cart.itemesPrice > 100 ? 0 : 100)

    cart.taxPrice = addDecimals(Number((0.15 * cart.itemesPrice).toFixed(2)))

    cart.totalPrice = (
        (Number(cart.itemesPrice) + 
        Number(cart.shippingPrice) + 
        Number(cart.taxPrice)).toFixed(2))

        const orderCreate = useSelector(state => state.orderCreate)
        const {order, success, error} = orderCreate
        //console.log(order)

        useEffect(() => {
            if(success) {
                history.push(`/order/${order._id}`)
            }
            //Comment below is to ignore useEffect complayning dependency
            // eslint-disable-next-line
        }, [history, success])

    const placeOrderHanlder = () => {
        dispatch(createOrder({
            orderItems: cart.cartItems,
            shippingAddress: cart.shippingAddress,
            paymentMethod: cart.paymentMethod,
            itemsPrice: cart.itemesPrice,
            shippingPrice: cart.shippingPrice,
            taxPrice: cart.taxPrice,
            totalPrice: cart.totalPrice
        }))
    }

    //console.log('PlaceOrder -> cart', cart)

    return (
        <>
            <CheckoutSteps step1 step2 step3 step4 />
            <Row>
                <Col md={8}>
                    <ListGroup variant="flush">
                        <ListGroup.Item>
                            <h2>Shipping</h2>
                            <p><strong>Address:</strong></p>
                            {cart.shippingAddress.address}{' '},
                            {cart.shippingAddress.city}{' '},
                            {cart.shippingAddress.postalCode}{' '},
                            {cart.shippingAddress.country}
                        </ListGroup.Item>

                        <ListGroup.Item>
                            <h2>Payment Method</h2>
                            <strong>Method: </strong>
                            {cart.paymentMethod}
                        </ListGroup.Item>

                        <ListGroup.Item>
                            <h2>Order Items</h2>
                            {cart.cartItems.length === 0 ? <Message>Your cart is empty</Message> : (
                                <ListGroup variant="flush">
                                    {cart.cartItems.map((item, index) => (
                                        <ListGroup.Item key={index}>
                                            <Row>

                                                <Col md={1}>
                                                    <Image
                                                        src={item.image}
                                                        alt={item.name}
                                                        fluid
                                                        rounded />
                                                </Col>

                                                <Col>
                                                    <Link to={`/product/${item.product}`}>
                                                        {item.name}
                                                    </Link>
                                                </Col>

                                                <Col md={4}>
                                                    {item.qty} x ${item.price} = = ${item.qty * item.price}
                                                </Col>

                                            </Row>
                                        </ListGroup.Item>
                                    ))
                                    }
                                </ListGroup>
                            )}
                        </ListGroup.Item>

                    </ListGroup>
                </Col>
                <Col md={4}>
                    <ListGroup variant="flush">

                        <ListGroup.Item>
                            <h2>Order Summary</h2>
                        </ListGroup.Item>

                        <ListGroup.Item>
                            <Row>
                                <Col>Items</Col>
                                <Col>{cart.itemesPrice}</Col>
                            </Row>
                        </ListGroup.Item>

                        <ListGroup.Item>
                            <Row>
                                <Col>Shipping</Col>
                                <Col>{cart.shippingPrice}</Col>
                            </Row>
                        </ListGroup.Item>

                        <ListGroup.Item>
                            <Row>
                                <Col>Tax</Col>
                                <Col>{cart.taxPrice}</Col>
                            </Row>
                        </ListGroup.Item>

                        <ListGroup.Item>
                            <Row>
                                <Col>Total</Col>
                                <Col>{cart.totalPrice}</Col>
                            </Row>
                        </ListGroup.Item>

                        <ListGroup.Item>
                            {error && <Message variant="danger">{error}</Message>}
                        </ListGroup.Item>

                        <ListGroup.Item>
                            <Button 
                                type="button" 
                                className="btn-block" 
                                disabled={cart.cartITems === 0} 
                                onClick={placeOrderHanlder}>PLACE ORDER</Button>
                        </ListGroup.Item>

                    </ListGroup>
                </Col>
            </Row>
        </>
    )
}

export default PlaceOrder
