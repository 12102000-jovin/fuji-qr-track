const express = require("express");

const router = express.Router();

const WorkOrderModel = require("../models/WorkOrderModel");

// Generate Work Order API
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

// Get the latest Work Order API
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

// Get All WorkOrder API
router.get("/getAllWorkOrder", async (req, res) => {
  try {
    const WorkOrderData = await WorkOrderModel.find();
    res.json(WorkOrderData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete WorkOrder API
router.delete("/deleteWorkOrder/:workOrderId", async (req, res) => {
  try {
    const workOrderId = req.params.workOrderId;

    const workOrderToDelete = await WorkOrderModel.findOneAndDelete({
      workOrderId: workOrderId,
    });

    if (!workOrderToDelete) {
      return res.status(404).json({ message: "Work order not found" });
    }

    console.log(workOrderToDelete);
    res.status(200).json({ message: "Work order deleted successfully" });
  } catch (error) {
    console.error("Error deleting work order:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Edit WorkOrder API
router.put("/editWorkOrder/:workOrderId", async (req, res) => {
  try {
    const workOrderId = req.params.workOrderId;
    const updatedWorkOrderId = req.body;

    const existingWorkOrder = await WorkOrderModel.findOne({
      workOrderId: workOrderId,
    });

    if (!existingWorkOrder) {
      return res.status(404).json({ message: "Work order not found" });
    }

    const inputWorkOrderExist = await WorkOrderModel.findOne({
      workOrderId: updatedWorkOrderId.workOrderId,
    });

    if (inputWorkOrderExist) {
      return res.status(409).json({
        error: "Work Order already exists. Please choose a different one.",
      });
    }

    // Update the WorkOrder data
    const updatedWorkOrder = await WorkOrderModel.findOneAndUpdate(
      { workOrderId: workOrderId },
      {
        $set: {
          workOrderId: updatedWorkOrderId.workOrderId,
          link: `http://localhost:3000/Dashboard/WorkOrder/${updatedWorkOrderId.workOrderId}`,
        },
      },
      { new: true }
    );

    res.json(updatedWorkOrder);
  } catch (error) {
    console.error("Error updating work order:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
