export function notFoundError(req, res, next) {
  const err = new Error(`Not Found`);
  err.status = 404;
  next(err); // return error
}

export function errorHundler(err, req, res, next) {
  res.status(err.status || 500).json({
    message: err.message,
  });
}
