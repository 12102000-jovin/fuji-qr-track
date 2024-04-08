const express = require("express");

const router = express.Router();

const { PanelModel } = require("../models/SubAssemblyModel");
const PDCModel = require("../models/PDCModel");
const ComponentModel = require("../models/ComponentModel");

// Generate Panel API
router.post("/Panel/generateSubAssembly", async (req, res) => {
  const Panels = req.body.Panels;

  const existingPanels = await PanelModel.find({
    panelId: { $in: Panels.map((panel) => panel.panelId) },
  });

  if (existingPanels.length > 0) {
    return res.status(409).json("Duplicate Panel found");
  }

  // Create an array of Panels documents
  const panelDocuments = Panels.map((panel) => ({
    ...panel,
    link: panel.link,
    panelId: panel.panelId,
  }));

  const insertedPanels = await PanelModel.insertMany(panelDocuments);
  res.json(insertedPanels);
});

// Get the latest Panel API
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

// Get All Panel API
router.get("/Panel/getAllPanel", async (req, res) => {
  try {
    const PanelData = await PanelModel.find();
    res.json(PanelData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete Panel API
router.delete("/Panel/deletePanel/:panelId", async (req, res) => {
  try {
    const panelId = req.params.panelId;

    const panelToDelete = await PanelModel.findOneAndDelete({
      panelId: panelId,
    });

    if (!panelToDelete) {
      return res.status(404).json({ message: "Panel not found" });
    }

    // Extract component ObjectIds associated with the panel
    const componentIds = panelToDelete.components;

    console.log("Component IDs associated with the panel:", componentIds);

    for (const componentId of componentIds) {
      await ComponentModel.findOneAndDelete({ _id: componentId });
    }

    const deletedPanelObjectId = panelToDelete._id;

    await PDCModel.updateMany(
      { panels: deletedPanelObjectId },
      { $pull: { panels: deletedPanelObjectId } }
    );

    console.log(panelToDelete);
    res.status(200).json({ message: "Panel deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Edit Panel API
router.put("/Panel/editPanel/:pdcId/:panelId", async (req, res) => {
  try {
    const { pdcId, panelId } = req.params;
    const { pdcToEdit, panelToEdit } = req.body;

    // Find the current pdcId
    const currentPdc = await PDCModel.findOne({ pdcId });

    // Find the future pdcId
    const futurePdc = await PDCModel.findOne({ pdcId: pdcToEdit });

    // Find the current panelId
    const currentPanel = await PanelModel.findOne({ panelId });

    // Find the future panelId
    const futurePanel = await PanelModel.findOne({ panelId: panelToEdit });

    if (panelToEdit == null || panelToEdit === "") {
      return res.status(400).json({ error: "Please Enter Panel Id" });
    }

    const isPanelPattern = /^PANEL\d{6}$/.test(panelToEdit);
    if (!isPanelPattern) {
      return res
        .status(400)
        .json({ error: "Please Enter Correct Panel Id Format" });
    }

    if (
      futurePanel &&
      currentPanel &&
      futurePanel.panelId !== currentPanel.panelId
    ) {
      return res.status(409).json({
        error: "Panel already exists. Please choose a different one.",
      });
    }

    // if (!currentPdcId || !futurePdcId || !currentPanelId) {
    //   return res.status(404).json({
    //     message: "Current PDC, Future PDC, or Panel not found",
    //   });
    // }

    if (pdcId !== pdcToEdit && panelId === panelToEdit) {
      // Add the panel to the future pdc and remove it from the current pdc
      if (futurePdc && currentPdc && currentPdc.panels) {
        futurePdc.panels.push(currentPanel._id);
        currentPdc.panels.pull(currentPanel._id);

        // Save changes to both pdc
        await futurePdc.save();
        await currentPdc.save();
      }

      res.status(200).json({ message: "PDC moved successfully", futurePdc });
    } else if (pdcId === pdcToEdit && panelId !== panelToEdit) {
      const updatedPanelId = await PanelModel.findOneAndUpdate(
        { panelId: panelId },
        {
          $set: {
            panelId: panelToEdit,
            link: `http://localhost:3000/Dashboard/PANEL/${panelToEdit}`,
          },
        },
        { new: true } // This option returns the modified document rather than the original
      );

      if (!updatedPanelId) {
        return res.status(404).json({
          message: "Panel not found",
        });
      }
      res
        .status(200)
        .json({ message: "panel updated successfully", updatedPanelId });
    } else if (pdcId !== pdcToEdit && panelId !== panelToEdit) {
      const updatedPanelId = await PanelModel.findOneAndUpdate(
        { panelId: panelId },
        {
          $set: {
            panelId: panelToEdit,
            link: `http://localhost:3000/Dashboard/PANEL/${panelToEdit}`,
          },
        },
        { new: true }
      );

      // Add the panel to the future work order and remove it from the current work order
      if (futurePdc && currentPdc && currentPdc.panels) {
        futurePdc.panels.push(currentPanel._id);
        currentPdc.panels.pull(currentPanel._id);

        // Save changes to both work orders
        await futurePdc.save();
        await currentPdc.save();
      }

      res.status(200).json({
        message: "Panel moved and updated successfully",
        futurePdc,
        updatedPanelId,
      });
    } else if (pdcId === pdcToEdit && panelId === panelToEdit) {
      res.status(200).json({ message: "No changes" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
});

module.exports = router;
