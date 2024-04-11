const express = require("express");

const router = express.Router();

const {
  CTInterfaceLeftModel,
  CTInterfaceRightModel,
} = require("../models/SubAssemblyModel");
const PDCModel = require("../models/PDCModel");
const ComponentModel = require("../models/ComponentModel");

// ================================== C T I N T E R F A C E (L E F T) ==================================

router.post("/CTInterfaceLeft/generateSubAssembly", async (req, res) => {
  const LeftCTInterfaces = req.body.LeftCTInterfaces;

  const existingCTInterfaces = await CTInterfaceLeftModel.find({
    CTId: { $in: LeftCTInterfaces.map((CTInterface) => CTInterface.CTId) },
  });

  if (existingCTInterfaces.length > 0) {
    return res.status(409).json("Duplicate CT Interface found");
  }

  // Create an array of CTInterdfaces documents
  const CTInterfaceDocuments = LeftCTInterfaces.map((CTInterface) => ({
    ...CTInterface,
    link: CTInterface.link,
    CTId: CTInterface.CTId,
  }));

  const insertedCTInterfaces = await CTInterfaceLeftModel.insertMany(
    CTInterfaceDocuments
  );
  res.json(insertedCTInterfaces);
});

router.get("/CTInterfaceLeft/getLatestCTInterface", async (req, res) => {
  try {
    // Find the document with the highest CT Id
    const latestCTInterface = await CTInterfaceLeftModel.findOne()
      .sort({ CTId: -1 })
      .limit(1);

    if (latestCTInterface) {
      res.json(latestCTInterface.CTId);
    } else {
      res.json(null); // No CT Interface found
    }
  } catch (error) {
    console.error("Error fetching latest CT ID:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Get all CT Interface
router.get("/CTInterfaceLeft/getAllCTInterface", async (req, res) => {
  try {
    const CTInterdfaceData = await CTInterfaceLeftModel.find();
    res.json(CTInterdfaceData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete CT Interface
router.delete(
  "/CTInterfaceLeft/deleteCTInterfaceLeft/:CTId",
  async (req, res) => {
    try {
      const CTId = req.params.CTId;

      const CTToDelete = await CTInterfaceLeftModel.findOneAndDelete({
        CTId: CTId,
      });

      if (!CTToDelete) {
        res.status(404).json({ message: "CTInterface not found!" });
      }

      const componentIds = CTToDelete.components;

      for (const componentId of componentIds) {
        await ComponentModel.findOneAndDelete({ _id: componentId });
      }

      const deletedCTInterfaceObjectId = CTToDelete._id;

      await PDCModel.updateMany(
        {
          leftCTInterfaces: deletedCTInterfaceObjectId,
        },
        {
          $pull: {
            leftCTInterfaces: deletedCTInterfaceObjectId,
          },
        }
      );

      console.log(CTToDelete);
      res.status(200).json({ message: "CT deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
);

// Edit CTInterfaceRoute
router.put(
  "/CTInterfaceLeft/editCTInterfaceLeft/:pdcId/:CTId",
  async (req, res) => {
    try {
      const { pdcId, CTId } = req.params;
      const { pdcToEdit, CTToEdit } = req.body;

      // Find the current pdcId
      const currentPdc = await PDCModel.findOne({ pdcId });

      // Find the future pdcId
      const futurePdc = await PDCModel.findOne({ pdcId: pdcToEdit });

      // Find the current CTId
      const currentCT = await CTInterfaceLeftModel.findOne({ CTId });

      // Find the future CTId
      const futureCT = await CTInterfaceLeftModel.findOne({
        CTId: CTToEdit,
      });

      if (CTToEdit == null || CTToEdit === "") {
        return res.status(400).json({ error: "Please Enter CTInterface Id" });
      }

      const isCTInterfaceLeftPattern = /^CT\d{6}L-P$/.test(CTToEdit);
      if (!isCTInterfaceLeftPattern) {
        return res.status(400).json({
          error: "Please Enter Correct CT Interface (Left) Id  Format",
        });
      }

      if (futureCT && currentCT && futureCT.CTId !== currentCT.CTId) {
        return res.status(409).json({
          error:
            "CT Interface (Left) already exists. Please choose a different one.",
        });
      }

      if (pdcId !== pdcToEdit && CTId === CTToEdit) {
        // Add the CT to the future pdc and remove it from the current pdc
        if (futurePdc && currentPdc && currentPdc.leftCTInterfaces) {
          futurePdc.leftCTInterfaces.push(currentCT._id);
          currentPdc.leftCTInterfaces.pull(currentCT._id);

          // Save changes to both pdcs
          await futurePdc.save();
          await currentPdc.save();
        }
        res.status(200).json({
          message: "CT Interface (Left) moved successfully",
          futurePdc,
        });
      } else if (pdcId === pdcToEdit && CTId !== CTToEdit) {
        const updatedCTId = await CTInterfaceLeftModel.findOneAndUpdate(
          { CTId: CTId },
          {
            $set: {
              CTId: CTToEdit,
              link: `http://localhost:3000/Dashboard/CTInterface/${CTToEdit}`,
            },
          },
          { new: true }
        );

        if (!updatedCTId) {
          return res.status(404).json({
            message: "CT not found",
          });
        }

        res.status(200).json({
          message: "CT Interface (Left) updated successfully",
          updatedCTId,
        });
      } else if (pdcId !== pdcToEdit && CTId !== CTToEdit) {
        const updatedCTId = await CTInterfaceLeftModel.findOneAndUpdate(
          { CTId: CTId },
          {
            $set: {
              CTId: CTToEdit,
              link: `http://localhost:3000/Dashboard/CTInterface/${CTToEdit}`,
            },
          },
          { new: true }
        );

        // Add the CT Interface to the future pdc and remove it from the current pdc
        if (futurePdc && currentPdc && currentPdc.leftCTInterfaces) {
          futurePdc.leftCTInterfaces.push(currentCT._id);
          currentPdc.leftCTInterfaces.pull(currentCT._id);

          // Save changes to both pdcs
          await futurePdc.save();
          await currentPdc.save();
        }

        res.status(200).json({
          message: "CT Interface (Left) moved and updated successfully",
          futurePdc,
          updatedCTId,
        });
      } else if (pdcId === pdcToEdit && CTId === CTToEdit) {
        res.status(200).json({ message: "No Changes" });
      }
    } catch (error) {
      res
        .status(500)
        .json({ message: "Internal Server Error", error: error.message });
    }
  }
);

// ================================== C T I N T E R F A C E (R I G H T) ==================================

router.post("/CTInterfaceRight/generateSubAssembly", async (req, res) => {
  const RightCTInterfaces = req.body.RightCTInterfaces;

  const existingCTInterfaces = await CTInterfaceRightModel.find({
    CTId: { $in: RightCTInterfaces.map((CTInterface) => CTInterface.CTId) },
  });

  if (existingCTInterfaces.length > 0) {
    return res.status(409).json("Duplicate CT Interface found");
  }

  // Create an array of CTInterdfaces documents
  const CTInterfaceDocuments = RightCTInterfaces.map((CTInterface) => ({
    ...CTInterface,
    link: CTInterface.link,
    CTId: CTInterface.CTId,
  }));

  const insertedCTInterfaces = await CTInterfaceRightModel.insertMany(
    CTInterfaceDocuments
  );
  res.json(insertedCTInterfaces);
});

router.get("/CTInterfaceRight/getLatestCTInterface", async (req, res) => {
  try {
    // Find the document with the highest CT Id
    const latestCTInterface = await CTInterfaceRightModel.findOne()
      .sort({ CTId: -1 })
      .limit(1);

    if (latestCTInterface) {
      res.json(latestCTInterface.CTId);
    } else {
      res.json(null); // No CT Interface found
    }
  } catch (error) {
    console.error("Error fetching latest CT ID:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Get all CT Interface
router.get("/CTInterfaceRight/getAllCTInterface", async (req, res) => {
  try {
    const CTInterdfaceData = await CTInterfaceRightModel.find();
    res.json(CTInterdfaceData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete CT Interface
router.delete(
  "/CTInterfaceRight/deleteCTInterfaceRight/:CTId",
  async (req, res) => {
    try {
      const CTId = req.params.CTId;

      const CTToDelete = await CTInterfaceRightModel.findOneAndDelete({
        CTId: CTId,
      });

      if (!CTToDelete) {
        res.status(404).json({ message: "CTInterface not found!" });
      }

      const componentIds = CTToDelete.components;

      for (const componentId of componentIds) {
        await ComponentModel.findOneAndDelete({ _id: componentId });
      }

      const deletedCTInterfaceObjectId = CTToDelete._id;

      await PDCModel.updateMany(
        {
          rightCTInterfaces: deletedCTInterfaceObjectId,
        },
        {
          $pull: {
            rightCTInterfaces: deletedCTInterfaceObjectId,
          },
        }
      );

      console.log(CTToDelete);
      res.status(200).json({ message: "CT deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
);

// Edit CTInterfaceRoute
router.put(
  "/CTInterfaceRight/editCTInterfaceRight/:pdcId/:CTId",
  async (req, res) => {
    try {
      const { pdcId, CTId } = req.params;
      const { pdcToEdit, CTToEdit } = req.body;

      // Find the current pdcId
      const currentPdc = await PDCModel.findOne({ pdcId });

      // Find the future pdcId
      const futurePdc = await PDCModel.findOne({ pdcId: pdcToEdit });

      // Find the current CTId
      const currentCT = await CTInterfaceRightModel.findOne({ CTId });

      // Find the future CTId
      const futureCT = await CTInterfaceRightModel.findOne({
        CTId: CTToEdit,
      });

      if (CTToEdit == null || CTToEdit === "") {
        return res.status(400).json({ error: "Please Enter CTInterface Id" });
      }

      const isCTInterfaceRightPattern = /^CT\d{6}R-P$/.test(CTToEdit);
      if (!isCTInterfaceRightPattern) {
        return res.status(400).json({
          error: "Please Enter Correct CT Interface (Right) Id  Format",
        });
      }

      if (futureCT && currentCT && futureCT.CTId !== currentCT.CTId) {
        return res.status(409).json({
          error:
            "CT Interface (Right) already exists. Please choose a different one.",
        });
      }

      if (pdcId !== pdcToEdit && CTId === CTToEdit) {
        // Add the CT to the future pdc and remove it from the current pdc
        if (futurePdc && currentPdc && currentPdc.rightCTInterfaces) {
          futurePdc.rightCTInterfaces.push(currentCT._id);
          currentPdc.rightCTInterfaces.pull(currentCT._id);

          // Save changes to both pdcs
          await futurePdc.save();
          await currentPdc.save();
        }
        res.status(200).json({
          message: "CT Interface (Right) moved successfully",
          futurePdc,
        });
      } else if (pdcId === pdcToEdit && CTId !== CTToEdit) {
        const updatedCTId = await CTInterfaceRightModel.findOneAndUpdate(
          { CTId: CTId },
          {
            $set: {
              CTId: CTToEdit,
              link: `http://localhost:3000/Dashboard/CTInterface/${CTToEdit}`,
            },
          },
          { new: true }
        );

        if (!updatedCTId) {
          return res.status(404).json({
            message: "CT not found",
          });
        }

        res.status(200).json({
          message: "CT Interface (Right) updated successfully",
          updatedCTId,
        });
      } else if (pdcId !== pdcToEdit && CTId !== CTToEdit) {
        const updatedCTId = await CTInterfaceRightModel.findOneAndUpdate(
          { CTId: CTId },
          {
            $set: {
              CTId: CTToEdit,
              link: `http://localhost:3000/Dashboard/CTInterface/${CTToEdit}`,
            },
          },
          { new: true }
        );

        // Add the CT Interface to the future pdc and remove it from the current pdc
        if (futurePdc && currentPdc && currentPdc.rightCTInterfaces) {
          futurePdc.rightCTInterfaces.push(currentCT._id);
          currentPdc.rightCTInterfaces.pull(currentCT._id);

          // Save changes to both pdcs
          await futurePdc.save();
          await currentPdc.save();
        }

        res.status(200).json({
          message: "CT Interface (Right) moved and updated successfully",
          futurePdc,
          updatedCTId,
        });
      } else if (pdcId === pdcToEdit && CTId === CTToEdit) {
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
