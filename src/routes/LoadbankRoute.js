const express = require("express");

const router = express.Router();

const { LoadbankModel } = require("../models/SubAssemblyModel");

router.post("/Loadbank/generateSubAssembly", async (req, res) => {
  const Loadbanks = req.body.Loadbanks;

  // Create an array of Loadbanks documents
  const loadbankDocuments = Loadbanks.map((loadbank) => ({
    ...loadbank,
    link: loadbank.link,
    loadbankId: loadbank.loadbankId,
  }));

  const insertedLoadbanks = await LoadbankModel.insertMany(loadbankDocuments);
  res.json(insertedLoadbanks);
});

module.exports = router;
