const  {StatusCodes} = require('http-status-codes')

const errorHandler = (err, req, res, next) => {
    const customError = {
        statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
        message: err.message || 'Something went wrong'
    }
    if (err.name === "ValidationError") {
        customError.statusCode = StatusCodes.BAD_REQUEST;
    }
    if (err.code === 11000) {
        customError.statusCode = StatusCodes.BAD_REQUEST;
        customError.message = `The provided ${Object.keys(err.keyValue)} already exists consider logging in`
    }
    if (err.name === "CastError") {
        customError.statusCode = StatusCodes.NOT_FOUND
        customError.message = `No item found with id : ${err.value}`
    }
    if (err.code === 'ENOENT') {
        customError.statusCode = StatusCodes.NOT_FOUND
        customError.message = `No item found with id : ${err.value}`
    }
    return res.status(customError.statusCode).json({message: customError.message, err})
}

module.exports = errorHandler;