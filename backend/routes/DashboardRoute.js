const express = require("express");

const router = express.Router();

const PDCModel = require("../models/PDCModel");
const {
  PanelModel,
  LoadbankModel,
  LoadbankCatcherModel,
  PrimaryMCCBModel,
  CatcherMCCBModel,
  CTInterfaceLeftModel,
  CTInterfaceRightModel,
  ChassisRailLeftPrimaryModel,
  ChassisRailRightPrimaryModel,
  ChassisRailLeftCatcherModel,
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

    const catcherMCCBs = await CatcherMCCBModel.find({
      _id: { $in: pdc.catcherMCCBs },
    });

    const leftCTInterfaces = await CTInterfaceLeftModel.find({
      _id: { $in: pdc.leftCTInterfaces },
    });

    const rightCTInterfaces = await CTInterfaceRightModel.find({
      _id: { $in: pdc.rightCTInterfaces },
    });

    const leftPrimaryChassisRails = await ChassisRailLeftPrimaryModel.find({
      _id: { $in: pdc.leftPrimaryChassisRails },
    });

    const rightPrimaryChassisRails = await ChassisRailRightPrimaryModel.find({
      _id: { $in: pdc.rightPrimaryChassisRails },
    });

    const leftCatcherChassisRails = await ChassisRailLeftCatcherModel.find({
      _id: { $in: pdc.leftCatcherChassisRails },
    });

    // Find the first Work Order that references this PDC
    const workOrder = await WorkOrderModel.findOne({
      pdcs: pdc._id,
    });

    // Extracting workOrderId from the found work order
    const workOrderId = workOrder ? workOrder.workOrderId : null;

    // Send an object with both panels and workOrderId
    res.status(200).json({
      panels,
      loadbanks,
      catcherLoadbanks,
      workOrderId,
      primaryMCCBs,
      catcherMCCBs,
      leftCTInterfaces,
      rightCTInterfaces,
      leftPrimaryChassisRails,
      rightPrimaryChassisRails,
      leftCatcherChassisRails,
    });
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

    // Find MCCB Panel based on MCCBId
    const MCCB = await PrimaryMCCBModel.findOne({ MCCBId });

    console.log(MCCB);

    if (!MCCB) {
      return res.status(404).json({ message: "MCCB Panel not found" });
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
    res.status(500).json({ message: `Error retrieving PDCs for MCCB Panel` });
  }
});

// M C C B (C A T C H E R)
router.get("/:MCCBId/showMCCBCatcherDashboard", async (req, res) => {
  try {
    const { MCCBId } = req.params;

    // Find MCCB Panel based on MCCBId
    const MCCB = await CatcherMCCBModel.findOne({ MCCBId });

    console.log(MCCB);

    if (!MCCB) {
      return res.status(404).json({ message: "MCCB Panel not found" });
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
      catcherMCCBs: MCCB._id,
    }).populate("catcherMCCBs");

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

// C T I N T E R F A C E (L E F T)
router.get("/:CTId/showLeftCTInterfaceDashboard", async (req, res) => {
  try {
    const { CTId } = req.params;

    // Find CT Interface Panel based on CTId
    const CTInterface = await CTInterfaceLeftModel.findOne({ CTId });

    console.log(CTInterface);

    if (!CTInterface) {
      return res.status(404).json({ message: "CT Interface not found" });
    }

    // Extract the component _id referenced in the CT Interface
    const componentIds = CTInterface.components.map(
      (component) => component._id
    );

    // Find components in the ComponentModel matching the extracted component _ids
    const components = await ComponentModel.find({
      _id: { $in: componentIds },
    });

    const componentData = components.map((component) => ({
      componentType: component.componentType,
      componentSerialNumber: component.componentSerialNumber,
      allocatedDate: component.allocatedDate,
    }));

    // Find the PDC that contains the given CT Interface
    const pdc = await PDCModel.findOne({
      leftCTInterfaces: CTInterface._id,
    }).populate("leftCTInterfaces");

    if (!pdc) {
      console.log("PDC not found for the given CTInterface");
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
      leftCTInterfaces: pdc ? pdc.leftCTInterfaces : null,
      componentData,
    });
  } catch (error) {
    res.status(500).json({ message: `Error retrieving PDCs for CT Interface` });
  }
});

// C T I N T E R F A C E (R I G H T)
router.get("/:CTId/showRightCTInterfaceDashboard", async (req, res) => {
  try {
    const { CTId } = req.params;

    // Find CT Interface Panel based on CTId
    const CTInterface = await CTInterfaceRightModel.findOne({ CTId });

    console.log(CTInterface);

    if (!CTInterface) {
      return res.status(404).json({ message: "CT Interface not found" });
    }

    // Extract the component _id referenced in the CT Interface
    const componentIds = CTInterface.components.map(
      (component) => component._id
    );

    // Find components in the ComponentModel matching the extracted component _ids
    const components = await ComponentModel.find({
      _id: { $in: componentIds },
    });

    const componentData = components.map((component) => ({
      componentType: component.componentType,
      componentSerialNumber: component.componentSerialNumber,
      allocatedDate: component.allocatedDate,
    }));

    // Find the PDC that contains the given CT Interface
    const pdc = await PDCModel.findOne({
      rightCTInterfaces: CTInterface._id,
    }).populate("rightCTInterfaces");

    if (!pdc) {
      console.log("PDC not found for the given CTInterface");
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
      rightCTInterfaces: pdc ? pdc.rightCTInterfaces : null,
      componentData,
    });
  } catch (error) {
    res.status(500).json({ message: `Error retrieving PDCs for CT Interface` });
  }
});

// C H A S S I S  R A I L  (L E F T) (P R I M A R Y)
router.get(
  "/:chassisId/showLeftPrimaryChassisRailDashboard",
  async (req, res) => {
    try {
      const { chassisId } = req.params;

      // Find Chassis Rail Panel based on chassisId
      const ChassisRail = await ChassisRailLeftPrimaryModel.findOne({
        chassisId,
      });

      console.log(ChassisRail);

      if (!ChassisRail) {
        return res.status(404).json({ message: "Chassis Rail not found" });
      }

      // Extract the component _id referenced in the Chassis Rail
      const componentIds = ChassisRail.components.map(
        (component) => component._id
      );

      // Find components in the ComponentModel matching the extracted component _ids
      const components = await ComponentModel.find({
        _id: { $in: componentIds },
      });

      const componentData = components.map((component) => ({
        componentType: component.componentType,
        componentSerialNumber: component.componentSerialNumber,
        allocatedDate: component.allocatedDate,
      }));

      // Find the PDC that contains the given Chassis Rail
      const pdc = await PDCModel.findOne({
        leftPrimaryChassisRails: ChassisRail._id,
      }).populate("leftPrimaryChassisRails");

      if (!pdc) {
        console.log("PDC not found for the given Chassis Rail");
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
        leftPrimaryChassisRails: pdc ? pdc.leftPrimaryChassisRails : null,
        componentData,
      });
    } catch (error) {
      res
        .status(500)
        .json({ message: `Error retrieving PDCs for CT Interface` });
    }
  }
);

// C H A S S I S  R A I L  (R I G H T) (P R I M A R Y)
router.get(
  "/:chassisId/showRightPrimaryChassisRailDashboard",
  async (req, res) => {
    try {
      const { chassisId } = req.params;

      // Find Chassis Rail Panel based on chassisId
      const ChassisRail = await ChassisRailRightPrimaryModel.findOne({
        chassisId,
      });

      console.log(ChassisRail);

      if (!ChassisRail) {
        return res.status(404).json({ message: "Chassis Rail not found" });
      }

      // Extract the component _id referenced in the Chassis Rail
      const componentIds = ChassisRail.components.map(
        (component) => component._id
      );

      // Find components in the ComponentModel matching the extracted component _ids
      const components = await ComponentModel.find({
        _id: { $in: componentIds },
      });

      const componentData = components.map((component) => ({
        componentType: component.componentType,
        componentSerialNumber: component.componentSerialNumber,
        allocatedDate: component.allocatedDate,
      }));

      // Find the PDC that contains the given Chassis Rail
      const pdc = await PDCModel.findOne({
        rightPrimaryChassisRails: ChassisRail._id,
      }).populate("rightPrimaryChassisRails");

      if (!pdc) {
        console.log("PDC not found for the given Chassis Rail");
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
        rightPrimaryChassisRails: pdc ? pdc.rightPrimaryChassisRails : null,
        componentData,
      });
    } catch (error) {
      res
        .status(500)
        .json({ message: `Error retrieving PDCs for CT Interface` });
    }
  }
);

// C H A S S I S  R A I L  (L E F T) (C A T C H E R)
router.get(
  "/:chassisId/showLeftCatcherChassisRailDashboard",
  async (req, res) => {
    try {
      const { chassisId } = req.params;

      // Find Chassis Rail Panel based on chassisId
      const ChassisRail = await ChassisRailLeftCatcherModel.findOne({
        chassisId,
      });

      console.log(ChassisRail);

      if (!ChassisRail) {
        return res.status(404).json({ message: "Chassis Rail not found" });
      }

      // Extract the component _id referenced in the Chassis Rail
      const componentIds = ChassisRail.components.map(
        (component) => component._id
      );

      // Find components in the ComponentModel matching the extracted component _ids
      const components = await ComponentModel.find({
        _id: { $in: componentIds },
      });

      const componentData = components.map((component) => ({
        componentType: component.componentType,
        componentSerialNumber: component.componentSerialNumber,
        allocatedDate: component.allocatedDate,
      }));

      // Find the PDC that contains the given Chassis Rail
      const pdc = await PDCModel.findOne({
        leftCatcherChassisRails: ChassisRail._id,
      }).populate("leftCatcherChassisRails");

      if (!pdc) {
        console.log("PDC not found for the given Chassis Rail");
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
        leftCatcherChassisRails: pdc ? pdc.leftCatcherChassisRails : null,
        componentData,
      });
    } catch (error) {
      res
        .status(500)
        .json({ message: `Error retrieving PDCs for CT Interface` });
    }
  }
);

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

      // Find the MCCB Panel that contains the specified component
      const MCCBPrimary = await PrimaryMCCBModel.findOne({
        components: componentObjectId,
      }).populate("components");

      // Find the MCCB Panel that contains the specified component
      const MCCBCatcher = await CatcherMCCBModel.findOne({
        components: componentObjectId,
      }).populate("components");

      // Find the CT Interface that contains the specified component
      const LeftCTInterface = await CTInterfaceLeftModel.findOne({
        components: componentObjectId,
      }).populate("components");

      // Find the CT Interface that contains the specified component
      const RightCTInterface = await CTInterfaceRightModel.findOne({
        components: componentObjectId,
      }).populate("components");

      // Find the Chassis Rail that contains the specified component
      const LeftPrimaryChassisRail = await ChassisRailLeftPrimaryModel.findOne({
        components: componentObjectId,
      }).populate("components");

      // Find the Chassis Rail that contains the specified component
      const RightPrimaryChassisRail =
        await ChassisRailRightPrimaryModel.findOne({
          components: componentObjectId,
        }).populate("components");

      // Find the Chassis Rail that contains the specified component
      const LeftCatcherChassisRail = await ChassisRailLeftCatcherModel.findOne({
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
      } else if (MCCBPrimary) {
        // Include MCCB Panel Id in the response
        const MCCBId = MCCBPrimary.MCCBId;
        const subAssemblyType = "MCCB Panel";

        // Get the object id of the MCCB
        const MCCBObjectId = MCCBPrimary._id;

        // Find the PDC that contains the specified MCCB
        const PDC = await PDCModel.findOne({
          primaryMCCBs: MCCBObjectId,
        }).populate("primaryMCCBs");

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
          MCCBId,
          pdcId,
          workOrderId,
          subAssemblyType,
        });
      } else if (MCCBCatcher) {
        // Include MCCB Id in the response
        const MCCBId = MCCBCatcher.MCCBId;
        const subAssemblyType = "MCCB Panel";

        // Get the object id of the MCCB
        const MCCBObjectId = MCCBCatcher._id;

        // Find the PDC that contains the specified MCCB
        const PDC = await PDCModel.findOne({
          catcherMCCBs: MCCBObjectId,
        }).populate("catcherMCCBs");

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
          MCCBId,
          pdcId,
          workOrderId,
          subAssemblyType,
        });
      } else if (LeftCTInterface) {
        // Include CT Id in the response
        const CTId = LeftCTInterface.CTId;
        const subAssemblyType = "CT Interface (Left)";

        // Get the object id of the CTInterface
        const CTObjectId = LeftCTInterface._id;

        // Find the PDC that contains the specified CTInterface
        const PDC = await PDCModel.findOne({
          leftCTInterfaces: CTObjectId,
        }).populate("leftCTInterfaces");

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
          CTId,
          pdcId,
          workOrderId,
          subAssemblyType,
        });
      } else if (RightCTInterface) {
        // Include CT Id in the response
        const CTId = RightCTInterface.CTId;
        const subAssemblyType = "CT Interface (Right)";

        // Get the object id of the CTInterface
        const CTObjectId = RightCTInterface._id;

        // Find the PDC that contains the specified CTInterface
        const PDC = await PDCModel.findOne({
          rightCTInterfaces: CTObjectId,
        }).populate("rightCTInterfaces");

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
          CTId,
          pdcId,
          workOrderId,
          subAssemblyType,
        });
      } else if (LeftPrimaryChassisRail) {
        // Include ChassisId Id in the response
        const chassisId = LeftPrimaryChassisRail.chassisId;
        const subAssemblyType = "Chassis Rail (Left) (Primary)";

        // Get the object id of the chassis rail
        const chassisRailObjectId = LeftPrimaryChassisRail._id;

        // Find the PDC that contains the specified CTInterface
        const PDC = await PDCModel.findOne({
          leftPrimaryChassisRails: chassisRailObjectId,
        }).populate("leftPrimaryChassisRails");

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
          chassisId,
          pdcId,
          workOrderId,
          subAssemblyType,
        });
      } else if (RightPrimaryChassisRail) {
        // Include ChassisId Id in the response
        const chassisId = RightPrimaryChassisRail.chassisId;
        const subAssemblyType = "Chassis Rail (Right) (Primary)";

        // Get the object id of the chassis rail
        const chassisRailObjectId = RightPrimaryChassisRail._id;

        // Find the PDC that contains the specified CTInterface
        const PDC = await PDCModel.findOne({
          rightPrimaryChassisRails: chassisRailObjectId,
        }).populate("rightPrimaryChassisRails");

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
          chassisId,
          pdcId,
          workOrderId,
          subAssemblyType,
        });
      } else if (LeftCatcherChassisRail) {
        // Include ChassisId Id in the response
        const chassisId = LeftCatcherChassisRail.chassisId;
        const subAssemblyType = "Chassis Rail (Left) (Catcher)";

        // Get the object id of the chassis rail
        const chassisRailObjectId = LeftCatcherChassisRail._id;

        // Find the PDC that contains the specified CTInterface
        const PDC = await PDCModel.findOne({
          leftCatcherChassisRails: chassisRailObjectId,
        }).populate("leftCatcherChassisRails");

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
          chassisId,
          pdcId,
          workOrderId,
          subAssemblyType,
        });
      } else {
        return res.status(404).json({ message: "Not Found" });
      }
    } catch (error) {
      console.error("Error retrieving Component Data:", error);
      res.status(500).json({ message: `Error retrieving Component Data` });
    }
  }
);

module.exports = router;
