const path = require("path");
const fs = require("fs");

module.exports = (picName, pathName) => {
  const picPath = path.join(process.cwd(), `public/images/${pathName}/` + picName);

  fs.unlink(picPath, (err) => {
    if (err) {
      console.log("خط در حذف فایل", err);
      return;
    }
  });
};
