const express = require("express");
const router = express.Router();
const PDCModel = require("../models/PDCModel");
const { PanelModel, LoadbankModel } = require("../models/SubAssemblyModel");
const ComponentModel = require("../models/ComponentModel");

router.post("/AllocateSubAssembly", async (req, res) => {
  try {
    const { inputPDCValue, inputPanelValue, inputLoadbankValue } = req.body;

    console.log(inputPDCValue);
    console.log(inputPanelValue);
    console.log(inputLoadbankValue);

    if (inputPanelValue) {
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
    }

    if (inputLoadbankValue) {
      const pdc = await PDCModel.findOne({
        pdcId: `${inputPDCValue}`,
      }).populate("loadbanks");

      if (!pdc) {
        return res.status(404).json({ message: "PDC not found" });
      }

      // Check if loadbank with inputLoadbankValue exists
      const loadbank = await LoadbankModel.findOne({
        loadbankId: inputLoadbankValue,
      });

      if (!loadbank) {
        return res.status(404).json({ message: "Loadbank not found" });
      }

      // Set the allocated date for the panel
      loadbank.allocatedDate = new Date();

      // Associate the Panel with the PDC by adding its ObjectId to the panels array
      pdc.loadbanks.push(loadbank._id);

      // Save both the panel and the updated PDC document
      await loadbank.save();
      await pdc.save();
    }

    // Retrieve the updated PDC with populated loadbanks and panels
    const updatedPDC = await PDCModel.findOne({
      pdcId: inputPDCValue,
    }).populate(["loadbanks", "panels"]);

    // Respond with success message and the updated PDC
    const response = "Subassembly allocation successful";
    return res.status(200).json({ message: response, updatedPDC });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/AllocatePanelComponent", async (req, res) => {
  try {
    const { componentSerialNumber, componentType, panelId } = req.body;

    console.log(panelId);
    console.log(componentSerialNumber);

    const existingComponents = await ComponentModel.find({
      componentSerialNumber: { $in: componentSerialNumber },
    });

    if (existingComponents.length > 0) {
      return res.status(409).json({
        message:
          "Component already allocated. Please select a different component.",
      });
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

      components.forEach((component) => {
        panel.components.push(component._id);
      });

      await panel.save();

      return res
        .status(200)
        .json({ message: "Component allocated to Panel successfully" });
    }
  } catch (error) {
    console.error("Error in allocation:", error);
    // Handle the error and send an appropriate response
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/AllocateLoadbankComponent", async (req, res) => {
  try {
    const { componentSerialNumber, componentType, loadbankId } = req.body;

    console.log(loadbankId);
    console.log(componentSerialNumber);

    const existingComponents = await ComponentModel.find({
      componentSerialNumber: { $in: componentSerialNumber },
    });

    if (existingComponents.length > 0) {
      return res.status(409).json({
        message:
          "Component already allocated. Please select a different component.",
      });
    } else {
      // If there are no existing components, proceed to insert new components
      const components = await ComponentModel.insertMany([
        {
          componentSerialNumber: componentSerialNumber,
          componentType: componentType,
          allocatedDate: new Date(),
        },
      ]);

      // Check if Loadbank with loadbankId exists
      const loadbank = await LoadbankModel.findOne({ loadbankId: loadbankId });

      if (!loadbank) {
        return res.status(404).json({ message: "Loadbank not found" });
      }

      components.forEach((component) => {
        loadbank.components.push(component._id);
      });

      await loadbank.save();

      return res
        .status(200)
        .json({ message: "Component allocated to the Loadbank successfully " });
    }
  } catch (error) {
    console.error("Error in allocation:", error);
    // Handle the error and send an appropriate response
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
