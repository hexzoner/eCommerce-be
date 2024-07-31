export default function errorHandler(err, req, res, next) {
  process.env.NODE_ENV !== "production" && console.error(err);
  let errorMessage = err.message;

  // if (err.errors && err.errors[0].message) errorMessage = err.errors[0].message;

  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    message: errorMessage,
    error: err.name,
  });
}

export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
