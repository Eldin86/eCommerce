import axios from 'axios'
import {
    USER_DETAILS_FAIL,
    USER_DETAILS_REQUEST,
    USER_DETAILS_SUCCESS,
    USER_LOGIN_FAIL,
    USER_LOGIN_REQUEST,
    USER_LOGIN_SUCCESS,
    USER_LOGOUT,
    USER_REGISTER_FAIL,
    USER_REGISTER_REQUEST,
    USER_REGISTER_SUCCESS,
    USER_UPDATE_PROFILE_FAIL,
    USER_UPDATE_PROFILE_REQUEST,
    USER_UPDATE_PROFILE_SUCCESS,
    USER_DETAILS_RESET,
    USER_LIST_REQUEST,
    USER_LIST_SUCCESS,
    USER_LIST_FAIL,
    USER_LIST_RESET,
    USER_DELETE_REQUEST,
    USER_DELETE_SUCCESS,
    USER_DELETE_FAIL,
    USER_UPDATE_REQUEST,
    USER_UPDATE_SUCCESS,
    USER_UPDATE_FAIL,
} from '../constants/userConstants'
import { ORDER_LIST_MY_RESET } from '../constants/orderContants'

export const login = (email, password) => async (dispatch) => {
    try {
        dispatch({
            type: USER_LOGIN_REQUEST
        })

        //To send data into headers
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }

        //We make request
        const { data } = await axios.post('/api/users/login', {
            email, password
        },
            config)

        //After request send we dispatch user_login action
        dispatch({
            type: USER_LOGIN_SUCCESS,
            payload: data
        })

        //Set user we get into localStorage
        localStorage.setItem('userInfo', JSON.stringify(data))

    } catch (e) {
        dispatch({
            type: USER_LOGIN_FAIL,
            payload: e.response && e.response.data.message ? e.response.data.message : e.message
        })
    }
}

export const logout = () => (dispatch) => {

    //Remove from localStorage on logout
    localStorage.removeItem('userInfo')
    dispatch({type: USER_LOGOUT})
    dispatch({type: USER_DETAILS_RESET})
    dispatch({type: ORDER_LIST_MY_RESET})
    dispatch({type: USER_LIST_RESET})
}

export const register = (name, email, password) => async (dispatch) => {
    try {
        dispatch({
            type: USER_REGISTER_REQUEST
        })

        //To send data into headers
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }

        //We make request
        const { data } = await axios.post('/api/users', {
            name, email, password
        },
            config)

        //After request send we dispatch user_login action
        dispatch({
            type: USER_REGISTER_SUCCESS,
            payload: data
        })

        //After success registration, switch to login
        dispatch({
            type: USER_LOGIN_SUCCESS,
            payload: data
        })

        //Set user we get into localStorage
        localStorage.setItem('userInfo', JSON.stringify(data))

    } catch (e) {
        dispatch({
            type: USER_REGISTER_FAIL,
            payload: e.response && e.response.data.message ? e.response.data.message : e.message
        })
    }
}
//Proslijedimo 'profile' kao ID
export const getUserDetails = (id) => async (dispatch, getState) => {
    try {
        dispatch({
            type: USER_DETAILS_REQUEST
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
        const { data } = await axios.get(`/api/users/${id}`, config)

        //After request send we dispatch user_login action
        dispatch({
            type: USER_DETAILS_SUCCESS,
            payload: data
        })

    } catch (e) {
        dispatch({
            type: USER_DETAILS_FAIL,
            payload: e.response && e.response.data.message ? e.response.data.message : e.message
        })
    }
}

//pass entire user object
export const updateUserProfile = (user) => async (dispatch, getState) => {
    try {
        dispatch({
            type: USER_UPDATE_PROFILE_REQUEST
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
        const { data } = await axios.put(`/api/users/profile`, user,  config)

        //After request send we dispatch user_login action
        dispatch({
            type: USER_UPDATE_PROFILE_SUCCESS,
            payload: data
        })

    } catch (e) {
        dispatch({
            type: USER_UPDATE_PROFILE_FAIL,
            payload: e.response && e.response.data.message ? e.response.data.message : e.message
        })
    }
}

export const listUsers = () => async (dispatch, getState) => {
    try {
        dispatch({
            type: USER_LIST_REQUEST
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
        const { data } = await axios.get(`/api/users`, config)

        //After request send we dispatch user_login action
        dispatch({
            type: USER_LIST_SUCCESS,
            payload: data
        })

    } catch (e) {
        dispatch({
            type: USER_LIST_FAIL,
            payload: e.response && e.response.data.message ? e.response.data.message : e.message
        })
    }
}

export const deleteUser = (id) => async (dispatch, getState) => {
    try {
        dispatch({
            type: USER_DELETE_REQUEST
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
        await axios.delete(`/api/users/${id}`, config)

        //After request send we dispatch user_login action
        dispatch({type: USER_DELETE_SUCCESS})

    } catch (e) {
        dispatch({
            type: USER_DELETE_FAIL,
            payload: e.response && e.response.data.message ? e.response.data.message : e.message
        })
    }
}

export const updateUser = (user) => async (dispatch, getState) => {
    try {
        dispatch({
            type: USER_UPDATE_REQUEST
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
        const {data} = await axios.put(`/api/users/${user._id}`, user,  config)

        //After request send we dispatch user_login action
        dispatch({type: USER_UPDATE_SUCCESS})
        dispatch({type: USER_DETAILS_SUCCESS, payload: data})

    } catch (e) {
        dispatch({
            type: USER_UPDATE_FAIL,
            payload: e.response && e.response.data.message ? e.response.data.message : e.message
        })
    }
}