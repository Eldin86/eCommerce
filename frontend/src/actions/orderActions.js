import {
    ORDER_CREATE_REQUEST, 
    ORDER_CREATE_SUCCESS,
    ORDER_CREATE_FAIL,
    ORDER_DETAILS_REQUEST,
    ORDER_DETAILS_SUCCESS,
    ORDER_DETAILS_FAIL,
    ORDER_PAY_REQUEST,
    ORDER_PAY_SUCCESS,
    ORDER_PAY_FAIL,
    ORDER_LIST_MY_REQUEST,
    ORDER_LIST_MY_SUCCESS,
    ORDER_LIST_MY_FAIL,
    ORDER_LIST_REQUEST,
    ORDER_LIST_SUCCESS,
    ORDER_LIST_FAIL,
    ORDER_DELIVER_REQUEST,
    ORDER_DELIVER_SUCCESS,
    ORDER_DELIVER_FAIL,
} from '../constants/orderContants'
import axios from 'axios'

export const createOrder = (order) => async (dispatch, getState) => {
    try {
        dispatch({
            type: ORDER_CREATE_REQUEST
        })

        //Get userInfo from userLogin for token
        //Destructure 2 levels
        const { userLogin: { userInfo } } = getState()

        //To send data into headers
        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + userInfo.token
            }
        }

        //We make request
        //We pass 'profile' as id
        const { data } = await axios.post(`/api/orders`, order,  config)
        //console.log('orderActions ', data)

        //After request send we dispatch user_login action
        dispatch({
            type: ORDER_CREATE_SUCCESS,
            payload: data
        })

    } catch (e) {
        dispatch({
            type: ORDER_CREATE_FAIL,
            payload: e.response && e.response.data.message ? e.response.data.message : e.message
        })
    }
}

export const getOrderDetails = (id) => async (dispatch, getState) => {
    try {
        dispatch({
            type: ORDER_DETAILS_REQUEST
        })

        //Get userInfo from userLogin for token
        //Destructure 2 levels
        const { userLogin: { userInfo } } = getState()

        //To send data into headers
        const config = {
            headers: {
                Authorization: 'Bearer ' + userInfo.token
            }
        }

        //We make request
        //We pass 'profile' as id
        const { data } = await axios.get(`/api/orders/${id}`,  config)
        console.log('orderActions ', data)

        //After request send we dispatch user_login action
        dispatch({
            type: ORDER_DETAILS_SUCCESS,
            payload: data
        })

    } catch (e) {
        dispatch({
            type: ORDER_DETAILS_FAIL,
            payload: e.response && e.response.data.message ? e.response.data.message : e.message
        })
    }
}

//Payment result come from paypal
export const payOrder = (orderId, paymentResult) => async (dispatch, getState) => {
    try {
        dispatch({
            type: ORDER_PAY_REQUEST
        })

        //Get userInfo from userLogin for token
        //Destructure 2 levels
        const { userLogin: { userInfo } } = getState()

        //To send data into headers
        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + userInfo.token
            }
        }

        //We make request
        //We pass 'profile' as id
        const { data } = await axios.put(`/api/orders/${orderId}/pay`, paymentResult,   config)
        //console.log('orderActions ', data)

        //After request send we dispatch user_login action
        dispatch({
            type: ORDER_PAY_SUCCESS,
            payload: data
        })

    } catch (e) {
        dispatch({
            type: ORDER_PAY_FAIL,
            payload: e.response && e.response.data.message ? e.response.data.message : e.message
        })
    }
}

export const deliverOrder = (order) => async (dispatch, getState) => {
    try {
        dispatch({
            type: ORDER_DELIVER_REQUEST
        })

        //Get userInfo from userLogin for token
        //Destructure 2 levels
        const { userLogin: { userInfo } } = getState()

        //To send data into headers
        const config = {
            headers: {
                Authorization: 'Bearer ' + userInfo.token
            }
        }

        //We make request
        //We pass 'profile' as id
        const { data } = await axios.put(`/api/orders/${order._id}/deliver`, {},   config)
        //console.log('orderActions ', data)

        //After request send we dispatch user_login action
        dispatch({
            type: ORDER_DELIVER_SUCCESS,
            payload: data
        })

    } catch (e) {
        dispatch({
            type: ORDER_DELIVER_FAIL,
            payload: e.response && e.response.data.message ? e.response.data.message : e.message
        })
    }
}

export const listMyOrders = () => async (dispatch, getState) => {
    try {
        dispatch({
            type: ORDER_LIST_MY_REQUEST
        })

        //Get userInfo from userLogin for token
        //Destructure 2 levels
        const { userLogin: { userInfo } } = getState()

        //To send data into headers
        const config = {
            headers: {
                Authorization: 'Bearer ' + userInfo.token
            }
        }

        //We make request
        //We pass 'profile' as id
        const { data } = await axios.get(`/api/orders/myorders`, config)
        console.log('orderActions ', data)

        //After request send we dispatch user_login action
        dispatch({
            type: ORDER_LIST_MY_SUCCESS,
            payload: data
        })

    } catch (e) {
        dispatch({
            type: ORDER_LIST_MY_FAIL,
            payload: e.response && e.response.data.message ? e.response.data.message : e.message
        })
    }
}

export const listOrders = () => async (dispatch, getState) => {
    try {
        dispatch({
            type: ORDER_LIST_REQUEST
        })

        //Get userInfo from userLogin for token
        //Destructure 2 levels
        const { userLogin: { userInfo } } = getState()

        //To send data into headers
        const config = {
            headers: {
                Authorization: 'Bearer ' + userInfo.token
            }
        }

        //We make request
        //We pass 'profile' as id
        const { data } = await axios.get(`/api/orders`, config)
        console.log('orderActions ', data)

        //After request send we dispatch user_login action
        dispatch({
            type: ORDER_LIST_SUCCESS,
            payload: data
        })

    } catch (e) {
        dispatch({
            type: ORDER_LIST_FAIL,
            payload: e.response && e.response.data.message ? e.response.data.message : e.message
        })
    }
}