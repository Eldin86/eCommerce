import axios from 'axios'
import { 
    CART_ADD_ITEM,
    CART_REMOVE_ITEM,
    CART_SAVE_SHIPPING_ADDRESS,
    CART_SAVE_PAYMENT_METHOD,
} from '../constants/cartConstants'

//dispatch and getState (getState to get all state) because we use Thunk
//Add to Cart product
export const addToCart = (id, qty) => async (dispatch, getState) => {
    //fetch data with id and store it into data so we can add it to cart
    const {data} = await axios.get(`/api/products/${id}`)
    //console.log('cartActions -> data', data)
    
    dispatch({
        type: CART_ADD_ITEM,
        //Data we want to display in cart
        payload: {
            product: data._id,
            name: data.name,
            image: data.image,
            price: data.price,
            countInStock: data.countInStock,
            qty
        }
    })
    //Save items from cart into localStorage we get from getState (cart reference is from cart store.js)
    //JSON.stringify because we can only save strings into locaStorage
    //When we take data from localStorage we have to JSON.parse
    localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems))
}
//Remove product from Cart
export const removeFromCart = (id) => (dispatch, getState) => {
    dispatch({
        type: CART_REMOVE_ITEM,
        payload: id
    })
    //getState().cart.cartItems has the updated cartItems and it will be replaced with the old one. that's why it delete or add items.
    //After we update cart.cartItems initialState then we set new cartItems
    localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems))
}


export const saveShippingAddress = (data) => (dispatch, getState) => {
    dispatch({
        type: CART_SAVE_SHIPPING_ADDRESS,
        payload: data
    })
    //getState().cart.cartItems has the updated cartItems and it will be replaced with the old one. that's why it delete or add items.
    //After we update cart.cartItems initialState then we set new cartItems
    localStorage.setItem('shippingAddress', JSON.stringify(data))
}

export const savePaymentMethod = (data) => (dispatch, getState) => {
    dispatch({
        type: CART_SAVE_PAYMENT_METHOD,
        payload: data
    })
    //getState().cart.cartItems has the updated cartItems and it will be replaced with the old one. that's why it delete or add items.
    //After we update cart.cartItems initialState then we set new cartItems
    localStorage.setItem('paymentMethod', JSON.stringify(data))
}