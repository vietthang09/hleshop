const multer = require("multer");
const path = require("path");

const imageStorageProduct = multer.diskStorage({
  // Destination to store image
  destination: (req, file, cb) => {
    cb(null, "./public/Upload/ImageProduct");
  },
  filename: (req, file, cb) => {
    cb(null, "product_" + Date.now() + path.extname(file.originalname));
    // file.fieldname is name of the field (image)
    // path.extname get the uploaded file extension
  },
});

const imageStorageProductDescription = multer.diskStorage({
  // Destination to store image
  destination: (req, file, cb) => {
    // it is destination not desitnation :)
    cb(null, "./public/Upload/ProductDescription");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      "product-description_" + Date.now() + path.extname(file.originalname)
    );
    // file.fieldname is name of the field (image)
    // path.extname get the uploaded file extension
  },
});

const imageStorageCategoryDescription = multer.diskStorage({
  // Destination to store image
  destination: (req, file, cb) => {
    cb(null, "./public/Upload/ImageCategory");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
    // file.fieldname is name of the field (image)
    // path.extname get the uploaded file extension
  },
});

module.exports.imageUploadProduct = multer({
  storage: imageStorageProduct,
  limits: {
    fileSize: 20000000, // 2000000 Bytes = 2 MB
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(png|jpg|jpeg|webp)$/)) {
      // upload only png and jpg format
      return cb(new Error("Please upload a Image"));
    }
    cb(undefined, true);
  },
});

module.exports.imageUploadProductDescription = multer({
  storage: imageStorageProductDescription,
  limits: {
    fileSize: 20000000, // 2000000 Bytes = 2 MB
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(png|jpg|jpeg|webp)$/)) {
      // upload only png and jpg format
      return cb(new Error("Please upload a Image"));
    }
    cb(undefined, true);
  },
});

module.exports.uploadImageCategory = multer({
  storage: imageStorageCategoryDescription,
  limits: {
    fileSize: 20000000, // 2000000 Bytes = 2 MB
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(png|jpg|jpeg|webp)$/)) {
      // upload only png and jpg format
      return cb(new Error("Please upload a Image"));
    }
    cb(undefined, true);
  },
});

module.exports.uploadImage = (req, res) => {
  return res.json({ msg: req.file });
};
