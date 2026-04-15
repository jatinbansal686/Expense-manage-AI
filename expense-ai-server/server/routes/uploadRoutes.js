const express = require("express");
const router = express.Router();

const upload = require("../middleware/upload");
const authMiddleware = require("../middleware/authMiddleware");
const { uploadStatement } = require("../controllers/uploadController");

router.post(
  "/statement",
  authMiddleware,
  upload.single("file"),
  uploadStatement,
);

module.exports = router;
