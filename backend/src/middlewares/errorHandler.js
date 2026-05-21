const notFoundHandler = (req, res) => {
  res.status(404).json({
    message: `Ruta no encontrada: ${req.method} ${req.originalUrl}`
  });
};

const errorHandler = (error, req, res, next) => {
  if (res.headersSent) {
    return next(error);
  }

  const statusCode = error.statusCode || 500;

  res.status(statusCode).json({
    message: error.message || 'Error interno del servidor'
  });
};

module.exports = {
  notFoundHandler,
  errorHandler
};
