const express = require("express");
const router = express.Router();
const PDCModel = require("../models/PDCModel");
const { PanelModel } = require("../models/SubAssemblyModel");

router.post("/AllocateSubAssembly", async (req, res) => {
  try {
    const { inputPDCValue, inputPanelValue } = req.body;

    console.log(inputPDCValue);
    console.log(inputPanelValue);

    const pdc = await PDCModel.findOne({
      pdcId: `${inputPDCValue}`,
    }).populate("panels");

    if (!pdc) {
      return res.status(404).json({ message: "PDC not found" });
    }

    // Check if Panel with inputPanelValue exists
    const panel = await PanelModel.findOne({ panelId: inputPanelValue });

    if (!panel) {
      return res.status(404).json({ message: "Panel not found" });
    }

    // Set the allocated date for the panel
    panel.allocatedDate = new Date();

    // Associate the Panel with the PDC by adding its ObjectId to the panels array
    pdc.panels.push(panel._id);

    // Save both the panel and the updated PDC document
    await panel.save();
    await pdc.save();

    // You can send a response indicating success if needed
    return res
      .status(200)
      .json({ message: "Panel allocated to PDC successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
