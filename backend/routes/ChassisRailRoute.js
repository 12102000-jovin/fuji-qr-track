const express = require("express");

const router = express.Router();

const {
  ChassisRailLeftPrimaryModel,
  ChassisRailRightPrimaryModel,
} = require("../models/SubAssemblyModel");
const PDCModel = require("../models/PDCModel");
const ComponentModel = require("../models/ComponentModel");

// ================================== C H A S S I S  R A I L (P R I M A R Y) (L E F T) ==================================

// Generate Left Primary Chassis Rail
router.post("/LeftPrimaryChassisRail/generateSubAssembly", async (req, res) => {
  const LeftPrimaryChassisRails = req.body.LeftPrimaryChassisRails;

  const existingChassisRails = await ChassisRailLeftPrimaryModel.find({
    chassisId: {
      $in: LeftPrimaryChassisRails.map((ChassisRail) => ChassisRail.chassisId),
    },
  });

  if (existingChassisRails.length > 0) {
    return res.status(409).json("Duplicate Chassis Rail found");
  }

  // Create an array of Chassis Rail documents
  const ChassisRailDocuments = LeftPrimaryChassisRails.map((ChassisRail) => ({
    ...ChassisRail,
    link: ChassisRail.link,
    chassisId: ChassisRail.chassisId,
  }));

  const insertedChassisRail = await ChassisRailLeftPrimaryModel.insertMany(
    ChassisRailDocuments
  );
  res.json(insertedChassisRail);
});

// Get Latest Left Primary Chassis Rail
router.get("/LeftPrimaryChassisRail/getLatestChassisRail", async (req, res) => {
  try {
    // Find the document with the highest Chassis Id
    const latestChassisRail = await ChassisRailLeftPrimaryModel.findOne()
      .sort({ chassisId: -1 })
      .limit(1);

    if (latestChassisRail) {
      res.json(latestChassisRail.chassisId);
    } else {
      res.json(null); // No Chassis Rail found
    }
  } catch (error) {
    console.error("Error fetching latest Chassis ID:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Get all Left Primary Chassis Rail
router.get("/LeftPrimaryChassisRail/getAllChassisRail", async (req, res) => {
  try {
    const ChassisRailData = await ChassisRailLeftPrimaryModel.find();
    res.json(ChassisRailData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete Left Primary Chassis Rail
router.delete(
  "/LeftPrimaryChassisRail/deleteLeftPrimaryChassisRail/:chassisId",
  async (req, res) => {
    try {
      const chassisId = req.params.chassisId;

      const ChassisToDelete =
        await ChassisRailLeftPrimaryModel.findOneAndDelete({
          chassisId: chassisId,
        });

      if (!ChassisToDelete) {
        res.status(404).json({ message: "Chassis Rail not found!" });
      }

      const componentIds = ChassisToDelete.components;

      for (const componentId of componentIds) {
        await ComponentModel.findOneAndDelete({ _id: componentId });
      }

      const deletedChasissRailObjectId = ChassisToDelete._id;

      await PDCModel.updateMany(
        {
          leftPrimaryChassisRails: deletedChasissRailObjectId,
        },
        {
          $pull: {
            leftPrimaryChassisRails: deletedChasissRailObjectId,
          },
        }
      );

      console.log(ChassisToDelete);
      res.status(200).json({ message: "Chassis Rail deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
);

// Edit Left Primary Chassis Rail
router.put(
  "/LeftPrimaryChassisRail/editLeftPrimaryChassisRail/:pdcId/:chassisId",
  async (req, res) => {
    try {
      const { pdcId, chassisId } = req.params;
      const { pdcToEdit, chassisIdToEdit } = req.body;

      // Find the current pdcId
      const currentPdc = await PDCModel.findOne({ pdcId });

      // Find the future pdcId
      const futurePdc = await PDCModel.findOne({ pdcId: pdcToEdit });

      // Find the current chassis Rail
      const currentChassisRail = await ChassisRailLeftPrimaryModel.findOne({
        chassisId,
      });

      // Find the future chassis Rail
      const futureChassisRail = await ChassisRailLeftPrimaryModel.findOne({
        chassisId: chassisIdToEdit,
      });

      if (chassisIdToEdit == null || chassisIdToEdit === "") {
        return res.status(400).json({ error: "Please Enter Chassis Rail Id" });
      }

      const isLeftPrimaryChassisRailPattern = /^CHR\d{6}L-P$/.test(
        chassisIdToEdit
      );
      if (!isLeftPrimaryChassisRailPattern) {
        return res.status(400).json({
          error: "Please Enter Correct Chassis Rail Id Format",
        });
      }

      if (
        futureChassisRail &&
        currentChassisRail &&
        futureChassisRail.chassisId !== currentChassisRail.chassisId
      ) {
        return res.status(409).json({
          error: "Chassis Rail already exists. Please choose a different one.",
        });
      }

      if (pdcId !== pdcToEdit && chassisId === chassisIdToEdit) {
        // Add the Chassis Rail to the future pdc and remove it from the current pdc
        if (futurePdc && currentPdc && currentPdc.leftPrimaryChassisRails) {
          futurePdc.leftPrimaryChassisRails.push(currentChassisRail._id);
          currentPdc.leftPrimaryChassisRails.pull(currentChassisRail._id);

          // Save changes to both pdcs
          await futurePdc.save();
          await currentPdc.save();
        }
        res.status(200).json({
          message: "Chassis Rail moved successfully",
          futurePdc,
        });
      } else if (pdcId === pdcToEdit && chassisId !== chassisIdToEdit) {
        const updatedChassisId =
          await ChassisRailLeftPrimaryModel.findOneAndUpdate(
            { chassisId: chassisId },
            {
              $set: {
                chassisId: chassisIdToEdit,
                link: `http://localhost:3000/Dashboard/ChassisRail/${chassisIdToEdit}`,
              },
            },
            { new: true }
          );

        if (!updatedChassisId) {
          return res.status(404).json({
            message: "Chassis Rail not found",
          });
        }

        res.status(200).json({
          message: "Chassis Rail updated successfully",
          updatedChassisId,
        });
      } else if (pdcId !== pdcToEdit && chassisId !== chassisIdToEdit) {
        const updatedChassisId =
          await ChassisRailLeftPrimaryModel.findOneAndUpdate(
            { chassisId: chassisId },
            {
              $set: {
                chassisId: chassisIdToEdit,
                link: `http://localhost:3000/Dashboard/ChassisRail/${chassisIdToEdit}`,
              },
            },
            { new: true }
          );

        // Add the Chassis Rail to the future pdc and remove it from the current pdc
        if (futurePdc && currentPdc && currentPdc.leftPrimaryChassisRails) {
          futurePdc.leftPrimaryChassisRails.push(currentChassisRail._id);
          currentPdc.leftPrimaryChassisRails.pull(currentChassisRail._id);

          // Save changes to both pdcs
          await futurePdc.save();
          await currentPdc.save();
        }

        res.status(200).json({
          message: "Chassis Rail moved and updated successfully",
          futurePdc,
          updatedChassisId,
        });
      } else if (pdcId === pdcToEdit && chassisId === chassisIdToEdit) {
        res.status(200).json({ message: "No Changes" });
      }
    } catch (error) {
      res
        .status(500)
        .json({ message: "Internal Server Error", error: error.message });
    }
  }
);

// ================================== C H A S S I S  R A I L (P R I M A R Y) (R I G H T) ==================================
// Generate Right Primary Chassis Rail
router.post(
  "/RightPrimaryChassisRail/generateSubAssembly",
  async (req, res) => {
    const RightPrimaryChassisRails = req.body.RightPrimaryChassisRails;

    const existingChassisRails = await ChassisRailRightPrimaryModel.find({
      chassisId: {
        $in: RightPrimaryChassisRails.map(
          (ChassisRail) => ChassisRail.chassisId
        ),
      },
    });

    if (existingChassisRails.length > 0) {
      return res.status(409).json("Duplicate Chassis Rail found");
    }

    // Create an array of Chassis Rail documents
    const ChassisRailDocuments = RightPrimaryChassisRails.map(
      (ChassisRail) => ({
        ...ChassisRail,
        link: ChassisRail.link,
        chassisId: ChassisRail.chassisId,
      })
    );

    const insertedChassisRail = await ChassisRailRightPrimaryModel.insertMany(
      ChassisRailDocuments
    );
    res.json(insertedChassisRail);
  }
);

// Get Latest Right Primary Chassis Rail
router.get(
  "/RightPrimaryChassisRail/getLatestChassisRail",
  async (req, res) => {
    try {
      // Find the document with the highest Chassis Id
      const latestChassisRail = await ChassisRailRightPrimaryModel.findOne()
        .sort({ chassisId: -1 })
        .limit(1);

      if (latestChassisRail) {
        res.json(latestChassisRail.chassisId);
      } else {
        res.json(null); // No Chassis Rail found
      }
    } catch (error) {
      console.error("Error fetching latest Chassis ID:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

// Get all Right Primary Chassis Rail
router.get("/RightPrimaryChassisRail/getAllChassisRail", async (req, res) => {
  try {
    const ChassisRailData = await ChassisRailRightPrimaryModel.find();
    res.json(ChassisRailData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete Right Primary Chassis Rail
router.delete(
  "/RightPrimaryChassisRail/deleteRightPrimaryChassisRail/:chassisId",
  async (req, res) => {
    try {
      const chassisId = req.params.chassisId;

      const ChassisToDelete =
        await ChassisRailRightPrimaryModel.findOneAndDelete({
          chassisId: chassisId,
        });

      if (!ChassisToDelete) {
        res.status(404).json({ message: "Chassis Rail not found!" });
      }

      const componentIds = ChassisToDelete.components;

      for (const componentId of componentIds) {
        await ComponentModel.findOneAndDelete({ _id: componentId });
      }

      const deletedChasissRailObjectId = ChassisToDelete._id;

      await PDCModel.updateMany(
        {
          rightPrimaryChassisRails: deletedChasissRailObjectId,
        },
        {
          $pull: {
            rightPrimaryChassisRails: deletedChasissRailObjectId,
          },
        }
      );

      console.log(ChassisToDelete);
      res.status(200).json({ message: "Chassis Rail deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
);

// Edit Right Primary Chassis Rail
router.put(
  "/RightPrimaryChassisRail/editRightPrimaryChassisRail/:pdcId/:chassisId",
  async (req, res) => {
    try {
      const { pdcId, chassisId } = req.params;
      const { pdcToEdit, chassisIdToEdit } = req.body;

      // Find the current pdcId
      const currentPdc = await PDCModel.findOne({ pdcId });

      // Find the future pdcId
      const futurePdc = await PDCModel.findOne({ pdcId: pdcToEdit });

      // Find the current chassis Rail
      const currentChassisRail = await ChassisRailRightPrimaryModel.findOne({
        chassisId,
      });

      // Find the future chassis Rail
      const futureChassisRail = await ChassisRailRightPrimaryModel.findOne({
        chassisId: chassisIdToEdit,
      });

      if (chassisIdToEdit == null || chassisIdToEdit === "") {
        return res.status(400).json({ error: "Please Enter Chassis Rail Id" });
      }

      const isRightPrimaryChassisRailPattern = /^CHR\d{6}R-P$/.test(
        chassisIdToEdit
      );
      if (!isRightPrimaryChassisRailPattern) {
        return res.status(400).json({
          error: "Please Enter Correct Chassis Rail Id Format",
        });
      }

      if (
        futureChassisRail &&
        currentChassisRail &&
        futureChassisRail.chassisId !== currentChassisRail.chassisId
      ) {
        return res.status(409).json({
          error: "Chassis Rail already exists. Please choose a different one.",
        });
      }

      if (pdcId !== pdcToEdit && chassisId === chassisIdToEdit) {
        // Add the Chassis Rail to the future pdc and remove it from the current pdc
        if (futurePdc && currentPdc && currentPdc.rightPrimaryChassisRails) {
          futurePdc.rightPrimaryChassisRails.push(currentChassisRail._id);
          currentPdc.rightPrimaryChassisRails.pull(currentChassisRail._id);

          // Save changes to both pdcs
          await futurePdc.save();
          await currentPdc.save();
        }
        res.status(200).json({
          message: "Chassis Rail moved successfully",
          futurePdc,
        });
      } else if (pdcId === pdcToEdit && chassisId !== chassisIdToEdit) {
        const updatedChassisId =
          await ChassisRailRightPrimaryModel.findOneAndUpdate(
            { chassisId: chassisId },
            {
              $set: {
                chassisId: chassisIdToEdit,
                link: `http://localhost:3000/Dashboard/ChassisRail/${chassisIdToEdit}`,
              },
            },
            { new: true }
          );

        if (!updatedChassisId) {
          return res.status(404).json({
            message: "Chassis Rail not found",
          });
        }

        res.status(200).json({
          message: "Chassis Rail updated successfully",
          updatedChassisId,
        });
      } else if (pdcId !== pdcToEdit && chassisId !== chassisIdToEdit) {
        const updatedChassisId =
          await ChassisRailRightPrimaryModel.findOneAndUpdate(
            { chassisId: chassisId },
            {
              $set: {
                chassisId: chassisIdToEdit,
                link: `http://localhost:3000/Dashboard/ChassisRail/${chassisIdToEdit}`,
              },
            },
            { new: true }
          );

        // Add the Chassis Rail to the future pdc and remove it from the current pdc
        if (futurePdc && currentPdc && currentPdc.rightPrimaryChassisRails) {
          futurePdc.rightPrimaryChassisRails.push(currentChassisRail._id);
          currentPdc.rightPrimaryChassisRails.pull(currentChassisRail._id);

          // Save changes to both pdcs
          await futurePdc.save();
          await currentPdc.save();
        }

        res.status(200).json({
          message: "Chassis Rail moved and updated successfully",
          futurePdc,
          updatedChassisId,
        });
      } else if (pdcId === pdcToEdit && chassisId === chassisIdToEdit) {
        res.status(200).json({ message: "No Changes" });
      }
    } catch (error) {
      res
        .status(500)
        .json({ message: "Internal Server Error", error: error.message });
    }
  }
);

module.exports = router;
