const path = require("path");
const fs = require("fs");
const multer = require("multer");
const multer = require("multer");
exports.multerStorage = (
  destination,
  allowedType = /jpg | png | jpeg | webp/
) => {
  if (!fs.existsSync(destination)) {
    fs.mkdirSync(destination);
  }

  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, destination);
    },

    filename: (req, file, cb) => {
      const uniqueName = Date.now + Math.floor(Math.random() * 1e9);
      const extname = path.extname(file.originalname);
      cb(null, `${uniqueName}${extname}`);
    },
  });

  const fileFilter = (req, file, cb) => {
    if (allowedType.test(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Please upload valid format"));
    }
  };

  const multerConfig = multer({
    limits: {
      fileSize: 512_000_000,
    },
    storage,
    fileFilter,
  });

  return multerConfig;
};
