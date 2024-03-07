const express = require("express");

const router = express.Router();

const PDCModel = require("../models/PDCModel");
const { PanelModel, LoadbankModel } = require("../models/SubAssemblyModel");
const WorkOrderModel = require("../models/WorkOrderModel");
const ComponentModel = require("../models/ComponentModel");

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

    const loadbanks = await LoadbankModel.find({
      _id: { $in: pdc.loadbanks },
    });

    // Find the first Work Order that references this PDC
    const workOrder = await WorkOrderModel.findOne({
      pdcs: pdc._id,
    });

    // Extracting workOrderId from the found work order
    const workOrderId = workOrder ? workOrder.workOrderId : null;

    // Send an object with both panels and workOrderId
    res.status(200).json({ panels, loadbanks, workOrderId });
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

    // Extract the component _id referenced in the panel
    const componentIds = panel.components.map((component) => component._id);

    // Find components in ComponentModel matching the extracted component _ids
    const components = await ComponentModel.find({
      _id: { $in: componentIds },
    });

    const componentData = components.map((component) => ({
      componentType: component.componentType,
      componentSerialNumber: component.componentSerialNumber,
    }));

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
    res.status(200).json({
      pdcId: pdc.pdcId,
      workOrderId,
      panels: pdc.panels,
      componentData,
    });
  } catch (error) {
    res.status(500).json({ message: `Error retrieving PDCs for panelId` });
  }
});

router.get("/:loadbankId/showLoadbankDashboard", async (req, res) => {
  try {
    const { loadbankId } = req.params;

    // Find loadbank based on loadbankId
    const loadbank = await LoadbankModel.findOne({ loadbankId });

    if (!loadbank) {
      return res.status(404).json({ message: "Loadbank not found" });
    }

    // Extract the component _id referenced in the loadbank
    const componentIds = loadbank.components.map((component) => component._id);

    // Find components in the ComponentModel matching the extracted component _ids
    const components = await ComponentModel.find({
      _id: { $in: componentIds },
    });

    const componentData = components.map((component) => ({
      componentType: component.componentType,
      componentSerialNumber: component.componentSerialNumber,
    }));

    // Find the PDC that contains the given loadbank
    const pdc = await PDCModel.findOne({
      loadbanks: loadbank._id,
    }).populate("loadbanks");

    if (!pdc) {
      return res
        .status(404)
        .json({ message: "PDC not found for the given loadbank" });
    }

    // Find the first Work Order that references this PDC
    const workOrder = await WorkOrderModel.findOne({
      pdcs: pdc._id,
    });
    // Extracting workOrderId from the found work order
    const workOrderId = workOrder ? workOrder.workOrderId : null;

    // Respond with the pdcId of the found PDC along with the populated 'loadbanks'
    res.status(200).json({
      pdcId: pdc.pdcId,
      workOrderId,
      loadbanks: pdc.loadbanks,
      componentData,
    });
  } catch (error) {
    res.status(500).json({ message: `Error retrieving PDCs for loadbank` });
  }
});

router.get(
  "/:componentSerialNumber/showComponentDashboard",
  async (req, res) => {
    try {
      const { componentSerialNumber } = req.params;

      // Find the component based on tje componentSerialNumber
      const component = await ComponentModel.findOne({ componentSerialNumber });

      if (!component) {
        return res.status(400).json({ message: "Component not found" });
      }

      const componentObjectId = component._id;

      // Find the Panel that contains the specified component
      const panel = await PanelModel.findOne({
        components: componentObjectId,
      }).populate("components");

      // Check if a matching Panel was found
      if (!panel) {
        return res
          .status(404)
          .json({ message: "Panel not found for the component" });
      }

      // Include panelId in the response
      const panelId = panel.panelId;
      const subAssemblyType = "Panel";

      // Get the object id of the panel
      const panelObjectId = panel._id;

      const PDC = await PDCModel.findOne({
        panels: panelObjectId,
      }).populate("panels");

      // Get the object id of the pdc
      const pdcId = PDC.pdcId;

      // Get the object id of the pdc
      const pdcObjectId = PDC._id;

      const WorkOrder = await WorkOrderModel.findOne({
        pdcs: pdcObjectId,
      }).populate("pdcs");

      const workOrderId = WorkOrder.workOrderId;

      res.json({
        component,
        panelId,
        pdcId,
        workOrderId,
        subAssemblyType,
      });
    } catch (error) {
      res.status(500).json({ message: `Error retrieving Component Data` });
    }
  }
);

module.exports = router;
