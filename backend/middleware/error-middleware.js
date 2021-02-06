const notFound = (req, res, next) => {
    //Throw error to next middleware
    const error = new Error(`Not found - ${req.originalUrl}`)
    res.status(404)
    next(error)
}

const errorHandler = (err, req, res, next) => {
    //Now, sometimes we might get a 200 response, even though it's an error
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode
    
    res.status(statusCode)
    res.json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack
    })
}

exports.notFound = notFound
exports.errorHandler = errorHandler