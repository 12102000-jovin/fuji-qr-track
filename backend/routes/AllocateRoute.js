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
  ChassisRailRightCatcherModel,
  RoofPrimaryModel,
  RoofCatcherModel,
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
    const isCTInterfaceLeftPattern = /^CT\d{6}L-P$/.test(subAssemblyInputValue);
    const isCTInterfaceRightPattern = /^CT\d{6}R-P$/.test(
      subAssemblyInputValue
    );
    const isChassisRailLeftPrimaryPattern = /^CHR\d{6}L-P$/.test(
      subAssemblyInputValue
    );
    const isChassisRailRightPrimaryPattern = /^CHR\d{6}R-P$/.test(
      subAssemblyInputValue
    );
    const isChassisRailLeftCatcherPattern = /^CHR\d{6}L-C$/.test(
      subAssemblyInputValue
    );

    const isChassisRailRightCatcherPattern = /^CHR\d{6}R-C$/.test(
      subAssemblyInputValue
    );

    const isRoofPrimaryPattern = /^ROOF\d{6}-P$/.test(subAssemblyInputValue);
    const isRoofCatcherPattern = /^ROOF\d{6}-C$/.test(subAssemblyInputValue);

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
    } else if (isCTInterfaceLeftPattern) {
      try {
        // Check if CT Interface exists
        const CTInterface = await CTInterfaceLeftModel.findOne({
          chassisId: subAssemblyInputValue,
        });

        if (!CTInterface) {
          return res
            .status(404)
            .json({ message: "CT Interface (Left) not found" });
        }

        // Check if the CT already exists in the PDC
        if (pdc.leftCTInterfaces.some((CTId) => CTId.equals(CTInterface._id))) {
          return res.status(400).json({
            message: `The CT Interface (Left) already exists in the ${pdc.pdcId}`,
          });
        }

        if (pdc.leftCTInterfaces.length > 0) {
          return res.status(400).json({
            message: `Other CT Interface (Left) already exists in the ${pdc.pdcId}`,
          });
        }

        if (CTInterface.isAllocated === true) {
          return res.status(404).json({
            message: `${CTInterface.CTId} CT Interface (Left) has been allocated to other PDC`,
          });
        }

        // Set the allocated date for the CTInterface
        CTInterface.allocatedDate = new Date();

        // Set the isAllocated Flag to true
        CTInterface.isAllocated = true;

        // Associate the CTInterface Panel with the PDC by adding its ObjectId to the MCCBs array
        pdc.leftCTInterfaces.push(CTInterface._id);

        // Save both the CT Interface land the updated PDC document
        await CTInterface.save();
        await pdc.save();

        //  Respond with success message and the updated PDC
        const response = "Sub-Assembly allocation successful";
        return res.status(200).json({ message: response });
      } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
      }
    } else if (isCTInterfaceRightPattern) {
      try {
        // Check if CT Interface exists
        const CTInterface = await CTInterfaceRightModel.findOne({
          CTId: subAssemblyInputValue,
        });

        if (!CTInterface) {
          return res
            .status(404)
            .json({ message: "CT Interface (Right) not found" });
        }

        // Check if the CT already exists in the PDC
        if (
          pdc.rightCTInterfaces.some((CTId) => CTId.equals(CTInterface._id))
        ) {
          return res.status(400).json({
            message: `The CT Interface (Right) already exists in the ${pdc.pdcId}`,
          });
        }

        if (pdc.rightCTInterfaces.length > 0) {
          return res.status(400).json({
            message: `Other CT Interface (Right) already exists in the ${pdc.pdcId}`,
          });
        }

        if (CTInterface.isAllocated === true) {
          return res.status(404).json({
            message: `${CTInterface.CTId} CT Interface (Right) has been allocated to other PDC`,
          });
        }

        // Set the allocated date for the CTInterface
        CTInterface.allocatedDate = new Date();

        // Set the isAllocated Flag to true
        CTInterface.isAllocated = true;

        // Associate the CTInterface Panel with the PDC by adding its ObjectId to the MCCBs array
        pdc.rightCTInterfaces.push(CTInterface._id);

        // Save both the CT Interface land the updated PDC document
        await CTInterface.save();
        await pdc.save();

        //  Respond with success message and the updated PDC
        const response = "Sub-Assembly allocation successful";
        return res.status(200).json({ message: response });
      } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
      }
    } else if (isChassisRailLeftPrimaryPattern) {
      try {
        // Check if Chassis Rail Interface exists
        const ChassisRail = await ChassisRailLeftPrimaryModel.findOne({
          chassisId: subAssemblyInputValue,
        });

        if (!ChassisRail) {
          return res.status(404).json({ message: "Chassis rail not found" });
        }

        // Check if the Chassis Rail already exists in the PDC
        if (
          pdc.leftPrimaryChassisRails.some((chassisId) =>
            chassisId.equals(ChassisRail._id)
          )
        ) {
          return res.status(400).json({
            message: `The Chassis Rail already exists in the ${pdc.pdcId}`,
          });
        }

        if (pdc.leftPrimaryChassisRails.length > 0) {
          return res.status(400).json({
            message: `Other Chassis Rail already exists in the ${pdc.pdcId}`,
          });
        }

        if (ChassisRail.isAllocated === true) {
          return res.status(404).json({
            message: `${ChassisRail.chassisId} Chassis Rail has been allocated to other PDC`,
          });
        }

        // Set the allocated date for the Chassis Rail
        ChassisRail.allocatedDate = new Date();

        // Set the isAllocated Flag to true
        ChassisRail.isAllocated = true;

        // Associate the Chassis Rail Panel with the PDC by adding its ObjectId to the MCCBs array
        pdc.leftPrimaryChassisRails.push(ChassisRail._id);

        // Save both the Chassis Rail and the updated PDC document
        await ChassisRail.save();
        await pdc.save();

        //  Respond with success message and the updated PDC
        const response = "Sub-Assembly allocation successful";
        return res.status(200).json({ message: response });
      } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
      }
    } else if (isChassisRailRightPrimaryPattern) {
      try {
        // Check if Chassis Rail Interface exists
        const ChassisRail = await ChassisRailRightPrimaryModel.findOne({
          chassisId: subAssemblyInputValue,
        });

        if (!ChassisRail) {
          return res.status(404).json({ message: "Chassis rail not found" });
        }

        // Check if the Chassis Rail already exists in the PDC
        if (
          pdc.rightPrimaryChassisRails.some((chassisId) =>
            chassisId.equals(ChassisRail._id)
          )
        ) {
          return res.status(400).json({
            message: `The Chassis Rail already exists in the ${pdc.pdcId}`,
          });
        }

        if (pdc.rightPrimaryChassisRails.length > 0) {
          return res.status(400).json({
            message: `Other Chassis Rail already exists in the ${pdc.pdcId}`,
          });
        }

        if (ChassisRail.isAllocated === true) {
          return res.status(404).json({
            message: `${ChassisRail.chassisId} Chassis Rail has been allocated to other PDC`,
          });
        }

        // Set the allocated date for the Chassis Rail
        ChassisRail.allocatedDate = new Date();

        // Set the isAllocated Flag to true
        ChassisRail.isAllocated = true;

        // Associate the Chassis Rail Panel with the PDC by adding its ObjectId to the MCCBs array
        pdc.rightPrimaryChassisRails.push(ChassisRail._id);

        // Save both the Chassis Rail and the updated PDC document
        await ChassisRail.save();
        await pdc.save();

        //  Respond with success message and the updated PDC
        const response = "Sub-Assembly allocation successful";
        return res.status(200).json({ message: response });
      } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
      }
    } else if (isChassisRailLeftCatcherPattern) {
      try {
        // Check if Chassis Rail Interface exists
        const ChassisRail = await ChassisRailLeftCatcherModel.findOne({
          chassisId: subAssemblyInputValue,
        });

        if (!ChassisRail) {
          return res.status(404).json({ message: "Chassis rail not found" });
        }

        // Check if the Chassis Rail already exists in the PDC
        if (
          pdc.leftCatcherChassisRails.some((chassisId) =>
            chassisId.equals(ChassisRail._id)
          )
        ) {
          return res.status(400).json({
            message: `The Chassis Rail already exists in the ${pdc.pdcId}`,
          });
        }

        if (pdc.leftCatcherChassisRails.length > 0) {
          return res.status(400).json({
            message: `Other Chassis Rail already exists in the ${pdc.pdcId}`,
          });
        }

        if (ChassisRail.isAllocated === true) {
          return res.status(404).json({
            message: `${ChassisRail.chassisId} Chassis Rail has been allocated to other PDC`,
          });
        }

        // Set the allocated date for the Chassis Rail
        ChassisRail.allocatedDate = new Date();

        // Set the isAllocated Flag to true
        ChassisRail.isAllocated = true;

        // Associate the Chassis Rail Panel with the PDC by adding its ObjectId to the MCCBs array
        pdc.leftCatcherChassisRails.push(ChassisRail._id);

        // Save both the Chassis Rail and the updated PDC document
        await ChassisRail.save();
        await pdc.save();

        //  Respond with success message and the updated PDC
        const response = "Sub-Assembly allocation successful";
        return res.status(200).json({ message: response });
      } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
      }
    } else if (isChassisRailRightCatcherPattern) {
      try {
        // Check if Chassis Rail Interface exists
        const ChassisRail = await ChassisRailRightCatcherModel.findOne({
          chassisId: subAssemblyInputValue,
        });

        if (!ChassisRail) {
          return res.status(404).json({ message: "Chassis rail not found" });
        }

        // Check if the Chassis Rail already exists in the PDC
        if (
          pdc.rightCatcherChassisRails.some((chassisId) =>
            chassisId.equals(ChassisRail._id)
          )
        ) {
          return res.status(400).json({
            message: `The Chassis Rail already exists in the ${pdc.pdcId}`,
          });
        }

        if (pdc.rightCatcherChassisRails.length > 0) {
          return res.status(400).json({
            message: `Other Chassis Rail already exists in the ${pdc.pdcId}`,
          });
        }

        if (ChassisRail.isAllocated === true) {
          return res.status(404).json({
            message: `${ChassisRail.chassisId} Chassis Rail has been allocated to other PDC`,
          });
        }

        // Set the allocated date for the Chassis Rail
        ChassisRail.allocatedDate = new Date();

        // Set the isAllocated Flag to true
        ChassisRail.isAllocated = true;

        // Associate the Chassis Rail Panel with the PDC by adding its ObjectId to the MCCBs array
        pdc.rightCatcherChassisRails.push(ChassisRail._id);

        // Save both the Chassis Rail and the updated PDC document
        await ChassisRail.save();
        await pdc.save();

        //  Respond with success message and the updated PDC
        const response = "Sub-Assembly allocation successful";
        return res.status(200).json({ message: response });
      } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
      }
    } else if (isRoofPrimaryPattern) {
      try {
        // Check if Roof Primary exists
        const PrimaryRoof = await RoofPrimaryModel.findOne({
          roofId: subAssemblyInputValue,
        });

        if (!PrimaryRoof) {
          return res.status(404).json({ message: "Roof not found" });
        }

        // Check if the Roof already exists in the PDC
        if (pdc.primaryRoofs.some((roofId) => roofId.equals(PrimaryRoof._id))) {
          return res.status(400).json({
            message: `The Primary Roof already exists in the ${pdc.pdcId}`,
          });
        }

        if (pdc.primaryRoofs.length > 0) {
          return res.status(400).json({
            message: `Other Primary Roof already exists in the ${pdc.pdcId}`,
          });
        }

        if (PrimaryRoof.isAllocated === true) {
          return res.status(404).json({
            message: `${PrimaryRoof.roofId} Primary Roof has been allocated to other PDC`,
          });
        }

        // Set the allocated date for the Primary Roof
        PrimaryRoof.allocatedDate = new Date();

        // Set the isAllocated Flag to true
        PrimaryRoof.isAllocated = true;

        // Associate the Chassis Rail Panel with the PDC by adding its ObjectId to the MCCBs array
        pdc.primaryRoofs.push(PrimaryRoof._id);

        // Save both the Chassis Rail and the updated PDC document
        await PrimaryRoof.save();
        await pdc.save();

        //  Respond with success message and the updated PDC
        const response = "Sub-Assembly allocation successful";
        return res.status(200).json({ message: response });
      } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
      }
    } else if (isRoofCatcherPattern) {
      try {
        // Check if Roof Catcher exists
        const CatcherRoof = await RoofCatcherModel.findOne({
          roofId: subAssemblyInputValue,
        });

        if (!CatcherRoof) {
          return res.status(404).json({ message: "Roof not found" });
        }

        // Check if the Roof already exists in the PDC
        if (pdc.catcherRoofs.some((roofId) => roofId.equals(CatcherRoof._id))) {
          return res.status(400).json({
            message: `The Catcher Roof already exists in the ${pdc.pdcId}`,
          });
        }

        if (pdc.catcherRoofs.length > 0) {
          return res.status(400).json({
            message: `Other Catcher Roof already exists in the ${pdc.pdcId}`,
          });
        }

        if (CatcherRoof.isAllocated === true) {
          return res.status(404).json({
            message: `${CatcherRoof.roofId} Catcher Roof has been allocated to other PDC`,
          });
        }

        // Set the allocated date for the Catcher Roof
        CatcherRoof.allocatedDate = new Date();

        // Set the isAllocated Flag to true
        CatcherRoof.isAllocated = true;

        // Associate the Chassis Rail Panel with the PDC by adding its ObjectId to the MCCBs array
        pdc.catcherRoofs.push(CatcherRoof._id);

        // Save both the Chassis Rail and the updated PDC document
        await CatcherRoof.save();
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

router.post("/AllocateLeftCTInterfaceComponent", async (req, res) => {
  try {
    const { componentSerialNumber, componentType, componentDescription, CTId } =
      req.body;

    const existingComponent = await ComponentModel.findOne({
      componentSerialNumber,
    });

    if (existingComponent) {
      return res.status(409).json({
        message:
          "Component already allocated. Please select a different component.",
      });
    }

    // Check if a component with the same type is already allocated to the CT Interface
    const CTInterface = await CTInterfaceLeftModel.findOne({ CTId }).populate(
      "components"
    );

    if (!CTInterface) {
      return res.status(404).json({ message: "CT Interface not found" });
    }

    const existingComponentType = CTInterface.components.find(
      (component) => component.componentType === componentType
    );

    if (existingComponentType) {
      return res.status(409).json({
        message: `${existingComponentType.componentType} with serial number [${existingComponentType.componentSerialNumber}] is already allocated to the CT Interface. Please choose another component.`,
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

    CTInterface.components.push(component._id);
    await CTInterface.save();

    return res.status(200).json({
      message: "Component allocated to the CT Interface (Left) successfully ",
    });
  } catch (error) {
    console.error("Error in allocation:", error);
    // Handle the error and send an appropriate response
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/AllocateRightCTInterfaceComponent", async (req, res) => {
  try {
    const { componentSerialNumber, componentType, componentDescription, CTId } =
      req.body;

    const existingComponent = await ComponentModel.findOne({
      componentSerialNumber,
    });

    if (existingComponent) {
      return res.status(409).json({
        message:
          "Component already allocated. Please select a different component.",
      });
    }

    // Check if a component with the same type is already allocated to the CT Interface
    const CTInterface = await CTInterfaceRightModel.findOne({ CTId }).populate(
      "components"
    );

    if (!CTInterface) {
      return res.status(404).json({ message: "CT Interface not found" });
    }

    const existingComponentType = CTInterface.components.find(
      (component) => component.componentType === componentType
    );

    if (existingComponentType) {
      return res.status(409).json({
        message: `${existingComponentType.componentType} with serial number [${existingComponentType.componentSerialNumber}] is already allocated to the CT Interface. Please choose another component.`,
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

    CTInterface.components.push(component._id);
    await CTInterface.save();

    return res.status(200).json({
      message: "Component allocated to the CT Interface (Right) successfully ",
    });
  } catch (error) {
    console.error("Error in allocation:", error);
    // Handle the error and send an appropriate response
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/AllocateLeftPrimaryChassisRailComponent", async (req, res) => {
  try {
    const {
      componentSerialNumber,
      componentType,
      componentDescription,
      chassisId,
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

    // Check if a component with the same type is already allocated to the Chassis Rail
    const ChassisRailLeftPrimary = await ChassisRailLeftPrimaryModel.findOne({
      chassisId,
    }).populate("components");

    if (!ChassisRailLeftPrimary) {
      return res.status(404).json({ message: "Chassis Rail not found" });
    }

    const existingComponentType = ChassisRailLeftPrimary.components.find(
      (component) => component.componentType === componentType
    );

    if (existingComponentType) {
      return res.status(409).json({
        message: `${existingComponentType.componentType} with serial number [${existingComponentType.componentSerialNumber}] is already allocated to the Chassis Rail. Please choose another component.`,
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

    ChassisRailLeftPrimary.components.push(component._id);
    await ChassisRailLeftPrimary.save();

    return res.status(200).json({
      message: "Component allocated to the Chassis Rail successfully ",
    });
  } catch (error) {
    console.error("Error in allocation:", error);
    // Handle the error and send an appropriate response
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/AllocateRightPrimaryChassisRailComponent", async (req, res) => {
  try {
    const {
      componentSerialNumber,
      componentType,
      componentDescription,
      chassisId,
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

    // Check if a component with the same type is already allocated to the Chassis Rail
    const ChassisRailRightPrimary = await ChassisRailRightPrimaryModel.findOne({
      chassisId,
    }).populate("components");

    if (!ChassisRailRightPrimary) {
      return res.status(404).json({ message: "Chassis Rail not found" });
    }

    const existingComponentType = ChassisRailRightPrimary.components.find(
      (component) => component.componentType === componentType
    );

    if (existingComponentType) {
      return res.status(409).json({
        message: `${existingComponentType.componentType} with serial number [${existingComponentType.componentSerialNumber}] is already allocated to the Chassis Rail. Please choose another component.`,
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

    ChassisRailRightPrimary.components.push(component._id);
    await ChassisRailRightPrimary.save();

    return res.status(200).json({
      message: "Component allocated to the Chassis Rail successfully ",
    });
  } catch (error) {
    console.error("Error in allocation:", error);
    // Handle the error and send an appropriate response
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/AllocateLeftCatcherChassisRailComponent", async (req, res) => {
  try {
    const {
      componentSerialNumber,
      componentType,
      componentDescription,
      chassisId,
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

    // Check if a component with the same type is already allocated to the Chassis Rail
    const ChassisRailLeftCatcher = await ChassisRailLeftCatcherModel.findOne({
      chassisId,
    }).populate("components");

    if (!ChassisRailLeftCatcher) {
      return res.status(404).json({ message: "Chassis Rail not found" });
    }

    const existingComponentType = ChassisRailLeftCatcher.components.find(
      (component) => component.componentType === componentType
    );

    if (existingComponentType) {
      return res.status(409).json({
        message: `${existingComponentType.componentType} with serial number [${existingComponentType.componentSerialNumber}] is already allocated to the Chassis Rail. Please choose another component.`,
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

    ChassisRailLeftCatcher.components.push(component._id);
    await ChassisRailLeftCatcher.save();

    return res.status(200).json({
      message: "Component allocated to the Chassis Rail successfully ",
    });
  } catch (error) {
    console.error("Error in allocation:", error);
    // Handle the error and send an appropriate response
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/AllocateRightCatcherChassisRailComponent", async (req, res) => {
  try {
    const {
      componentSerialNumber,
      componentType,
      componentDescription,
      chassisId,
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

    // Check if a component with the same type is already allocated to the Chassis Rail
    const ChassisRailRightCatcher = await ChassisRailRightCatcherModel.findOne({
      chassisId,
    }).populate("components");

    if (!ChassisRailRightCatcher) {
      return res.status(404).json({ message: "Chassis Rail not found" });
    }

    const existingComponentType = ChassisRailRightCatcher.components.find(
      (component) => component.componentType === componentType
    );

    if (existingComponentType) {
      return res.status(409).json({
        message: `${existingComponentType.componentType} with serial number [${existingComponentType.componentSerialNumber}] is already allocated to the Chassis Rail. Please choose another component.`,
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

    ChassisRailRightCatcher.components.push(component._id);
    await ChassisRailRightCatcher.save();

    return res.status(200).json({
      message: "Component allocated to the Chassis Rail successfully ",
    });
  } catch (error) {
    console.error("Error in allocation:", error);
    // Handle the error and send an appropriate response
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/AllocatePrimaryRoofComponent", async (req, res) => {
  try {
    const {
      componentSerialNumber,
      componentType,
      componentDescription,
      roofId,
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

    // Check if a component with the same type is already allocated to the Roof
    const RoofPrimary = await RoofPrimaryModel.findOne({
      roofId,
    }).populate("components");

    if (!RoofPrimary) {
      return res.status(404).json({ message: "Roof not found" });
    }

    const existingComponentType = RoofPrimary.components.find(
      (component) => component.componentType === componentType
    );

    if (existingComponentType) {
      return res.status(409).json({
        message: `${existingComponentType.componentType} with serial number [${existingComponentType.componentSerialNumber}] is already allocated to the Roof. Please choose another component.`,
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

    RoofPrimary.components.push(component._id);
    await RoofPrimary.save();

    return res.status(200).json({
      message: "Component allocated to the Roof successfully ",
    });
  } catch (error) {
    console.error("Error in allocation:", error);
    // Handle the error and send an appropriate response
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/AllocateCatcherRoofComponent", async (req, res) => {
  try {
    const {
      componentSerialNumber,
      componentType,
      componentDescription,
      roofId,
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

    // Check if a component with the same type is already allocated to the Roof
    const RoofCatcher = await RoofCatcherModel.findOne({
      roofId,
    }).populate("components");

    if (!RoofCatcher) {
      return res.status(404).json({ message: "Roof not found" });
    }

    const existingComponentType = RoofCatcher.components.find(
      (component) => component.componentType === componentType
    );

    if (existingComponentType) {
      return res.status(409).json({
        message: `${existingComponentType.componentType} with serial number [${existingComponentType.componentSerialNumber}] is already allocated to the Roof. Please choose another component.`,
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

    RoofCatcher.components.push(component._id);
    await RoofCatcher.save();

    return res.status(200).json({
      message: "Component allocated to the Roof successfully ",
    });
  } catch (error) {
    console.error("Error in allocation:", error);
    // Handle the error and send an appropriate response
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
