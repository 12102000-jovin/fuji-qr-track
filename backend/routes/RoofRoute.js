const express = require("express");

const router = express.Router();

const { RoofPrimaryModel } = require("../models/SubAssemblyModel");

const ComponentModel = require("../models/ComponentModel");
const PDCModel = require("../models/PDCModel");

// ================================== R O O F (P R I M A R Y)==================================

// Generate Roof Primary
router.post("/RoofPrimary/generateSubAssembly", async (req, res) => {
  const Roofs = req.body.PrimaryRoofs;

  const existingRoofs = await RoofPrimaryModel.find({
    roofId: {
      $in: Roofs.map((Roof) => Roof.roofId),
    },
  });

  if (existingRoofs.length > 0) {
    return res.status(409).json("Duplicate Roof Rail found");
  }

  // Create an array of Roof Rail documents
  const RoofDocuments = Roofs.map((Roof) => ({
    ...Roof,
    link: Roof.link,
    roofId: Roof.roofId,
  }));

  const insertedRoof = await RoofPrimaryModel.insertMany(RoofDocuments);
  res.json(insertedRoof);
});

// Get Latest Roof Primary
router.get("/RoofPrimary/getLatestRoof", async (req, res) => {
  try {
    // Find the document with the highest Roof Id
    const latestRoof = await RoofPrimaryModel.findOne()
      .sort({ roofId: -1 })
      .limit(1);

    if (latestRoof) {
      res.json(latestRoof.roofId);
    } else {
      res.json(null); // No Roof Primary Found
    }
  } catch (error) {
    console.error("Error fetching latest Primary Roof Id:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Get all Roof
router.get("/RoofPrimary/getAllRoof", async (req, res) => {
  try {
    const RoofData = await RoofPrimaryModel.find();
    res.json(RoofData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete Roof Primary
router.delete("/RoofPrimary/deleteRoof/:roofId", async (req, res) => {
  try {
    const roofId = req.params.roofId;

    const roofToDelete = await RoofPrimaryModel.findOneAndDelete({
      roofId: roofId,
    });

    if (!roofId) {
      res.status(404).json({ message: "Roof not found!" });
    }

    const componentIds = roofToDelete.components;

    for (const componentId of componentIds) {
      await ComponentModel.findOneAndDelete({ _id: componentId });
    }

    const deletedRoofObjectId = roofToDelete._id;

    await PDCModel.updateMany(
      {
        $or: [{ primaryRoofs: deletedRoofObjectId }],
      },
      {
        $pull: {
          primaryRoofs: deletedRoofObjectId,
        },
      }
    );

    console.log(roofToDelete);
    res.status(200).json({ message: "Roof Primary deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Edit Roof Primary
router.put("/RoofPrimary/editRoof/:pdcId/:roofId", async (req, res) => {
  try {
    const { pdcId, roofId } = req.params;
    const { pdcToEdit, roofToEdit } = req.body;

    // Find the current pdcId
    const currentPdc = await PDCModel.findOne({ pdcId });

    // Find the future pdcId
    const futurePdc = await PDCModel.findOne({ pdcId: pdcToEdit });

    // Find the current roofId
    const currentRoof = await RoofPrimaryModel.findOne({ roofId });

    // Find the future roofId
    const futureRoof = await RoofPrimaryModel.findOne({ roofId: roofToEdit });

    if (roofToEdit == null || roofToEdit === "") {
      return res.status(400).json({ error: "Please Enter Roof Id" });
    }

    // Check whether the future Roof exist or not
    const isRoofPattern = /^ROOF\d{6}-P$/.test(roofToEdit);
    if (!isRoofPattern) {
      return res
        .status(400)
        .json({ error: "Please Enter Correct Roof (Primary) Id Format" });
    }

    if (futureRoof && currentRoof && futureRoof.roofId !== currentRoof.roofId) {
      return res.status(409).json({
        error: "Roof already exists. Please choose a different one",
      });
    }

    if (pdcId !== pdcToEdit && roofId === roofToEdit) {
      // Add the roof to the future PDC and remove it from the current PDC
      if (futurePdc && currentPdc && currentPdc.primaryRoofs) {
        futurePdc.primaryRoofs.push(currentRoof._id);
        currentPdc.primaryMCCBs.pull(currentRoof._id);

        // Save changes to both pdcs
        await futurePdc.save();
        await currentPdc.save();
      }
      res.status(200).json({ message: "Roof moved successfully", futureRoof });
    } else if (pdcId === pdcToEdit && roofId !== roofToEdit) {
      const updatedRoofId = await RoofPrimaryModel.findOneAndUpdate(
        {
          roofId: roofId,
        },
        {
          $set: {
            roofId: roofToEdit,
            link: `http://localhost:3000/Dashboard/Roof/${roofToEdit}`,
          },
        },
        { new: true }
      );

      if (!updatedRoofId) {
        return res.status(404).json({ message: "Roof not found" });
      }

      res
        .status(200)
        .json({ message: "Roof updated successfully", updatedRoofId });
    } else if (pdcId !== pdcToEdit && roofId !== roofToEdit) {
      const updatedRoofId = await RoofPrimaryModel.findOneAndUpdate(
        {
          roofId: roofId,
        },
        {
          $set: {
            roofId: roofToEdit,
            link: `http://localhost:3000/Dashboard/Roof/${roofToEdit}`,
          },
        }
      );

      // Add the Roof to the future pdc and remove it from the current pdc
      if (futurePdc && currentPdc && currentPdc.primaryRoofs) {
        futurePdc.primaryRoofs.push(currentRoof._id);
        currentPdc.primaryRoofs.pull(currentRoof._id);

        // Save changes to both pdcs
        await futurePdc.save();
        await currentPdc.save();
      }

      res.status(200).json({
        message: "Roof moved and updated successfully",
        futurePdc,
        updatedRoofId,
      });
    } else if (pdcId === pdcToEdit && roofId === roofToEdit) {
      res.status(200).json({ message: "No Changes" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
});

module.exports = router;
