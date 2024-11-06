exports.errorHandler = (err, req, res, next) => {
  // Codes
  return res
    .status(err.statusCode)
    .json({ message: err.message, status: err.statusCode });
};
