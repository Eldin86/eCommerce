//asyncHandler Replacing a try-catch block
const asyncHandler = require('express-async-handler')
const User = require('../models/user-model')
const token = require('../utils/generateToken')

//Description: Auth user & get token
//Route: POST /api/users/login
//Access: Public
const authUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body

    const user = await User.findOne({ email })

    //Check is user exists and password, password we check inside user-model on schema level
    if (user && (await user.matchPassword(password))) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            token: token.generateToken(user._id)
        })
    } else {
        res.status(401)
        throw new Error('Invalid email or password')
    }
})

//Description: Register a new user
//Route: POST /api/users/
//Access: Public
const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body

    const userExists = await User.findOne({ email })

    if (userExists) {
        res.status(400)
        throw new Error('User already exists')
    }

    const user = await User.create({
        name,
        email,
        password
    })

    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            token: token.generateToken(user._id)
        })
    } else {
        res.status(400)
        throw new Error('Invalid user data')
    }
})

//Description: Get user profile
//Route: POST /api/users/profile
//Access: Private
const getUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id)

    if (user) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
        })
    } else {
        res.status(404)
        throw new Error('User not found')
    }
})

//Description: Update user profile
//Route: PUT /api/users/profile
//Access: Private
const updateUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id)

    if (user) {
       user.name = req.body.name || user.name
       user.email = req.body.email || user.email
       if(req.body.password){
           user.password = req.body.password
       }

       const updatedUser = await user.save()

       res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
        token: token.generateToken(updatedUser._id)
       })
    } else {
        res.status(404)
        throw new Error('User not found')
    }
})

//Description: Get all users
//Route: POST /api/users/
//Access: Private/Admin
const getUsers = asyncHandler(async (req, res) => {
    const users = await User.find({})

    res.json(users)
})

//Description: Delete user
//Route: POST /api/users/:id
//Access: Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id)

    if(user){
        await user.remove()
        res.json({message: 'User removed.'})
    }else{
        res.status(404)
        throw new Error('User not found')
    }
})

//Description: Get user by ID
//Route: GETT /api/users/:id
//Access: Private/Admin
const getUserById = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id).select('-password')

    if(user){
        return res.json(user)
    }else{
        res.status(404)
        throw new Error('User not found')
    }

    res.json(user)
})

//Description: Update user
//Route: PUT /api/users/:id
//Access: Private/Admin
const updateUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id)

    if (user) {
       user.name = req.body.name || user.name
       user.email = req.body.email || user.email
       user.isAdmin = req.body.isAdmin === undefined ? user.isAdmin : req.body.isAdmin

       const updatedUser = await user.save()

       res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
       })
    } else {
        res.status(404)
        throw new Error('User not found')
    }
})


module.exports = {
    authUser,
    getUserProfile,
    registerUser,
    updateUserProfile,
    getUsers,
    deleteUser,
    getUserById,
    updateUser
}