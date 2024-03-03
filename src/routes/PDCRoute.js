const express = require("express");

const router = express.Router();

const PDCModel = require("../models/PDCModel");

const WorkOrderModel = require("../models/WorkOrderModel");

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

// Get latest pdc id
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

// Get All PDC
router.get("/getAllPDC", async (req, res) => {
  try {
    const PDCData = await PDCModel.find();
    res.json(PDCData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
