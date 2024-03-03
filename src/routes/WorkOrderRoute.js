const express = require("express");

const router = express.Router();

const WorkOrderModel = require("../models/WorkOrderModel");

router.post("/generateWorkOrder", async (req, res) => {
  const workOrders = req.body.WorkOrders;

  console.log("Received Work Orders:", workOrders);

  // Check for existing Work Order with the same workOrderId
  const existingWorkOrders = await WorkOrderModel.find({
    workOrderId: { $in: workOrders.map((workOrder) => workOrder.workOrderId) },
  });

  if (existingWorkOrders.length > 0) {
    return res.status(409).json("Duplicate WorkOrderId found");
  }

  // Create an array of WorkOrder documents
  const workOrderDocuments = workOrders.map((workOrder) => ({
    ...workOrder,
    link: workOrder.link,
    workOrderId: workOrder.workOrderId,
  }));

  // Insert the WorkOrder documents
  const insertedWorkOrders = await WorkOrderModel.insertMany(
    workOrderDocuments
  );
  res.json(insertedWorkOrders);
});

router.get("/getLatestWorkOrder", async (req, res) => {
  try {
    // Find the document with the highest Work Order ID
    const latestWorkOrder = await WorkOrderModel.findOne()
      .sort({ workOrderId: -1 })
      .limit(1);

    if (latestWorkOrder) {
      res.json(latestWorkOrder.workOrderId);
    } else {
      res.json(null);
    }
  } catch (error) {
    console.error("Error fetching latest WorkOrder ID:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Get All WorkOrder
router.get("/getAllWorkOrder", async (req, res) => {
  try {
    const WorkOrderData = await WorkOrderModel.find();
    res.json(WorkOrderData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
