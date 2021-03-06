import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Row, Col, ListGroup, Image, Form, Button, Card } from 'react-bootstrap'
import Message from '../components/Message'
import { addToCart, removeFromCart } from '../actions/cartActions'

/* Render items into cart page from localStorage */

//match, history and location are props of Route component, so you can pass it through to child components  as ({ match }) => ( ) etc
const Cart = ({ match, location, history }) => {
    const productId = match.params.id

    //If we have quantity take only number of quantity (?qty=1), so we use split method else default 1
    const qty = location.search ? Number(location.search.split('=')[1]) : 1
    //console.log('Cart -> qty', qty)

    const dispatch = useDispatch()

    //get cartItems from store
    const cart = useSelector(state => state.cart)
    const { cartItems } = cart
    //console.log('Cart -> cartITems', cartItems)

    useEffect(() => {
        //Dispatch only if we have productId, when we click add to cart button from product page we send id into url
        if (productId) {
            //On cart page load add cartItems from localStorage
            dispatch(addToCart(productId, qty))
        }
    }, [dispatch, productId, qty])

    const removeFromCartHandler = (id) => {
        dispatch(removeFromCart(id))
    }
    const checkoutHandler = () => {
        history.push('/login?redirect=shipping')
    }

    return (
        <Row>
            <Col md={8}>
                <h1>Shopping Cart</h1>
                {cartItems.length === 0 ? (
                    <Message>
                        Your cart is empty <Link to="/">Go Back</Link>
                    </Message>) : (
                        <ListGroup variant="flush">
                            {
                                cartItems.map(item => (
                                    <ListGroup.Item key={item.product}>
                                        <Row>
                                            <Col md={2}>
                                                <Image src={item.image} alt={item.name} fluid rounded />
                                            </Col>
                                            <Col md={3}>
                                                <Link to={`/product/${item.product}`}>{item.name}</Link>
                                            </Col>
                                            <Col md={2}>${item.price}</Col>
                                            <Col md={2}>
                                                <Form.Control as='select' value={item.qty} onChange={(e) => dispatch(addToCart(item.product, Number(e.target.value)))}>
                                                    {/* {console.log('Cart item -> ', item)} */}
                                                    {/* {console.log('Cart item.qty -> ', item.qty)} */}
                                                    {[...Array(item.countInStock).keys()].map((x) => {
                                                        return (
                                                            <option key={x + 1} value={x + 1}>
                                                                {x + 1}
                                                            </option>
                                                        )
                                                    })}
                                                </Form.Control>
                                            </Col>
                                            <Col md={2}>
                                                <Button type="button" variant="light" onClick={() => removeFromCartHandler(item.product)}><i className="fas fa-trash"></i></Button>
                                            </Col>
                                        </Row>
                                    </ListGroup.Item>
                                ))
                            }
                        </ListGroup>
                    )}
            </Col>
            <Col md={4}>
                <Card>
                    <ListGroup variant="flush">
                        <ListGroup.Item>
                            <h2>
                                Subtotal ({cartItems.reduce((acc, item) => acc + item.qty, 0)}) items
                            </h2>
                            ${cartItems.reduce((acc, item) => acc + item.qty * item.price, 0).toFixed(2)}
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <Button type="button" className="btn-block" disabled={cartItems.length === 0} onClick={checkoutHandler}>
                                Proceed to Checkout
                            </Button>
                        </ListGroup.Item>
                    </ListGroup>
                </Card>
            </Col>
        </Row>
    )
}

export default Cart
