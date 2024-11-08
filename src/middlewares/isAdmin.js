module.exports = async (req, res, next) => {
  try {
    const isAdmin = req.user.role === "ADMIN" ? true : false;

    if (isAdmin) {
      next();
    } else {
      return false;
    }
  } catch (error) {
    next(error);
  }
};
