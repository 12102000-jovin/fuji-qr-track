const express = require("express");

const router = express.Router();

const PDCModel = require("../models/PDCModel");

const WorkOrderModel = require("../models/WorkOrderModel");

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
} = require("../models/SubAssemblyModel");

// Generate PDC API
router.post("/generatePDC", async (req, res) => {
  const PDCs = req.body.PDCs;

  console.log("Received PDCs:", PDCs);

  // Check for existing PDCs with the same pdcId
  const existingPDCs = await PDCModel.find({
    pdcId: { $in: PDCs.map((pdc) => pdc.pdcId) },
  });

  if (existingPDCs.length > 0) {
    return res.status(409).json("Duplicate PDC found");
  }

  // Create an array of PDC documents
  const pdcDocuments = PDCs.map((PDC) => ({
    ...PDC,
    link: PDC.link,
    pdcId: PDC.pdcId,
    // Include the selected Work Order Id in each PDC document
    workOrderId: PDC.workOrderId,
    allocatedDate: new Date(),
  }));

  // Insert the PDC documents
  const insertedPDCs = await PDCModel.insertMany(pdcDocuments);

  // Get the IDs of the inserted PDCs
  const insertedPDCIds = insertedPDCs.map((pdc) => pdc._id);

  // Find the WorkOrder where you want to insert the PDCs
  const workOrder = await WorkOrderModel.findOne({
    workOrderId: PDCs[0].workOrderId, // Use the workOrderId from the first PDC object
  });

  if (!workOrder) {
    return res.status(404).json("WorkOrder not found");
  }

  // Update the WorkOrder's pdcs array with the inserted PDCs IDs
  workOrder.pdcs.push(...insertedPDCIds);

  // Save the updated WorkOrder
  await workOrder.save();

  res.json(insertedPDCs);
});

// Get the latest PDC API
router.get("/getLatestPDC", async (req, res) => {
  try {
    // Find the document with the highest PDC ID
    const latestPDC = await PDCModel.findOne().sort({ pdcId: -1 }).limit(1);

    if (latestPDC) {
      res.json(latestPDC.pdcId);
    } else {
      res.json(null); // No PDC found
    }
  } catch (error) {
    console.error("Error fetching latest PDC ID:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Get All PDC API
router.get("/getAllPDC", async (req, res) => {
  try {
    const PDCData = await PDCModel.find();
    res.json(PDCData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete PDC API
router.delete("/deletePDC/:pdcId", async (req, res) => {
  try {
    const pdcId = req.params.pdcId;

    const pdcToDelete = await PDCModel.findOneAndDelete({
      pdcId: pdcId,
    });

    if (!pdcToDelete) {
      return res.status(404).json({ message: "PDC not found" });
    }

    // Extract the _id field of the deleted PDC
    const deletedPdcObjectId = pdcToDelete._id;

    await WorkOrderModel.updateMany(
      { pdcs: deletedPdcObjectId }, // Use the _id field for matching
      { $pull: { pdcs: deletedPdcObjectId } }
    );

    await PanelModel.updateMany(
      { _id: { $in: pdcToDelete.panels } },
      { $set: { isAllocated: false, allocatedDate: null } }
    );

    await LoadbankModel.updateMany(
      {
        _id: {
          $in: [...pdcToDelete.loadbanks],
        },
      },
      { $set: { isAllocated: false, allocatedDate: null } }
    );

    await LoadbankCatcherModel.updateMany(
      {
        _id: {
          $in: [...pdcToDelete.catcherLoadbanks],
        },
      },
      { $set: { isAllocated: false, allocatedDate: null } }
    );

    await PrimaryMCCBModel.updateMany(
      {
        _id: {
          $in: [...pdcToDelete.primaryMCCBs],
        },
      },
      { $set: { isAllocated: false, allocatedDate: null } }
    );

    await CatcherMCCBModel.updateMany(
      {
        _id: {
          $in: [...pdcToDelete.catcherMCCBs],
        },
      },
      { $set: { isAllocated: false, allocatedDate: null } }
    );

    await CTInterfaceLeftModel.updateMany(
      {
        _id: {
          $in: [...pdcToDelete.leftCTInterfaces],
        },
      },
      { $set: { isAllocated: false, allocatedDate: null } }
    );

    await CTInterfaceRightModel.updateMany(
      {
        _id: {
          $in: [...pdcToDelete.rightCTInterfaces],
        },
      },
      { $set: { isAllocated: false, allocatedDate: null } }
    );

    await ChassisRailLeftPrimaryModel.updateMany(
      {
        _id: {
          $in: [...pdcToDelete.leftPrimaryChassisRails],
        },
      },
      { $set: { isAllocated: false, allocatedDate: null } }
    );

    await ChassisRailRightPrimaryModel.updateMany(
      {
        _id: {
          $in: [...pdcToDelete.rightPrimaryChassisRails],
        },
      },
      { $set: { isAllocated: false, allocatedDate: null } }
    );

    console.log(pdcToDelete);
    res.status(200).json({ message: "PDC deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Edit PDC API
router.put("/editPDC/:workOrderId/:pdcId", async (req, res) => {
  try {
    const { workOrderId, pdcId } = req.params;
    const { workOrderIdToEdit, pdcIdToEdit } = req.body;

    let currentWorkOrder;

    if (pdcIdToEdit == null || pdcIdToEdit === "") {
      return res.status(400).json({ error: "Please Enter PDC Id" });
    }

    const isPDCPattern = /^PDC\d{6}$/.test(pdcIdToEdit);
    if (!isPDCPattern) {
      return res
        .status(400)
        .json({ error: "Please Enter Correct PDC Id Format" });
    }

    if (workOrderId) {
      // Find the current work order
      currentWorkOrder = await WorkOrderModel.findOne({ workOrderId });
    }

    // Find the future work order
    const futureWorkOrder = await WorkOrderModel.findOne({
      workOrderId: workOrderIdToEdit,
    });

    // Find the current PDC
    const currentPdcId = await PDCModel.findOne({ pdcId });

    // Check if pdcIdToEdit already exists
    const futurePDC = await PDCModel.findOne({ pdcId: pdcIdToEdit });
    if (futurePDC && currentPdcId && futurePDC.pdcId !== currentPdcId.pdcId) {
      return res
        .status(400)
        .json({ error: "PDC already exists. Please choose a different one." });
    }

    // if (!currentWorkOrder || !futureWorkOrder || !currentPdcId) {
    //   return res.status(404).json({
    //     message: "Current Work Order, Future Work Order, or PDC not found",
    //   });
    // }

    if (workOrderId === null || workOrderId === "null" || workOrderId === "") {
      futureWorkOrder.pdcs.push(currentPdcId._id);
      await futureWorkOrder.save();

      return res.status(200).json({
        message: "PDC added to future work order successfully",
        futureWorkOrder,
      });
    } else if (workOrderId !== workOrderIdToEdit && pdcId === pdcIdToEdit) {
      // Add the PDC to the future work order and remove it from the current work order
      futureWorkOrder.pdcs.push(currentPdcId._id);
      currentWorkOrder.pdcs.pull(currentPdcId._id);

      // Save changes to both work orders
      await futureWorkOrder.save();
      await currentWorkOrder.save();

      res
        .status(200)
        .json({ message: "PDC moved successfully", futureWorkOrder });
    } else if (pdcId !== pdcIdToEdit && workOrderId === workOrderIdToEdit) {
      const updatedPDC = await PDCModel.findOneAndUpdate(
        { pdcId: pdcId },
        {
          $set: {
            pdcId: pdcIdToEdit,
            link: `http://localhost:3000/Dashboard/PDC/${pdcIdToEdit}`,
          },
        },
        { new: true } // This option returns the modified document rather than the original
      );

      if (!updatedPDC) {
        return res.status(404).json({
          message: "PDC not found",
        });
      }

      res.status(200).json({ message: "PDC updated successfully", updatedPDC });
    } else if (workOrderId !== workOrderIdToEdit && pdcId !== pdcIdToEdit) {
      const updatedPDC = await PDCModel.findOneAndUpdate(
        { pdcId: pdcId },
        {
          $set: {
            pdcId: pdcIdToEdit,
            link: `http://localhost:3000/Dashboard/PDC/${pdcIdToEdit}`,
          },
        },
        { new: true } // This option returns the modified document rather than the original
      );

      // Add the PDC to the future work order and remove it from the current work order
      futureWorkOrder.pdcs.push(currentPdcId._id);
      currentWorkOrder.pdcs.pull(currentPdcId._id);

      // Save changes to both work orders
      await futureWorkOrder.save();
      await currentWorkOrder.save();

      res.status(200).json({
        message: "PDC moved and updated successfully",
        futureWorkOrder,
        updatedPDC,
      });
    } else if (workOrderId === workOrderIdToEdit && pdcId == pdcIdToEdit) {
      res.status(200).json({ message: "No changes" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
});

module.exports = router;
