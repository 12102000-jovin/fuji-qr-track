const express = require("express");
const router = express.Router();
const PDCModel = require("../models/PDCModel");
const { PanelModel } = require("../models/SubAssemblyModel");
const ComponentModel = require("../models/ComponentModel");

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

router.post("/AllocatePanelComponent", async (req, res) => {
  try {
    const { componentSerialNumber, componentType, panelId, allocatedDate } =
      req.body;

    console.log(panelId);
    console.log(componentSerialNumber);

    const existingComponents = await ComponentModel.find({
      componentSerialNumber: { $in: componentSerialNumber },
    });

    if (existingComponents.length > 0) {
      return res.json({ message: "Existing component" });
    } else {
      // If there are no existing components, proceed to insert new components
      const components = await ComponentModel.insertMany([
        {
          componentSerialNumber: componentSerialNumber,
          componentType: componentType,
          allocatedDate: new Date(),
        },
      ]);

      // Check if Panel with panelId exists
      const panel = await PanelModel.findOne({ panelId: panelId });

      if (!panel) {
        return res.status(404).json({ message: "Panel not found" });
      }
      // else {
      //   return res.json({ message: "Panel found" });
      // }

      components.forEach((component) => {
        panel.components.push(component._id);
      });

      await panel.save();

      return res
        .status(200)
        .json({ message: "Panel allocated to PDC successfully" });
    }
  } catch (error) {
    console.error("Error in allocation:", error);
    // Handle the error and send an appropriate response
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
