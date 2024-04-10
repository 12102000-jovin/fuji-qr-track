const express = require("express");
const router = express.Router();
const PDCModel = require("../models/PDCModel");
const {
  PanelModel,
  LoadbankModel,
  LoadbankCatcherModel,
  PrimaryMCCBModel,
  CatcherMCCBModel,
} = require("../models/SubAssemblyModel");
const ComponentModel = require("../models/ComponentModel");

// router.post("/AllocateSubAssembly", async (req, res) => {
//   try {
//     const { inputPDCValue, inputPanelValue, inputLoadbankValue } = req.body;

//     if (inputPanelValue) {
//       const pdc = await PDCModel.findOne({
//         pdcId: `${inputPDCValue}`,
//       }).populate("panels");

//       if (!pdc) {
//         return res.status(404).json({ message: "PDC not found" });
//       }

//       // Check if Panel with inputPanelValue exists
//       const panel = await PanelModel.findOne({ panelId: inputPanelValue });

//       if (!panel) {
//         return res.status(404).json({ message: "Panel not found" });
//       }

//       // Set the allocated date for the panel
//       panel.allocatedDate = new Date();

//       // Associate the Panel with the PDC by adding its ObjectId to the panels array
//       pdc.panels.push(panel._id);

//       // Save both the panel and the updated PDC document
//       await panel.save();
//       await pdc.save();
//     }

//     if (inputLoadbankValue) {
//       const pdc = await PDCModel.findOne({
//         pdcId: `${inputPDCValue}`,
//       }).populate("loadbanks");

//       if (!pdc) {
//         return res.status(404).json({ message: "PDC not found" });
//       }

//       // Check if loadbank with inputLoadbankValue exists
//       const loadbank = await LoadbankModel.findOne({
//         loadbankId: inputLoadbankValue,
//       });

//       if (!loadbank) {
//         return res.status(404).json({ message: "Loadbank not found" });
//       }

//       // Set the allocated date for the panel
//       loadbank.allocatedDate = new Date();

//       // Associate the Panel with the PDC by adding its ObjectId to the panels array
//       pdc.loadbanks.push(loadbank._id);

//       // Save both the panel and the updated PDC document
//       await loadbank.save();
//       await pdc.save();
//     }

//     // Retrieve the updated PDC with populated loadbanks and panels
//     const updatedPDC = await PDCModel.findOne({
//       pdcId: inputPDCValue,
//     }).populate(["loadbanks", "panels"]);

//     // Respond with success message and the updated PDC
//     const response = "Subassembly allocation successful";
//     return res.status(200).json({ message: response, updatedPDC });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ error: "Internal Server Error" });
//   }
// });

router.post("/AllocateSubAssembly", async (req, res) => {
  try {
    const { inputPDCValue, subAssemblyInputValue } = req.body;

    const isPanelPattern = /^CPAN\d{6}$/.test(subAssemblyInputValue);
    const isLoadbankPattern = /^LB\d{6}-P$/.test(subAssemblyInputValue);
    const isLoadbankCatcherPattern = /^LB\d{6}-C$/.test(subAssemblyInputValue);
    const isMCCBPrimaryPattern = /^MCCBPAN\d{6}-P$/.test(subAssemblyInputValue);
    const isMCCBCatcherPattern = /^MCCBPAN\d{6}-C$/.test(subAssemblyInputValue);

    const pdc = await PDCModel.findOne({
      pdcId: `${inputPDCValue}`,
    });

    if (!pdc) {
      return res.status(404).json({ message: "PDC not found" });
    }

    if (isPanelPattern) {
      try {
        // Check if Panel exists
        const panel = await PanelModel.findOne({
          panelId: subAssemblyInputValue,
        });

        if (!panel) {
          return res.status(404).json({ message: "Control Panel not found" });
        }

        // Check if the panel already exists in the PDC
        if (pdc.panels.some((panelId) => panelId.equals(panel._id))) {
          return res.status(400).json({
            message: `The Control Panel already exists in ${pdc.pdcId}`,
          });
        }

        if (panel.isAllocated === true) {
          return res.status(404).json({
            message: `${panel.panelId} Control Panel has been allocated to other PDC`,
          });
        }

        if (pdc.panels.length > 0) {
          return res.status(400).json({
            message: `Other Control Panel already exists in the ${pdc.pdcId}`,
          });
        }

        // Set the allocated date for the panel
        panel.allocatedDate = new Date();

        // Set the isAllocated Flag to true
        panel.isAllocated = true;

        // Associate the Panel with the PDC by adding its ObjectId to the panels array
        pdc.panels.push(panel._id);

        // Save both the panel and the updated PDC document
        await panel.save();
        await pdc.save();

        const response = "Sub-Assembly allocation successful";
        return res.status(200).json({ message: response });
      } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
      }
    } else if (isLoadbankPattern) {
      try {
        // Check if Loadbank exists
        const loadbank = await LoadbankModel.findOne({
          loadbankId: subAssemblyInputValue,
        });

        if (!loadbank) {
          return res.status(404).json({ message: "Loadbank not found" });
        }

        // Check if the loadbank already exists in the PDC
        if (
          pdc.loadbanks.some((loadbankId) => loadbankId.equals(loadbank._id))
        ) {
          return res.status(400).json({
            message: `The Loadbank already exists in the ${pdc.pdcId}`,
          });
        }

        if (pdc.loadbanks.length > 0) {
          return res.status(400).json({
            message: `Other Loadbank (Primary) already exists in the ${pdc.pdcId}`,
          });
        }

        if (loadbank.isAllocated === true) {
          return res.status(404).json({
            message: `${loadbank.loadbankId} Loadbank (Primary) has been allocated to other PDC`,
          });
        }

        // Set the allocated date for the loadbank
        loadbank.allocatedDate = new Date();

        // Set the isAllocated Flag to true
        loadbank.isAllocated = true;

        // Associate the Loadbank with the PDC by adding its ObjectId to the loadbanks array
        pdc.loadbanks.push(loadbank._id);

        // Save both the loadbank and the updated PDC document
        await loadbank.save();
        await pdc.save();

        //  Respond with success message and the updated PDC
        const response = "Sub-Assembly allocation successful";
        return res.status(200).json({ message: response });
      } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
      }
    } else if (isLoadbankCatcherPattern) {
      try {
        // Check if Loadbank exists
        const loadbank = await LoadbankCatcherModel.findOne({
          loadbankId: subAssemblyInputValue,
        });

        if (!loadbank) {
          return res.status(404).json({ message: "Loadbank not found" });
        }

        // Check if the loadbank already exists in the PDC
        if (
          pdc.catcherLoadbanks.some((loadbankId) =>
            loadbankId.equals(loadbank._id)
          )
        ) {
          return res.status(400).json({
            message: `The Loadbank (Catcher) already exists in the ${pdc.pdcId}`,
          });
        }

        if (pdc.catcherLoadbanks.length > 0) {
          return res.status(400).json({
            message: `Other Loadbank (Catcher) already exists in the ${pdc.pdcId}`,
          });
        }

        if (loadbank.isAllocated === true) {
          return res.status(404).json({
            message: `${loadbank.loadbankId} Loadbank (Catcher) has been allocated to other PDC`,
          });
        }

        // Set the allocated date for the loadbank
        loadbank.allocatedDate = new Date();

        // Set the isAllocated Flag to true
        loadbank.isAllocated = true;

        // Associate the Loadbank with the PDC by adding its ObjectId to the loadbanks array
        pdc.catcherLoadbanks.push(loadbank._id);

        // Save both the loadbank and the updated PDC document
        await loadbank.save();
        await pdc.save();

        //  Respond with success message and the updated PDC
        const response = "Sub-Assembly allocation successful";
        return res.status(200).json({ message: response });
      } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
      }
    } else if (isMCCBPrimaryPattern) {
      try {
        // Check if MCCB exists
        const MCCB = await PrimaryMCCBModel.findOne({
          MCCBId: subAssemblyInputValue,
        });

        if (!MCCB) {
          return res.status(404).json({ message: "MCCB Panel not found" });
        }

        // Check if the MCCB already exists in the PDC
        if (pdc.primaryMCCBs.some((MCCBId) => MCCBId.equals(MCCB._id))) {
          return res.status(400).json({
            message: `The MCCB Panel already exists in the ${pdc.pdcId}`,
          });
        }

        if (pdc.primaryMCCBs.length > 0) {
          return res.status(400).json({
            message: `Other MCCB Panel (Primary) already exists in the ${pdc.pdcId}`,
          });
        }

        if (MCCB.isAllocated === true) {
          return res.status(404).json({
            message: `${MCCB.MCCBId} MCCB Panel (Primary) has been allocated to other PDC`,
          });
        }

        // Set the allocated date for the MCCB
        MCCB.allocatedDate = new Date();

        // Set the isAllocated Flag to true
        MCCB.isAllocated = true;

        // Associate the MCCB Panel with the PDC by adding its ObjectId to the MCCBs array
        pdc.primaryMCCBs.push(MCCB._id);

        // Save both the MCCB Panel and the updated PDC document
        await MCCB.save();
        await pdc.save();

        //  Respond with success message and the updated PDC
        const response = "Sub-Assembly allocation successful";
        return res.status(200).json({ message: response });
      } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
      }
    } else if (isMCCBCatcherPattern) {
      try {
        // Check if MCCB Panel exists
        const MCCB = await CatcherMCCBModel.findOne({
          MCCBId: subAssemblyInputValue,
        });

        if (!MCCB) {
          return res.status(404).json({ message: "MCCB Panel not found" });
        }

        // Check if the MCCB already exists in the PDC
        if (pdc.catcherMCCBs.some((MCCBId) => MCCBId.equals(MCCB._id))) {
          return res.status(400).json({
            message: `The MCCB Panel already exists in the ${pdc.pdcId}`,
          });
        }

        if (pdc.catcherMCCBs.length > 0) {
          return res.status(400).json({
            message: `Other MCCB Panel (Catcher) already exists in the ${pdc.pdcId}`,
          });
        }

        if (MCCB.isAllocated === true) {
          return res.status(404).json({
            message: `${MCCB.MCCBId} MCCB Panel (Catcher) has been allocated to other PDC`,
          });
        }

        // Set the allocated date for the MCCB
        MCCB.allocatedDate = new Date();

        // Set the isAllocated Flag to true
        MCCB.isAllocated = true;

        // Associate the MCCB Panel with the PDC by adding its ObjectId to the MCCBs array
        pdc.catcherMCCBs.push(MCCB._id);

        // Save both the MCCB Paneland the updated PDC document
        await MCCB.save();
        await pdc.save();

        //  Respond with success message and the updated PDC
        const response = "Sub-Assembly allocation successful";
        return res.status(200).json({ message: response });
      } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
      }
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/AllocatePanelComponent", async (req, res) => {
  try {
    const {
      componentSerialNumber,
      componentType,
      componentDescription,
      panelId,
    } = req.body;

    // Check if a component with the same serial number exists
    const existingComponent = await ComponentModel.findOne({
      componentSerialNumber,
    });

    if (existingComponent) {
      return res.status(409).json({
        message:
          "Component already allocated. Please select a different component.",
      });
    }

    // Check if a component with the same type is already allocated to the panel
    const panel = await PanelModel.findOne({ panelId }).populate("components");

    if (!panel) {
      return res.status(404).json({ message: "Panel not found" });
    }

    const existingComponentType = panel.components.find(
      (component) => component.componentType === componentType
    );

    if (existingComponentType) {
      return res.status(409).json({
        message: `${existingComponentType.componentType} with serial number [${existingComponentType.componentSerialNumber}] is already allocated to the panel. Please choose another component.`,
      });
    }

    // If there are no existing components, proceed to insert new components
    const component = new ComponentModel({
      componentSerialNumber,
      componentType,
      componentDescription,
      allocatedDate: new Date(),
    });

    await component.save();

    panel.components.push(component._id);
    await panel.save();

    return res
      .status(200)
      .json({ message: "Component allocated to Panel successfully" });
  } catch (error) {
    console.error("Error in allocation:", error);
    // Handle the error and send an appropriate response
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/AllocateLoadbankComponent", async (req, res) => {
  try {
    const {
      componentSerialNumber,
      componentType,
      componentDescription,
      loadbankId,
    } = req.body;

    const existingComponent = await ComponentModel.findOne({
      componentSerialNumber,
    });

    if (existingComponent) {
      return res.status(409).json({
        message:
          "Component already allocated. Please select a different component.",
      });
    }

    // Check if a component with the same type is already allocated to the loadbank
    const loadbank = await LoadbankModel.findOne({ loadbankId }).populate(
      "components"
    );

    if (!loadbank) {
      return res.status(404).json({ message: "Loadbank not found" });
    }

    const existingComponentType = loadbank.components.find(
      (component) => component.componentType === componentType
    );

    if (existingComponentType) {
      return res.status(409).json({
        message: `${existingComponentType.componentType} with serial number [${existingComponentType.componentSerialNumber}] is already allocated to the loadbank. Please choose another component.`,
      });
    }

    // If there are no existing components, proceed to insert new components
    const component = new ComponentModel({
      componentSerialNumber,
      componentType,
      componentDescription,
      allocatedDate: new Date(),
    });

    await component.save();

    loadbank.components.push(component._id);
    await loadbank.save();

    return res
      .status(200)
      .json({ message: "Component allocated to the Loadbank successfully " });
  } catch (error) {
    console.error("Error in allocation:", error);
    // Handle the error and send an appropriate response
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/AllocateLoadbankCatcherComponent", async (req, res) => {
  try {
    const {
      componentSerialNumber,
      componentType,
      componentDescription,
      loadbankId,
    } = req.body;

    const existingComponent = await ComponentModel.findOne({
      componentSerialNumber,
    });

    if (existingComponent) {
      return res.status(409).json({
        message:
          "Component already allocated. Please select a different component.",
      });
    }

    // Check if a component with the same type is already allocated to the loadbank
    const loadbank = await LoadbankCatcherModel.findOne({
      loadbankId,
    }).populate("components");

    if (!loadbank) {
      return res.status(404).json({ message: "Loadbank not found" });
    }

    const existingComponentType = loadbank.components.find(
      (component) => component.componentType === componentType
    );

    if (existingComponentType) {
      return res.status(409).json({
        message: `${existingComponentType.componentType} with serial number [${existingComponentType.componentSerialNumber}] is already allocated to the loadbank. Please choose another component.`,
      });
    }

    // If there are no existing components, proceed to insert new components
    const component = new ComponentModel({
      componentSerialNumber,
      componentType,
      componentDescription,
      allocatedDate: new Date(),
    });

    await component.save();

    loadbank.components.push(component._id);
    await loadbank.save();

    return res
      .status(200)
      .json({ message: "Component allocated to the Loadbank successfully " });
  } catch (error) {
    console.error("Error in allocation:", error);
    // Handle the error and send an appropriate response
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/AllocateMCCBPrimaryComponent", async (req, res) => {
  try {
    const {
      componentSerialNumber,
      componentType,
      componentDescription,
      MCCBId,
    } = req.body;

    const existingComponent = await ComponentModel.findOne({
      componentSerialNumber,
    });

    if (existingComponent) {
      return res.status(409).json({
        message:
          "Component already allocated. Please select a different component.",
      });
    }

    // Check if a component with the same type is already allocated to the MCCB
    const MCCB = await PrimaryMCCBModel.findOne({ MCCBId }).populate(
      "components"
    );

    if (!MCCB) {
      return res.status(404).json({ message: "Panel not found" });
    }

    const existingComponentType = MCCB.components.find(
      (component) => component.componentType === componentType
    );

    if (existingComponentType) {
      return res.status(409).json({
        message: `${existingComponentType.componentType} with serial number [${existingComponentType.componentSerialNumber}] is already allocated to the MCCB. Please choose another component.`,
      });
    }

    // If there are no existing components, proceed to insert new components
    const component = new ComponentModel({
      componentSerialNumber,
      componentType,
      componentDescription,
      allocatedDate: new Date(),
    });

    await component.save();

    MCCB.components.push(component._id);
    await MCCB.save();

    return res
      .status(200)
      .json({ message: "Component allocated to the MCCB Panel successfully " });
  } catch (error) {
    console.error("Error in allocation:", error);
    // Handle the error and send an appropriate response
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/AllocateMCCBCatcherComponent", async (req, res) => {
  try {
    const {
      componentSerialNumber,
      componentType,
      componentDescription,
      MCCBId,
    } = req.body;

    const existingComponent = await ComponentModel.findOne({
      componentSerialNumber,
    });

    if (existingComponent) {
      return res.status(409).json({
        message:
          "Component already allocated. Please select a different component.",
      });
    }

    // Check if a component with the same type is already allocated to the MCCB
    const MCCB = await CatcherMCCBModel.findOne({ MCCBId }).populate(
      "components"
    );

    if (!MCCB) {
      return res.status(404).json({ message: "MCCB Panel not found" });
    }

    const existingComponentType = MCCB.components.find(
      (component) => component.componentType === componentType
    );

    if (existingComponentType) {
      return res.status(409).json({
        message: `${existingComponentType.componentType} with serial number [${existingComponentType.componentSerialNumber}] is already allocated to the MCCB. Please choose another component.`,
      });
    }

    // If there are no existing components, proceed to insert new components
    const component = new ComponentModel({
      componentSerialNumber,
      componentType,
      componentDescription,
      allocatedDate: new Date(),
    });

    await component.save();

    MCCB.components.push(component._id);
    await MCCB.save();

    return res
      .status(200)
      .json({ message: "Component allocated to the MCCB Panel successfully " });
  } catch (error) {
    console.error("Error in allocation:", error);
    // Handle the error and send an appropriate response
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
