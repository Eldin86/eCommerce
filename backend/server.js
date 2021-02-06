const express = require('express')
const dotenv = require('dotenv')
const connectDB = require('./config/db')
const colors = require('colors')
const morgan = require('morgan')
const productRoutes = require('./routes/product-routes')
const userRoutes = require('./routes/user-routes')
const orderRoutes = require('./routes/order-routes')
const uploadRoutes = require('./routes/upload-routes')
const errorHanlder = require('./middleware/error-middleware')

const path = require('path')

dotenv.config()
connectDB()

const app = express()

//If in development mode
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}

//Allow us to accept JSON data in body
app.use(express.json())

const PORT = process.env.PORT || 5000

app.use('/api/products', productRoutes)
app.use('/api/users', userRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/upload', uploadRoutes)

app.get('/api/config/paypal', (req, res) => res.send(process.env.PAYPAL_CLIENT_ID))

//If in production mode
if (process.env.NODE_ENV === 'production') {
    //Create frontend folder as static folder
    app.use(express.static(path.join(__dirname, '../frontend/build')))

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, '../frontend', 'build', 'index.html'))
    })
} else {
    app.get('/', (req, res) => {
        res.send('API is running...')
    })
}


app.use('/uploads', express.static(path.join(__dirname, '/uploads')))

// if a route does not exist in the routes then notFound middleware responds.
// if there is an error in the controller like an error in connection to DB then error middleware responds.

//Not found route error
//Ako ne nadje /api/products ide dalje i kad naidje na ovo posalje poruku "Not Found"
//The notFound middleware is placed at the end (before error handling) and is only reached if no other route is reached before it.
app.use(errorHanlder.notFound)

//General error hanlder
//Error koji throw unutar nekog controllera ce uhvatiti ovaj middleware
app.use(errorHanlder.errorHandler)

app.listen(PORT, console.log(`Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold))