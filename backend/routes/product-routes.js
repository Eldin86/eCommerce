const express = require('express')
const router = express.Router()
const {
    getProductById,
    getProducts,
    deleteProduct,
    createProduct,
    updateProduct,
    createProductReview,
    getTopProducts } = require('../controllers/product-controller')

const auth = require('../middleware/auth-middleware')


router
    .route('/')
    .get(getProducts)
    .post(auth.protect, auth.admin, createProduct)

router.route('/:id/reviews').post(auth.protect, createProductReview)

router.get('/top', getTopProducts)

router
    .route('/:id')
    .get(getProductById)
    .delete(auth.protect, auth.admin, deleteProduct)
    .put(auth.protect, auth.admin, updateProduct)

module.exports = router