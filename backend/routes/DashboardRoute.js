const express = require("express");

const router = express.Router();

const PDCModel = require("../models/PDCModel");
const {
  PanelModel,
  LoadbankModel,
  LoadbankCatcherModel,
  PrimaryMCCBModel,
} = require("../models/SubAssemblyModel");
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

    const catcherLoadbanks = await LoadbankCatcherModel.find({
      _id: { $in: pdc.catcherLoadbanks },
    });

    const primaryMCCBs = await PrimaryMCCBModel.find({
      _id: { $in: pdc.primaryMCCBs },
    });

    // Find the first Work Order that references this PDC
    const workOrder = await WorkOrderModel.findOne({
      pdcs: pdc._id,
    });

    // Extracting workOrderId from the found work order
    const workOrderId = workOrder ? workOrder.workOrderId : null;

    // Send an object with both panels and workOrderId
    res
      .status(200)
      .json({ panels, loadbanks, catcherLoadbanks, workOrderId, primaryMCCBs });
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
      allocatedDate: component.allocatedDate,
    }));

    // Find the PDC that contains the given panel
    const pdc = await PDCModel.findOne({
      panels: panel._id,
    }).populate("panels"); // Populate the 'panels' field

    if (!pdc) {
      console.log("PDC not found for the given panel"); // Optionally log the message
    }

    // Find the first Work Order that references this PDC
    const workOrder = await WorkOrderModel.findOne({
      pdcs: pdc ? pdc._id : null, // Pass null if pdc is not found
    });

    // Extracting workOrderId from the found work order
    const workOrderId = workOrder ? workOrder.workOrderId : null;

    // Respond with the pdcId of the found PDC along with the populated 'panels'
    res.status(200).json({
      pdcId: pdc ? pdc.pdcId : null, // Pass null if pdc is not found
      workOrderId,
      panels: pdc ? pdc.panels : null, // Pass null if pdc is not found
      componentData,
    });
  } catch (error) {
    res.status(500).json({ message: `Error retrieving PDCs for panelId` });
  }
});

// L O A D B A N K (P R I M A R Y)
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
      allocatedDate: component.allocatedDate,
    }));

    // Find the PDC that contains the given loadbank
    const pdc = await PDCModel.findOne({
      $or: [{ loadbanks: loadbank._id }, { catcherLoadbanks: loadbank._id }],
    }).populate("loadbanks");

    if (!pdc) {
      console.log("PDC not found for the given panel");
    }

    // Find the first Work Order that references this PDC
    const workOrder = await WorkOrderModel.findOne({
      pdcs: pdc ? pdc._id : null, // Pass null if pdc is not found
    });
    // Extracting workOrderId from the found work order
    const workOrderId = workOrder ? workOrder.workOrderId : null;

    // Respond with the pdcId of the found PDC along with the populated 'loadbanks'
    res.status(200).json({
      pdcId: pdc ? pdc.pdcId : null,
      workOrderId,
      loadbanks: pdc ? pdc.loadbanks : null,
      componentData,
    });
  } catch (error) {
    res.status(500).json({ message: `Error retrieving PDCs for loadbank` });
  }
});

// L O A D B A N K (C A T C H E R)
router.get("/:loadbankId/showLoadbankCatcherDashboard", async (req, res) => {
  try {
    const { loadbankId } = req.params;

    // Find loadbank based on loadbankId
    const loadbank = await LoadbankCatcherModel.findOne({ loadbankId });

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
      allocatedDate: component.allocatedDate,
    }));

    // Find the PDC that contains the given loadbank
    const pdc = await PDCModel.findOne({
      $or: [{ loadbanks: loadbank._id }, { catcherLoadbanks: loadbank._id }],
    }).populate("loadbanks");

    if (!pdc) {
      console.log("PDC not found for the given panel");
    }

    // Find the first Work Order that references this PDC
    const workOrder = await WorkOrderModel.findOne({
      pdcs: pdc ? pdc._id : null, // Pass null if pdc is not found
    });
    // Extracting workOrderId from the found work order
    const workOrderId = workOrder ? workOrder.workOrderId : null;

    // Respond with the pdcId of the found PDC along with the populated 'loadbanks'
    res.status(200).json({
      pdcId: pdc ? pdc.pdcId : null,
      workOrderId,
      loadbanks: pdc ? pdc.loadbanks : null,
      componentData,
    });
  } catch (error) {
    res.status(500).json({ message: `Error retrieving PDCs for loadbank` });
  }
});

// M C C B (P R I M A R Y)
router.get("/:MCCBId/showMCCBPrimaryDashboard", async (req, res) => {
  try {
    const { MCCBId } = req.params;

    // Find MCCB based on MCCBId
    const MCCB = await PrimaryMCCBModel.findOne({ MCCBId });

    console.log(MCCB);

    if (!MCCB) {
      return res.status(404).json({ message: "MCCB not found" });
    }

    // Extract the component _id referenced in the MCCB
    const componentIds = MCCB.components.map((component) => component._id);

    // Find components in the ComponentModel matching the extracted component _ids
    const components = await ComponentModel.find({
      _id: { $in: componentIds },
    });

    const componentData = components.map((component) => ({
      componentType: component.componentType,
      componentSerialNumber: component.componentSerialNumber,
      allocatedDate: component.allocatedDate,
    }));

    // Find the PDC that contains the given MCCB
    const pdc = await PDCModel.findOne({
      primaryMCCBs: MCCB._id,
    }).populate("primaryMCCBs");

    if (!pdc) {
      console.log("PDC not found for the given panel");
    }

    // Find the first Work Order that references this PDC
    const workOrder = await WorkOrderModel.findOne({
      pdcs: pdc ? pdc._id : null, // Pass null if pdc is not found
    });
    // Extracting workOrderId from the found work order
    const workOrderId = workOrder ? workOrder.workOrderId : null;

    // Respond with the pdcId of the found PDC along with the populated 'MCCBs'
    res.status(200).json({
      pdcId: pdc ? pdc.pdcId : null,
      workOrderId,
      MCCBs: pdc ? pdc.MCCBs : null,
      componentData,
    });
  } catch (error) {
    res.status(500).json({ message: `Error retrieving PDCs for MCCB` });
  }
});

router.get(
  "/:componentSerialNumber/showComponentDashboard",
  async (req, res) => {
    try {
      const { componentSerialNumber } = req.params;

      // Find the component based on the componentSerialNumber
      const component = await ComponentModel.findOne({ componentSerialNumber });

      if (!component) {
        return res.status(400).json({ message: "Component not found" });
      }

      const componentObjectId = component._id;

      // Find the Panel that contains the specified component
      const panel = await PanelModel.findOne({
        components: componentObjectId,
      }).populate("components");

      // Find the Loadbank that contains the specified component
      const loadbank = await LoadbankModel.findOne({
        components: componentObjectId,
      }).populate("components");

      // Find the Loadbank that contains the specified component
      const loadbankCatcher = await LoadbankCatcherModel.findOne({
        components: componentObjectId,
      }).populate("components");

      // Check if the component is part of a Panel or a Loadbank
      if (panel) {
        // Include panelId in the response
        const panelId = panel.panelId;
        const subAssemblyType = "Panel";

        // Get the object id of the panel
        const panelObjectId = panel._id;

        // Find the PDC that contains the specified panel
        const PDC = await PDCModel.findOne({
          panels: panelObjectId,
        }).populate("panels");

        let pdcId = null;
        let workOrderId = null;

        // If PDC exists, get its properties
        if (PDC) {
          // Get the object id of the pdc
          pdcId = PDC.pdcId;

          // Get the object id of the pdc
          const pdcObjectId = PDC._id;

          const WorkOrder = await WorkOrderModel.findOne({
            pdcs: pdcObjectId,
          }).populate("pdcs");

          workOrderId = WorkOrder.workOrderId;
        }

        res.json({
          component,
          panelId,
          pdcId,
          workOrderId,
          subAssemblyType,
        });
      } else if (loadbank) {
        // Include loadbankId in the response
        const loadbankId = loadbank.loadbankId;
        const subAssemblyType = "Loadbank";

        // Get the object id of the loadbank
        const loadbankObjectId = loadbank._id;

        // Find the PDC that contains the specified loadbank
        const PDC = await PDCModel.findOne({
          loadbanks: loadbankObjectId,
        }).populate("loadbanks");

        let pdcId = null;
        let workOrderId = null;

        // If PDC exists, get its properties
        if (PDC) {
          // Get the object id of the pdc
          pdcId = PDC.pdcId;

          // Get the object id of the pdc
          const pdcObjectId = PDC._id;

          const WorkOrder = await WorkOrderModel.findOne({
            pdcs: pdcObjectId,
          }).populate("pdcs");

          workOrderId = WorkOrder.workOrderId;
        }

        res.json({
          component,
          loadbankId,
          pdcId,
          workOrderId,
          subAssemblyType,
        });
      } else if (loadbankCatcher) {
        console.log("Iasdasf");
        // Include loadbankId in the response
        const loadbankId = loadbankCatcher.loadbankId;
        const subAssemblyType = "Loadbank";

        // Get the object id of the loadbank
        const loadbankObjectId = loadbankCatcher._id;

        // Find the PDC that contains the specified loadbank
        const PDC = await PDCModel.findOne({
          catcherLoadbanks: loadbankObjectId,
        }).populate("catcherLoadbanks");

        let pdcId = null;
        let workOrderId = null;

        // If PDC exists, get its properties
        if (PDC) {
          // Get the object id of the pdc
          pdcId = PDC.pdcId;

          // Get the object id of the pdc
          const pdcObjectId = PDC._id;

          const WorkOrder = await WorkOrderModel.findOne({
            pdcs: pdcObjectId,
          }).populate("pdcs");

          workOrderId = WorkOrder.workOrderId;
        }

        res.json({
          component,
          loadbankId,
          pdcId,
          workOrderId,
          subAssemblyType,
        });
      } else {
        return res
          .status(404)
          .json({ message: "Panel or Loadbank not found for the component" });
      }
    } catch (error) {
      console.error("Error retrieving Component Data:", error);
      res.status(500).json({ message: `Error retrieving Component Data` });
    }
  }
);

module.exports = router;
