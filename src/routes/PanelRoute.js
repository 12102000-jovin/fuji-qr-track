const express = require("express");

const router = express.Router();

const { PanelModel } = require("../models/SubAssemblyModel");

router.post("/Panel/generateSubAssembly", async (req, res) => {
  const Panels = req.body.Panels;

  // Create an array of Panels documents
  const panelDocuments = Panels.map((panel) => ({
    ...panel,
    link: panel.link,
    panelId: panel.panelId,
  }));

  const insertedPanels = await PanelModel.insertMany(panelDocuments);
  res.json(insertedPanels);
});

router.get("/Panel/getLatestPanel", async (req, res) => {
  try {
    // Find the document with the highest Panel ID
    const latestPanel = await PanelModel.findOne()
      .sort({ panelId: -1 })
      .limit(1);

    if (latestPanel) {
      res.json(latestPanel.panelId);
    } else {
      res.json(null); // No Panel Found
    }
  } catch (error) {
    console.error("Error fetching latest Panel ID:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Get all panel
router.get("/Panel/getAllPanel", async (req, res) => {
  try {
    const PanelData = await PanelModel.find();
    res.json(PanelData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
