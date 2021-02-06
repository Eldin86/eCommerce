import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Row, Col, ListGroup, Image, Button } from 'react-bootstrap'
import axios from 'axios'
import {PayPalButton} from 'react-paypal-button-v2'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import { getOrderDetails, payOrder, deliverOrder } from '../actions/orderActions'
import {ORDER_PAY_RESET, ORDER_DELIVER_RESET} from '../constants/orderContants'

const Order = ({ match, history }) => {
    const orderId = match.params.id
    const [sdkReady, setSdkReady] = useState(false)
    const dispatch = useDispatch()

    const orderDetails = useSelector(state => state.orderDetails)
    const { order, loading, error } = orderDetails
    console.log('order', order)

    const userLogin = useSelector(state => state.userLogin)
    const { userInfo } = userLogin

    const orderPay = useSelector(state => state.orderPay)
    //Rename loadingPay to loading and successPay to success
    const { loading: loadingPay, success: successPay } = orderPay

    const orderDeliver = useSelector(state => state.orderDeliver)
    const { loading: loadingDeliver, success: successDeliver } = orderDeliver

    //Dodati model u order-model u backendu
    if (!loading) {
        const addDecimals = (num) => {
            return (Math.round(num * 100) / 100).toFixed(2)
        }

        //adding cart.itemesPrice, cart.shippingPrice, cart.taxPrice, cart.totalPrice to initial state, cart object
        order.itemesPrice = addDecimals(order.orderItems.reduce(
            (acc, item) => acc + item.price * item.qty,
            0
        ))
    }

    useEffect(() => {
        if(!userInfo){
            history.push('/login')
        }
        const addPaypalScript = async () => {
            //get client id from backend
            const { data: clientId } = await axios.get('/api/config/paypal')
            //dinamically create script 
            const script = document.createElement('script')
            script.type = "text/javascript"
            script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}`
            script.async = true


            //When script is ready, or when script is loaded
            script.onload = () => {
                setSdkReady(true)
            }

            //Add script to body
            document.body.appendChild(script)
        }

        //console.log('Order window.paypal', window.paypal)

        if (!order || successPay || successDeliver) {
            dispatch({type: ORDER_PAY_RESET})
            dispatch({type: ORDER_DELIVER_RESET})
            dispatch(getOrderDetails(orderId))
            //If not payd
        }else if(!order.isPayd){
            if(!window.paypal){
                addPaypalScript()
            }
        }else{
            setSdkReady(true)
        }
    }, [dispatch,history, userInfo,  order, orderId, successPay, successDeliver ])

    //Takes from paypal paymentResult
    const successPaymentHandler = (paymentResult) => {
        //Cal payorder actions that we created
        console.log(paymentResult)
        dispatch(payOrder(orderId, paymentResult))
    }

    const deliverHandler = () => {
        dispatch(deliverOrder(order))
    }


    //console.log('PlaceOrder -> cart', cart)

    return loading ? <Loader /> : error ? <Message variant="danger">{error}</Message> : <>
        <h1>Order {order._id}</h1>
        <Row>
            <Col md={8}>
                <ListGroup variant="flush">
                    <ListGroup.Item>
                        <h2>Shipping</h2>
                        <p><strong>Name: </strong>{order.user.name}</p>
                        <p><strong>Name: </strong><a href={`mailto:${order.user.email}`}>{order.user.email}</a></p>
                        <p><strong>Address: </strong>
                            {order.shippingAddress.address}{' '},
                            {order.shippingAddress.city}{' '},
                            {order.shippingAddress.postalCode}{' '},
                            {order.shippingAddress.country}
                        </p>
                        {order.isDelivered ? <Message variant="success">Delivered on {order.deliveredAt}</Message> : <Message variant="danger">Not Delivered</Message>}
                    </ListGroup.Item>

                    <ListGroup.Item>
                        <h2>Payment Method</h2>
                        <p>
                            <strong>Method: </strong>
                            {order.paymentMethod}
                        </p>
                        {order.isPaid ? <Message variant="success">Paid on {order.paidAt}</Message> : <Message variant="danger">Not Paid</Message>}
                    </ListGroup.Item>

                    <ListGroup.Item>
                        <h2>Order Items</h2>
                        {order.orderItems.length === 0 ? <Message>Order is empty</Message> : (
                            <ListGroup variant="flush">
                                {order.orderItems.map((item, index) => (
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
                            <Col>${order.itemesPrice}</Col>
                        </Row>
                    </ListGroup.Item>

                    <ListGroup.Item>
                        <Row>
                            <Col>Shipping</Col>
                            <Col>${order.shippingPrice}</Col>
                        </Row>
                    </ListGroup.Item>

                    <ListGroup.Item>
                        <Row>
                            <Col>Tax</Col>
                            <Col>${order.taxPrice}</Col>
                        </Row>
                    </ListGroup.Item>

                    <ListGroup.Item>
                        <Row>
                            <Col>Total</Col>
                            <Col>${order.totalPrice}</Col>
                        </Row>
                    </ListGroup.Item>
                    {/* If not paid */}
                    {!order.isPaid && (
                        <ListGroup.Item>
                            {loadingPay && <Loader />}
                            {!sdkReady ? <Loader /> : (
                                 <PayPalButton amount={order.totalPrice} onSuccess={successPaymentHandler}/>
                            )}
                        </ListGroup.Item>
                    )}
                    {loadingDeliver && <Loader/>}
                    {userInfo && userInfo.isAdmin && order.isPaid && !order.isDelivered && (
                        <ListGroup.Item>
                            <Button type="button" className="btn btn-block" onClick={deliverHandler}>
                                Mark As Delivered
                            </Button>
                        </ListGroup.Item>
                    )}
                </ListGroup>
            </Col>
        </Row>
    </>

}

export default Order
