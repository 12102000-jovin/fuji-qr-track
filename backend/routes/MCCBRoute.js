const express = require("express");

const router = express.Router();

const {
  PrimaryMCCBModel,
  CatcherMCCBModel,
} = require("../models/SubAssemblyModel");
const PDCModel = require("../models/PDCModel");
const ComponentModel = require("../models/ComponentModel");

// ================================== M C C B (P R I M A R Y) ==================================

router.post("/MCCBPrimary/generateSubAssembly", async (req, res) => {
  const MCCBs = req.body.MCCBs;

  const existingMCCBs = await PrimaryMCCBModel.find({
    MCCBId: { $in: MCCBs.map((MCCB) => MCCB.MCCBId) },
  });

  if (existingMCCBs.length > 0) {
    return res.status(409).json("Duplicate Panel found");
  }

  // Create an array of MCCBs documents
  const MCCBDocuments = MCCBs.map((MCCB) => ({
    ...MCCB,
    link: MCCB.link,
    MCCBId: MCCB.MCCBId,
  }));

  const insertedMCCBs = await PrimaryMCCBModel.insertMany(MCCBDocuments);
  res.json(insertedMCCBs);
});

router.get("/MCCBPrimary/getLatestMCCB", async (req, res) => {
  try {
    // Find the document with the highest MCCB Panel Id
    const latestMCCB = await PrimaryMCCBModel.findOne()
      .sort({ MCCBId: -1 })
      .limit(1);

    if (latestMCCB) {
      res.json(latestMCCB.MCCBId);
    } else {
      res.json(null); // No MCCB Panel Found
    }
  } catch (error) {
    console.error("Error fetching latest MCCB Panel ID:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/MCCBPrimary/getAllMCCB", async (req, res) => {
  try {
    const MCCBData = await PrimaryMCCBModel.find();
    res.json(MCCBData);
  } catch (error) {
    res.status(500).json({ message: error.messages });
  }
});

router.delete("/MCCBPrimary/deleteMCCB/:MCCBId", async (req, res) => {
  try {
    const MCCBId = req.params.MCCBId;

    const MCCBToDelete = await PrimaryMCCBModel.findOneAndDelete({
      MCCBId: MCCBId,
    });

    if (!MCCBToDelete) {
      res.status(404).json({ message: "MCCB Panel not found!" });
    }

    const componentIds = MCCBToDelete.components;

    for (const componentId of componentIds) {
      await ComponentModel.findOneAndDelete({ _id: componentId });
    }

    const deletedMCCBObjectId = MCCBToDelete._id;

    await PDCModel.updateMany(
      {
        $or: [
          { primaryMCCBs: deletedMCCBObjectId },
          { catcherMCCBs: deletedMCCBObjectId },
        ],
      },
      {
        $pull: {
          primaryMCCBs: deletedMCCBObjectId,
          catcherMCCBs: deletedMCCBObjectId,
        },
      }
    );

    console.log(MCCBToDelete);
    res.status(200).json({ message: "MCCB Panel deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.put("/MCCBPrimary/editMCCB/:pdcId/:MCCBId", async (req, res) => {
  try {
    const { pdcId, MCCBId } = req.params;
    const { pdcToEdit, MCCBToEdit } = req.body;

    // Find the current pdcId
    const currentPdc = await PDCModel.findOne({ pdcId });

    // Find the future pdcId
    const futurePdc = await PDCModel.findOne({ pdcId: pdcToEdit });

    // Find the current MCCBId
    const currentMCCB = await PrimaryMCCBModel.findOne({ MCCBId });

    // Find the future MCCBId
    const futureMCCB = await PrimaryMCCBModel.findOne({ MCCBId: MCCBToEdit });

    if (MCCBToEdit == null || MCCBToEdit === "") {
      return res.status(400).json({ error: "Please Enter MCCB Panel Id" });
    }

    const isMCCBPattern = /^MCCBPAN\d{6}-P$/.test(MCCBToEdit);
    if (!isMCCBPattern) {
      return res
        .status(400)
        .json({ error: "Please Enter Correct MCCB Panel (Primary) Id Format" });
    }

    // Check whether the future MCCB Panel exist or not
    if (futureMCCB && currentMCCB && futureMCCB.MCCBId !== currentMCCB.MCCBId) {
      return res.status(409).json({
        error: "MCCB already exists. Please choose a different one",
      });
    }

    if (pdcId !== pdcToEdit && MCCBId === MCCBToEdit) {
      // Add the MCCB Panel to the future PDC and remove it from the current pdc
      if (futurePdc && currentPdc && currentPdc.primaryMCCBs) {
        futurePdc.primaryMCCBs.push(currentMCCB._id);
        currentPdc.primaryMCCBs.pull(currentMCCB._id);

        // Save changes to both pdcs
        await futurePdc.save();
        await currentPdc.save();
      }
      res
        .status(200)
        .json({ message: "MCCB Panel moved successfully", futureMCCB });
    } else if (pdcId === pdcToEdit && MCCBId !== MCCBToEdit) {
      const updatedMCCBId = await PrimaryMCCBModel.findOneAndUpdate(
        {
          MCCBId: MCCBId,
        },
        {
          $set: {
            MCCBId: MCCBToEdit,
            link: `http://localhost:3000/Dashboard/MCCB/${MCCBToEdit}`,
          },
        },
        { new: true }
      );

      if (!updatedMCCBId) {
        return res.status(404).json({
          message: "MCCB Panel not found",
        });
      }

      res
        .status(200)
        .json({ message: "MCCB Panel updated successfully", updatedMCCBId });
    } else if (pdcId !== pdcToEdit && MCCBId !== MCCBToEdit) {
      const updatedMCCBId = await PrimaryMCCBModel.findOneAndUpdate(
        { MCCBId: MCCBId },
        {
          $set: {
            MCCBId: MCCBToEdit,
            link: `http://localhost:3000/Dashboard/MCCB/${MCCBToEdit}`,
          },
        },
        { new: true }
      );

      // Add the MCCB Panel to the future pdc and remove it from the current pdc
      if (futurePdc && currentPdc && currentPdc.primaryMCCBs) {
        futurePdc.primaryMCCBs.push(currentMCCB._id);
        currentPdc.primaryMCCBs.pull(currentMCCB._id);

        // Save changes to both pdcs
        await futurePdc.save();
        await currentPdc.save();
      }

      res.status(200).json({
        message: "MCCB Panel moved and updated successfully",
        futurePdc,
        updatedMCCBId,
      });
    } else if (pdcId === pdcToEdit && MCCBId === MCCBToEdit) {
      res.status(200).json({ message: "No changes" });
    }

    // res.json({ currentPdc, currentMCCB, futureMCCB, futurePdc });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
});

// ================================== M C C B (C A T C H E R) ==================================

router.post("/MCCBCatcher/generateSubAssembly", async (req, res) => {
  const MCCBs = req.body.MCCBs;

  const existingMCCBs = await CatcherMCCBModel.find({
    MCCBId: { $in: MCCBs.map((MCCB) => MCCB.MCCBId) },
  });

  if (existingMCCBs.length > 0) {
    return res.status(409).json("Duplicate MCCB Panel found");
  }

  // Create an array of MCCBs documents
  const MCCBDocuments = MCCBs.map((MCCB) => ({
    ...MCCB,
    link: MCCB.link,
    MCCBId: MCCB.MCCBId,
  }));

  const insertedMCCBs = await CatcherMCCBModel.insertMany(MCCBDocuments);
  res.json(insertedMCCBs);
});

router.get("/MCCBCatcher/getLatestMCCB", async (req, res) => {
  try {
    // Find the document with the highest MCCB Panel Id
    const latestMCCB = await CatcherMCCBModel.findOne()
      .sort({ MCCBId: -1 })
      .limit(1);

    if (latestMCCB) {
      res.json(latestMCCB.MCCBId);
    } else {
      res.json(null); // No MCCB Panel Found
    }
  } catch (error) {
    console.error("Error fetching latest MCCB Panel ID:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/MCCBCatcher/getAllMCCB", async (req, res) => {
  try {
    const MCCBData = await CatcherMCCBModel.find();
    res.json(MCCBData);
  } catch (error) {
    res.status(500).json({ message: error.messages });
  }
});

router.delete("/MCCBCatcher/deleteMCCB/:MCCBId", async (req, res) => {
  try {
    const MCCBId = req.params.MCCBId;

    const MCCBToDelete = await CatcherMCCBModel.findOneAndDelete({
      MCCBId: MCCBId,
    });

    if (!MCCBToDelete) {
      res.status(404).json({ message: "MCCB Panel not found!" });
    }

    const componentIds = MCCBToDelete.components;

    for (const componentId of componentIds) {
      await ComponentModel.findOneAndDelete({ _id: componentId });
    }

    const deletedMCCBObjectId = MCCBToDelete._id;

    await PDCModel.updateMany(
      {
        $or: [
          { primaryMCCBs: deletedMCCBObjectId },
          { catcherMCCBs: deletedMCCBObjectId },
        ],
      },
      {
        $pull: {
          primaryMCCBs: deletedMCCBObjectId,
          catcherMCCBs: deletedMCCBObjectId,
        },
      }
    );

    console.log(MCCBToDelete);
    res.status(200).json({ message: "MCCB Panel deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.put("/MCCBCatcher/editMCCB/:pdcId/:MCCBId", async (req, res) => {
  try {
    const { pdcId, MCCBId } = req.params;
    const { pdcToEdit, MCCBToEdit } = req.body;

    // Find the current pdcId
    const currentPdc = await PDCModel.findOne({ pdcId });

    // Find the future pdcId
    const futurePdc = await PDCModel.findOne({ pdcId: pdcToEdit });

    // Find the current MCCBId
    const currentMCCB = await CatcherMCCBModel.findOne({ MCCBId });

    // Find the future MCCBId
    const futureMCCB = await CatcherMCCBModel.findOne({ MCCBId: MCCBToEdit });

    if (MCCBToEdit == null || MCCBToEdit === "") {
      return res.status(400).json({ error: "Please Enter MCCB Panel Id" });
    }

    const isMCCBPattern = /^MCCBPAN\d{6}-C$/.test(MCCBToEdit);
    if (!isMCCBPattern) {
      return res
        .status(400)
        .json({ error: "Please Enter Correct MCCB Panel (Catcher) Id Format" });
    }

    // Check whether the future MCCB Panel exist or not
    if (futureMCCB && currentMCCB && futureMCCB.MCCBId !== currentMCCB.MCCBId) {
      return res.status(409).json({
        error: "MCCB already exists. Please choose a different one",
      });
    }

    if (pdcId !== pdcToEdit && MCCBId === MCCBToEdit) {
      // Add the MCCB to the future MCCB and remove it from the current pdc
      if (futurePdc && currentPdc && currentPdc.catcherMCCBs) {
        futurePdc.catcherMCCBs.push(currentMCCB._id);
        currentPdc.catcherMCCBs.pull(currentMCCB._id);

        // Save changes to both pdcs
        await futurePdc.save();
        await currentPdc.save();
      }
      res
        .status(200)
        .json({ message: "MCCB Panel moved successfully", futureMCCB });
    } else if (pdcId === pdcToEdit && MCCBId !== MCCBToEdit) {
      const updatedMCCBId = await CatcherMCCBModel.findOneAndUpdate(
        {
          MCCBId: MCCBId,
        },
        {
          $set: {
            MCCBId: MCCBToEdit,
            link: `http://localhost:3000/Dashboard/MCCB/${MCCBToEdit}`,
          },
        },
        { new: true }
      );

      if (!updatedMCCBId) {
        return res.status(404).json({
          message: "MCCB Panel not found",
        });
      }

      res
        .status(200)
        .json({ message: "MCCB Panel updated successfully", updatedMCCBId });
    } else if (pdcId !== pdcToEdit && MCCBId !== MCCBToEdit) {
      const updatedMCCBId = await CatcherMCCBModel.findOneAndUpdate(
        { MCCBId: MCCBId },
        {
          $set: {
            MCCBId: MCCBToEdit,
            link: `http://localhost:3000/Dashboard/MCCB/${MCCBToEdit}`,
          },
        },
        { new: true }
      );

      // Add the MCCB Panel to the future pdc and remove it from the current pdc
      if (futurePdc && currentPdc && currentPdc.catcherMCCBs) {
        futurePdc.catcherMCCBs.push(currentMCCB._id);
        currentPdc.catcherMCCBs.pull(currentMCCB._id);

        // Save changes to both pdcs
        await futurePdc.save();
        await currentPdc.save();
      }

      res.status(200).json({
        message: "MCCB Panel moved and updated successfully",
        futurePdc,
        updatedMCCBId,
      });
    } else if (pdcId === pdcToEdit && MCCBId === MCCBToEdit) {
      res.status(200).json({ message: "No changes" });
    }

    // res.json({ currentPdc, currentMCCB, futureMCCB, futurePdc });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
});

module.exports = router;
