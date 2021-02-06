const express = require('express')
const router = express.Router()
const { 
    authUser, 
    registerUser, 
    getUserProfile, 
    updateUserProfile, 
    getUsers,
    deleteUser,
    getUserById,
    updateUser } = require('../controllers/user-controller')
const auth = require('../middleware/auth-middleware')


router.route('/').post(registerUser).get(auth.protect, auth.admin, getUsers)
router.post('/login', authUser)
//same route with different requests (get and put requests)
router.route('/profile').get(auth.protect, getUserProfile).put(auth.protect, updateUserProfile)
router.route('/:id').delete(auth.protect, auth.admin, deleteUser).get(auth.protect, auth.admin, getUserById).put(auth.protect, auth.admin, updateUser)

module.exports = router