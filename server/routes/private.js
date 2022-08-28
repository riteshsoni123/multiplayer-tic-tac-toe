const express = require("express");
const router = express.Router();
const { getPrivateData, updatedata } = require("../controllers/private");
const { protect } = require("../middleware/auth");

router.route("/").get(protect, getPrivateData);

router.route("/updatedata/:id").post(protect, updatedata);

module.exports = router;
