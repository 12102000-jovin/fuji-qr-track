const express = require("express");

const router = express.Router();

const { LoadbankModel } = require("../models/SubAssemblyModel");
const PDCModel = require("../models/PDCModel");

router.post("/Loadbank/generateSubAssembly", async (req, res) => {
  const Loadbanks = req.body.Loadbanks;

  const existingLoadbanks = await LoadbankModel.find({
    loadbankId: { $in: Loadbanks.map((loadbank) => loadbank.loadbankId) },
  });

  if (existingLoadbanks.length > 0) {
    return res.status(409).json("Duplicate Loadbank found");
  }

  // Create an array of Loadbanks documents
  const loadbankDocuments = Loadbanks.map((loadbank) => ({
    ...loadbank,
    link: loadbank.link,
    loadbankId: loadbank.loadbankId,
  }));

  const insertedLoadbanks = await LoadbankModel.insertMany(loadbankDocuments);
  res.json(insertedLoadbanks);
});

router.get("/Loadbank/getLatestLoadbank", async (req, res) => {
  try {
    // Find the document with the highet Loadbank Id
    const latestLoadbank = await LoadbankModel.findOne()
      .sort({ loadbankId: -1 })
      .limit(1);

    if (latestLoadbank) {
      res.json(latestLoadbank.loadbankId);
    } else {
      res.json(null); // No Loadbank found
    }
  } catch (error) {
    console.error("Error fetching latest Loadbank ID:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Get all loadbank
router.get("/Loadbank/getAllLoadbank", async (req, res) => {
  try {
    const LoadbankData = await LoadbankModel.find();
    res.json(LoadbankData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete Loadbank
router.delete("/Loadbank/deleteLoadbank/:loadbankId", async (req, res) => {
  try {
    const loadbankId = req.params.loadbankId;

    const loadbankToDelete = await LoadbankModel.findOneAndDelete({
      loadbankId: loadbankId,
    });

    if (!loadbankToDelete) {
      res.status(404).json({ mesage: "Loadbank not found!" });
    }

    const deletedLoadbankObjectId = loadbankToDelete._id;

    await PDCModel.updateMany(
      { loadbanks: deletedLoadbankObjectId },
      { $pull: { loadbanks: deletedLoadbankObjectId } }
    );

    console.log(loadbankToDelete);
    res.status(200).json({ message: "Loadbank deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
