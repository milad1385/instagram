exports.create = async (req, res, next) => {
  try {
    
  } catch (error) {
    next(error);
  }
};

exports.getPostView = async (req, res, next) => {
  try {
    return res.render("post/create");
  } catch (error) {
    next(error);
  }
};
