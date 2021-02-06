import {
    CART_ADD_ITEM,
    CART_REMOVE_ITEM,
    CART_SAVE_SHIPPING_ADDRESS,
    CART_SAVE_PAYMENT_METHOD
} from '../constants/cartConstants'

//Initial state contains cart items as array
//In case of CART_ADD_ITEM execute this reducer
export const cartReducer = (state = { cartItems: [], shippingAddress: {} }, action) => {
    switch (action.type) {
        //Add item into Cart
        case CART_ADD_ITEM:
            const item = action.payload
            console.log('cart-reducer', item)
            // map through the cardItems array
            // and replace the matching product with the new item
            // leave the rest products as they were
            //x.product is product._id
            //Return same product(e.g if we have camera in state, and recive camera from payload, return it)
            const existItem = state.cartItems.find((x) => x.product === item.product)
            if (existItem) {
                // return the existing state with adjusted cardItems
                return {
                    ...state,
                    //if exists product
                    //If we have same product in cart replace same product with new one (but still same), or return old product 
                    
                    cartItems: state.cartItems.map(x => {
                        return x.product === existItem.product ? item : x
                    })
                }
                //If cartItem does not exists push it into array
            } else {
                return {
                    ...state,
                    //Spread existing items, and add new item
                    cartItems: [...state.cartItems, item]
                }
            }
        //Remove item from Cart
        case CART_REMOVE_ITEM: 
            return {
                ...state,
                cartItems: state.cartItems.filter(x => x.product !== action.payload)
            }
            case CART_SAVE_SHIPPING_ADDRESS: 
            return {
                //Posto moze biti da ima jos drugih narudzbi, moramo kopirati prvo, pa onda dodati
                ...state,
                shippingAddress: action.payload
            }
            case CART_SAVE_PAYMENT_METHOD: 
            return {
                //Posto moze biti da ima jos drugih narudzbi, moramo kopirati prvo, pa onda dodati
                ...state,
                paymentMethod: action.payload,
            }
        default:
            return state
    }
}

