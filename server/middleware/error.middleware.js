const errorMiddleware = (error, req, res, next) => {
    error.statusCode = error.statusCode || 500;
    error.message = error.message || 'Something went wrong!'; // Fixed typo here
    res.status(error.statusCode).json({ // Fixed typo here
        success: false,
        message: error.message,
        stack: error.stack
    });
}

export default errorMiddleware;
