const express = require("express");
const {
  searchEBikes,
  getAvailableBrands,
} = require("../controllers/searchController");

const router = express.Router();

router.post("/", searchEBikes);
router.get("/brands", getAvailableBrands);

module.exports = router;
