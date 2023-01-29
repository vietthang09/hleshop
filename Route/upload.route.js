var express = require("express");
var router = express.Router();
var UploadController = require("../Controller/upload.controller");

router.post(
  "/category",
  UploadController.uploadImageCategory.single("image"),
  UploadController.uploadImage,
  (error, req, res, next) => {
    res.status(400).json({ error: error.message });
  }
);
// For Single image upload
router.post(
  "/product-image",
  UploadController.imageUploadProduct.single("image"),
  UploadController.uploadImage,
  (error, req, res, next) => {
    res.status(400).json({ error: error.message });
  }
);
// For Single image upload
router.post(
  "/product-images",
  UploadController.imageUploadProductDescription.single("image"),
  UploadController.uploadImage,
  (error, req, res, next) => {
    res.status(400).json({ error: error.message });
  }
);
module.exports = router;
