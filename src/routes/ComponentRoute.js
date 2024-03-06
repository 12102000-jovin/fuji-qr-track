const express = require("express");

const router = express.Router();

const ComponentModel = require("../models/ComponentModel");

router.get("/getAllComponents", async (req, res) => {
  try {
    const ComponentData = await ComponentModel.find();
    res.json(ComponentData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
