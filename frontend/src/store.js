//apply middleware koristimo da mozemo da primjenimo neki middleware kao sto je thunk
import { createStore, combineReducers, applyMiddleware } from 'redux'
//Dozvoljava nam u action kreatorima da saljemo asinhrone requests
import thunk from 'redux-thunk'
//setting extension into browser, to use devtool extension
import { composeWithDevTools } from 'redux-devtools-extension'

import {
  productListReducer,
  productDetailsReducer,
  productDeleteReducer,
  productCreateReducer,
  productUpdateReducer,
  productReviewCreateReducer,
  productTopRatedReducer
} from './reducers/product-reducers'
import { cartReducer } from './reducers/cart-reducers'
import {
  userDetailsReducer,
  userLoginReducer,
  userRegisterReducer,
  userUpdateProfileReducer,
  userListReducer,
  userDeleteReducer,
  userUpdateReducer
} from './reducers/user-reducers'
import {
  orderCreateReducer,
  orderDetailsReducer,
  orderPayReducer,
  orderListMyReducer,
  orderListReducer,
  orderDeliverReducer
} from './reducers/order-reducers'

//combine multiple reducers into one redux store
const reducer = combineReducers({
  productList: productListReducer,
  productDetails: productDetailsReducer,
  cart: cartReducer,
  userLogin: userLoginReducer,
  userRegister: userRegisterReducer,
  userDetails: userDetailsReducer,
  userUpdateProfile: userUpdateProfileReducer,
  orderCreate: orderCreateReducer,
  orderDetails: orderDetailsReducer,
  orderPay: orderPayReducer,
  orderDeliver: orderDeliverReducer,
  orderListMy: orderListMyReducer,
  userList: userListReducer,
  userDelete: userDeleteReducer,
  userUpdate: userUpdateReducer,
  productDelete: productDeleteReducer,
  productCreate: productCreateReducer,
  productUpdate: productUpdateReducer,
  orderList: orderListReducer,
  productReviewCreate: productReviewCreateReducer,
  productTopRated: productTopRatedReducer
})

//When we take data from localStorage we have to JSON.parse
//store into cartItemsFromStorage cartItems if found of []
//Store data from localStorage into initialState
const cartItemsFromStorage = localStorage.getItem('cartItems')
  ? JSON.parse(localStorage.getItem('cartItems'))
  : []
const userInfoFromStorage = localStorage.getItem('userInfo')
  ? JSON.parse(localStorage.getItem('userInfo'))
  : null
//console.log('store.js -> cartItemsFromStorage', cartItemsFromStorage)

const shippingAddressFromStorage = localStorage.getItem('shippingAddress')
  ? JSON.parse(localStorage.getItem('shippingAddress'))
  : {}

//Add to initial state data from cart, so when page reload we don't lose cart items
//This inital state overwrites state from reducers?
//We pass here everything what we need as inital data when page loads
const initialState = {
  cart: {
    cartItems: cartItemsFromStorage,
    shippingAddress: shippingAddressFromStorage
  },
  userLogin: { userInfo: userInfoFromStorage }
}

//Posto koristimo thunk samo, a stavili smo ga u niz ako bismo jos neki koristili, u applyMiddleware smo ga spreadali
const middleware = [thunk]
//we create store(first we pass reducer, second is initial state, use it if we want to load something when reducer loads, third middleware so we can use devtools and inside we pass middlweare)
//composeWithDevTools -> 
const store = createStore(reducer, initialState, composeWithDevTools(applyMiddleware(...middleware)))

export default store