const express = require("express");

const router = express.Router();

const PDCModel = require("../models/PDCModel");
const { PanelModel } = require("../models/SubAssemblyModel");
const WorkOrderModel = require("../models/WorkOrderModel");

router.get("/:workOrderId/showWorkOrderDashboard", async (req, res) => {
  try {
    const { workOrderId } = req.params;

    // Find Work Order based on workOrderId
    const workOrder = await WorkOrderModel.findOne({
      workOrderId: workOrderId,
    }).populate("pdcs");

    if (!workOrderId) {
      return res.status(404).json({ message: "Work Order not found" });
    }

    // Find the pdc from the given work order id
    const pdcs = await PDCModel.find({
      _id: { $in: workOrder.pdcs },
    });

    res.status(200).json(pdcs);
  } catch (error) {
    res
      .status(500)
      .json({ message: `Error retrieving pdcs in ${workOrderId}` });
  }
});

router.get("/:pdcId/showPDCDashboard", async (req, res) => {
  try {
    const { pdcId } = req.params;

    const pdc = await PDCModel.findOne({
      pdcId: pdcId,
    }).populate("panels");

    if (!pdc) {
      return res.status(404).json({ message: "PDC not found" });
    }

    const panels = await PanelModel.find({
      _id: { $in: pdc.panels },
    });

    // Find the first Work Order that references this PDC
    const workOrder = await WorkOrderModel.findOne({
      pdcs: pdc._id,
    });

    // Extracting workOrderId from the found work order
    const workOrderId = workOrder ? workOrder.workOrderId : null;

    // Send an object with both panels and workOrderId
    res.status(200).json({ panels, workOrderId });
  } catch (error) {
    res.status(500).json({ message: `Error retrieving pdcs in ${pdcId}` });
  }
});

router.get("/:panelId/showPanelDashboard", async (req, res) => {
  try {
    const { panelId } = req.params;

    // Find the panel based on panelId
    const panel = await PanelModel.findOne({ panelId });

    if (!panel) {
      return res.status(404).json({ message: "Panel not found" });
    }

    // Find the PDC that contains the given panel
    const pdc = await PDCModel.findOne({
      panels: panel._id,
    }).populate("panels"); // Populate the 'panels' field

    if (!pdc) {
      return res
        .status(404)
        .json({ message: "PDC not found for the given panel" });
    }

    // Find the first Work Order that references this PDC
    const workOrder = await WorkOrderModel.findOne({
      pdcs: pdc._id,
    });

    // Extracting workOrderId from the found work order
    const workOrderId = workOrder ? workOrder.workOrderId : null;

    // Respond with the pdcId of the found PDC along with the populated 'panels'
    res.status(200).json({ pdcId: pdc.pdcId, workOrderId, panels: pdc.panels });
  } catch (error) {
    res
      .status(500)
      .json({ message: `Error retrieving PDCs for panelId: ${panelId}` });
  }
});

module.exports = router;
