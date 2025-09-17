const errorHandler = (err, req, res, next) => {
    console.error('Error ', err.message);
    console.error('Stack ', err.stack);

    let statusCode = err.statusCode || 500;
    let message = err.message || 'Internal Server Error';
    res.statusText = message;

    res.status(statusCode).json({
        success: false,
        message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }) // Include stack in dev mode
    });
};

export default errorHandler;