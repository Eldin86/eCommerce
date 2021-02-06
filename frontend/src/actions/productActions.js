import {
    PRODUCT_LIST_REQUEST,
    PRODUCT_LIST_SUCCESS,
    PRODUCT_LIST_FAIL,
    PRODUCT_DETAILS_REQUEST,
    PRODUCT_DETAILS_SUCCESS,
    PRODUCT_DETAILS_FAIL,
    PRODUCT_DELETE_REQUEST,
    PRODUCT_DELETE_SUCCESS,
    PRODUCT_DELETE_FAIL,
    PRODUCT_CREATE_REQUEST,
    PRODUCT_CREATE_SUCCESS,
    PRODUCT_CREATE_FAIL,
    PRODUCT_UPDATE_REQUEST,
    PRODUCT_UPDATE_SUCCESS,
    PRODUCT_UPDATE_FAIL,
    PRODUCT_CREATE_REVIEW_REQUEST,
    PRODUCT_CREATE_REVIEW_SUCCESS,
    PRODUCT_CREATE_REVIEW_FAIL,
    PRODUCT_PRODUCT_TOP_REQUEST,
    PRODUCT_PRODUCT_TOP_SUCCESS,
    PRODUCT_PRODUCT_TOP_FAIL,
} from '../constants/productConstants'
import axios from 'axios'

//ACTION CREATORS
//redux thunk koristimo za async funkcije, odnosno asinhrono koristenje
export const listProducts = (keyword = '', pageNumber = '') => async (dispatch) => {
    try {
        dispatch({
            //Set loading to true
            type: PRODUCT_LIST_REQUEST
        })
        //fetch data
        const { data } = await axios(`/api/products?keyword=${keyword}&pageNumber=${pageNumber}`)

        dispatch({
            //Set loading to false and store products into array after we fetch data
            type: PRODUCT_LIST_SUCCESS,
            payload: data
        })
    } catch (e) {
        dispatch({
            //Set loading to false and error message store into error variable
            type: PRODUCT_LIST_FAIL,
            //axios create this object. if backend returns error code then it return the result from backend in this object: error.response.data
            payload: e.response && e.response.data.message ? e.response.data.message : e.message
        })
    }
}

export const listProductDetails = (id) => async (dispatch) => {
    try {
        dispatch({
            //Set loading to true
            type: PRODUCT_DETAILS_REQUEST
        })
        const { data } = await axios(`/api/products/${id}`)
        console.log(data)

        dispatch({
            //Set loading to false and store products into array
            type: PRODUCT_DETAILS_SUCCESS,
            payload: data
        })
    } catch (e) {
        dispatch({
            //Set loading to false and error message store into error variable
            type: PRODUCT_DETAILS_FAIL,
            payload: e.response && e.response.data.message ? e.response.data.message : e.message
        })
    }
}

export const deleteProduct = (id) => async (dispatch, getState) => {
    try {
        dispatch({
            type: PRODUCT_DELETE_REQUEST
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
        await axios.delete(`/api/products/${id}`, config)

        //After request send we dispatch user_login action
        dispatch({
            type: PRODUCT_DELETE_SUCCESS,
        })

    } catch (e) {
        dispatch({
            type: PRODUCT_DELETE_FAIL,
            payload: e.response && e.response.data.message ? e.response.data.message : e.message
        })
    }
}

export const createProduct = (id) => async (dispatch, getState) => {
    try {
        dispatch({
            type: PRODUCT_CREATE_REQUEST
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
        const { data } = await axios.post(`/api/products/`, {}, config)

        //After request send we dispatch user_login action
        dispatch({
            type: PRODUCT_CREATE_SUCCESS,
            payload: data
        })

    } catch (e) {
        dispatch({
            type: PRODUCT_CREATE_FAIL,
            payload: e.response && e.response.data.message ? e.response.data.message : e.message
        })
    }
}

export const updateProduct = (product) => async (dispatch, getState) => {
    try {
        dispatch({
            type: PRODUCT_UPDATE_REQUEST
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
        const { data } = await axios.put(`/api/products/${product._id}`, product, config)
        console.log('productAction data', data)

        //After request send we dispatch user_login action
        dispatch({
            type: PRODUCT_UPDATE_SUCCESS,
            payload: data
        })

    } catch (e) {
        dispatch({
            type: PRODUCT_UPDATE_FAIL,
            payload: e.response && e.response.data.message ? e.response.data.message : e.message
        })
    }
}

export const createProductReview = (productId, review) => async (dispatch, getState) => {
    try {
        dispatch({
            type: PRODUCT_CREATE_REVIEW_REQUEST
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
        await axios.post(`/api/products/${productId}/reviews`, review, config)

        //After request send we dispatch user_login action
        dispatch({
            type: PRODUCT_CREATE_REVIEW_SUCCESS,
        })

    } catch (e) {
        dispatch({
            type: PRODUCT_CREATE_REVIEW_FAIL,
            payload: e.response && e.response.data.message ? e.response.data.message : e.message
        })
    }
}

export const listTopProducts = () => async (dispatch) => {
    try {
        dispatch({
            //Set loading to true
            type: PRODUCT_PRODUCT_TOP_REQUEST
        })
        //fetch data
        const { data } = await axios(`/api/products/top`)

        dispatch({
            //Set loading to false and store products into array after we fetch data
            type: PRODUCT_PRODUCT_TOP_SUCCESS,
            payload: data
        })
    } catch (e) {
        dispatch({
            //Set loading to false and error message store into error variable
            type: PRODUCT_PRODUCT_TOP_FAIL,
            //axios create this object. if backend returns error code then it return the result from backend in this object: error.response.data
            payload: e.response && e.response.data.message ? e.response.data.message : e.message
        })
    }
}