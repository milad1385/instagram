const { errorResponse } = require("./../utils/responses");

exports.errorHandler = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }
  console.log(err);

  if (err.name === "ValidationError") {
    const errors = [];

    err.inner.forEach((e) => {
      errors.push({
        field: e.path,
        message: e.message,
      });
    });

    console.log({ success: false, error: "Validation error", data: errors });
    return errorResponse(res, 400, "Validation error", errors);
  }
  
  let errors;
  let message = err.message || "Internal Server Error";
  let status = err.status || 500;
  stack = err.stack || "";

  console.log({ success: false, error: message, data: errors });

  return errorResponse(res, status, message, errors);
};
