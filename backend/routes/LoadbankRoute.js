const express = require("express");

const router = express.Router();

const {
  LoadbankModel,
  LoadbankCatcherModel,
} = require("../models/SubAssemblyModel");
const PDCModel = require("../models/PDCModel");
const ComponentModel = require("../models/ComponentModel");

router.post("/LoadbankPrimary/generateSubAssembly", async (req, res) => {
  const Loadbanks = req.body.Loadbanks;

  const existingLoadbanks = await LoadbankModel.find({
    loadbankId: { $in: Loadbanks.map((loadbank) => loadbank.loadbankId) },
  });

  if (existingLoadbanks.length > 0) {
    return res.status(409).json("Duplicate Loadbank found");
  }

  // Create an array of Loadbanks documents
  const loadbankDocuments = Loadbanks.map((loadbank) => ({
    ...loadbank,
    link: loadbank.link,
    loadbankId: loadbank.loadbankId,
  }));

  const insertedLoadbanks = await LoadbankModel.insertMany(loadbankDocuments);
  res.json(insertedLoadbanks);
});

router.get("/LoadbankPrimary/getLatestLoadbank", async (req, res) => {
  try {
    // Find the document with the highet Loadbank Id
    const latestLoadbank = await LoadbankModel.findOne()
      .sort({ loadbankId: -1 })
      .limit(1);

    if (latestLoadbank) {
      res.json(latestLoadbank.loadbankId);
    } else {
      res.json(null); // No Loadbank found
    }
  } catch (error) {
    console.error("Error fetching latest Loadbank ID:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Get all loadbank
router.get("/LoadbankPrimary/getAllLoadbank", async (req, res) => {
  try {
    const LoadbankData = await LoadbankModel.find();
    res.json(LoadbankData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete Loadbank
router.delete("/Loadbank/deleteLoadbank/:loadbankId", async (req, res) => {
  try {
    const loadbankId = req.params.loadbankId;

    const loadbankToDelete = await LoadbankModel.findOneAndDelete({
      loadbankId: loadbankId,
    });

    if (!loadbankToDelete) {
      res.status(404).json({ mesage: "Loadbank not found!" });
    }

    const componentIds = loadbankToDelete.components;

    for (const componentId of componentIds) {
      await ComponentModel.findOneAndDelete({ _id: componentId });
    }

    const deletedLoadbankObjectId = loadbankToDelete._id;

    await PDCModel.updateMany(
      {
        $or: [
          { loadbanks: deletedLoadbankObjectId },
          { catcherLoadbanks: deletedLoadbankObjectId },
        ],
      },
      {
        $pull: {
          loadbanks: deletedLoadbankObjectId,
          catcherLoadbanks: deletedLoadbankObjectId,
        },
      }
    );

    console.log(loadbankToDelete);
    res.status(200).json({ message: "Loadbank deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.put("/Loadbank/editLoadbank/:pdcId/:loadbankId", async (req, res) => {
  try {
    const { pdcId, loadbankId } = req.params;
    const { pdcToEdit, loadbankToEdit } = req.body;

    // Find the current pdcId
    const currentPdc = await PDCModel.findOne({ pdcId });

    // Find the future pdcId
    const futurePdc = await PDCModel.findOne({ pdcId: pdcToEdit });

    // Find the current loadbankId
    const currentLoadbank = await LoadbankModel.findOne({ loadbankId });

    // Find the future loadbankId
    const futureLoadbank = await LoadbankModel.findOne({
      loadbankId: loadbankToEdit,
    });

    // console.log("Current PDC: ", currentPdc);
    console.log("Future PDC: ", futurePdc);
    // console.log("Current Loadbank: ", currentLoadbank);
    // console.log("Future Loadbank: ", futureLoadbank);

    if (
      futureLoadbank &&
      currentLoadbank &&
      futureLoadbank.loadbankId !== currentLoadbank.loadbankId
    ) {
      return res.status(409).json({
        error: "Loadbank already exists. Please choose a different one",
      });
    }

    if (pdcId !== pdcToEdit && loadbankId === loadbankToEdit) {
      // Add the loadbank to the future pdc and remove it from the current pdc
      if (futurePdc && currentPdc && currentPdc.loadbanks) {
        futurePdc.loadbanks.push(currentLoadbank._id);
        currentPdc.loadbanks.pull(currentLoadbank._id);

        // Save changes to both pdcs
        await futurePdc.save();
        await currentPdc.save();
      }
      res.status(200).json({ message: "PDC moved successfully", futurePdc });
    } else if (pdcId === pdcToEdit && loadbankId !== loadbankToEdit) {
      const updatedLoadbankId = await LoadbankModel.findOneAndUpdate(
        { loadbankId: loadbankId },
        {
          $set: {
            loadbankId: loadbankToEdit,
            link: `http://localhost:3000/Dashboard/Loadbank/${loadbankToEdit}`,
          },
        },
        { new: true }
      );

      if (!updatedLoadbankId) {
        return res.status(404).json({
          message: "Loadbank not found",
        });
      }

      res
        .status(200)
        .json({ message: "Loadbank updated successfully", updatedLoadbankId });
    } else if (pdcId !== pdcToEdit && loadbankId !== loadbankToEdit) {
      const updatedLoadbankId = await LoadbankModel.findOneAndUpdate(
        { loadbankId: loadbankId },
        {
          $set: {
            loadbankId: loadbankToEdit,
            link: `http://localhost:3000/Dashboard/Loadbank/${loadbankToEdit}`,
          },
        },
        { new: true }
      );

      // Add the loadbank to the future pdc and remove it from the current pdc
      if (futurePdc && currentPdc && currentPdc.loadbanks) {
        futurePdc.loadbanks.push(currentLoadbank._id);
        currentPdc.loadbanks.pull(currentLoadbank._id);

        // Save changes to both pdcs
        await futurePdc.save();
        await currentPdc.save();
      }

      res.status(200).json({
        message: "Loadbank moved and updated successfully",
        futurePdc,
        updatedLoadbankId,
      });
    } else if (pdcId === pdcToEdit && loadbankId === loadbankToEdit) {
      res.status(200).json({ message: "No changes" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
});

// ================================== L O A D B A N K (C A T C H E R) ==================================

router.post("/LoadbankCatcher/generateSubAssembly", async (req, res) => {
  const Loadbanks = req.body.Loadbanks;

  const existingLoadbanks = await LoadbankCatcherModel.find({
    loadbankId: {
      $in: Loadbanks.map((loadbank) => loadbank.loadbankId),
    },
  });

  if (existingLoadbanks.length > 0) {
    return res.status(409).json("Duplicate Loadbank found");
  }

  // Create an array of Loadbanks documents
  const loadbankDocuments = Loadbanks.map((loadbank) => ({
    ...loadbank,
    link: loadbank.link,
    loadbankId: loadbank.loadbankId,
  }));

  const insertedLoadbanks = await LoadbankCatcherModel.insertMany(
    loadbankDocuments
  );
  res.json(insertedLoadbanks);
});

router.get("/LoadbankCatcher/getLatestLoadbank", async (req, res) => {
  try {
    // Find the document with the highet Loadbank Id
    const latestLoadbank = await LoadbankCatcherModel.findOne()
      .sort({ loadbankId: -1 })
      .limit(1);

    if (latestLoadbank) {
      res.json(latestLoadbank.loadbankId);
    } else {
      res.json(null); // No Loadbank found
    }
  } catch (error) {
    console.error("Error fetching latest Loadbank ID:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Get all loadbank
router.get("/LoadbankCatcher/getAllLoadbank", async (req, res) => {
  try {
    const LoadbankData = await LoadbankCatcherModel.find();
    res.json(LoadbankData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete Loadbank
router.delete(
  "/LoadbankCatcher/deleteLoadbank/:loadbankId",
  async (req, res) => {
    try {
      const loadbankId = req.params.loadbankId;

      const loadbankToDelete = await LoadbankCatcherModel.findOneAndDelete({
        loadbankId: loadbankId,
      });

      if (!loadbankToDelete) {
        res.status(404).json({ mesage: "Loadbank not found!" });
      }

      const componentIds = loadbankToDelete.components;

      for (const componentId of componentIds) {
        await ComponentModel.findOneAndDelete({ _id: componentId });
      }

      const deletedLoadbankObjectId = loadbankToDelete._id;

      await PDCModel.updateMany(
        {
          $or: [
            { loadbanks: deletedLoadbankObjectId },
            { catcherLoadbanks: deletedLoadbankObjectId },
          ],
        },
        {
          $pull: {
            loadbanks: deletedLoadbankObjectId,
            catcherLoadbanks: deletedLoadbankObjectId,
          },
        }
      );

      console.log(loadbankToDelete);
      res.status(200).json({ message: "Loadbank deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
);

router.put(
  "/LoadbankCatcher/editLoadbank/:pdcId/:loadbankId",
  async (req, res) => {
    try {
      const { pdcId, loadbankId } = req.params;
      const { pdcToEdit, loadbankToEdit } = req.body;

      // Find the current pdcId
      const currentPdc = await PDCModel.findOne({ pdcId });

      // Find the future pdcId
      const futurePdc = await PDCModel.findOne({ pdcId: pdcToEdit });

      // Find the current loadbankId
      const currentLoadbank = await LoadbankCatcherModel.findOne({
        loadbankId,
      });

      // Find the future loadbankId
      const futureLoadbank = await LoadbankCatcherModel.findOne({
        loadbankId: loadbankToEdit,
      });

      // console.log("Current PDC: ", currentPdc);
      console.log("Future PDC: ", futurePdc);
      // console.log("Current Loadbank: ", currentLoadbank);
      // console.log("Future Loadbank: ", futureLoadbank);

      if (
        futureLoadbank &&
        currentLoadbank &&
        futureLoadbank.loadbankId !== currentLoadbank.loadbankId
      ) {
        return res.status(409).json({
          error: "Loadbank already exists. Please choose a different one",
        });
      }

      if (pdcId !== pdcToEdit && loadbankId === loadbankToEdit) {
        // Add the loadbank to the future pdc and remove it from the current pdc
        if (futurePdc && currentPdc && currentPdc.loadbanks) {
          futurePdc.loadbanks.push(currentLoadbank._id);
          currentPdc.loadbanks.pull(currentLoadbank._id);

          // Save changes to both pdcs
          await futurePdc.save();
          await currentPdc.save();
        }
        res.status(200).json({ message: "PDC moved successfully", futurePdc });
      } else if (pdcId === pdcToEdit && loadbankId !== loadbankToEdit) {
        const updatedLoadbankId = await LoadbankCatcherModel.findOneAndUpdate(
          { loadbankId: loadbankId },
          {
            $set: {
              loadbankId: loadbankToEdit,
              link: `http://localhost:3000/Dashboard/Loadbank/${loadbankToEdit}`,
            },
          },
          { new: true }
        );

        if (!updatedLoadbankId) {
          return res.status(404).json({
            message: "Loadbank not found",
          });
        }

        res.status(200).json({
          message: "Loadbank updated successfully",
          updatedLoadbankId,
        });
      } else if (pdcId !== pdcToEdit && loadbankId !== loadbankToEdit) {
        const updatedLoadbankId = await LoadbankCatcherModel.findOneAndUpdate(
          { loadbankId: loadbankId },
          {
            $set: {
              loadbankId: loadbankToEdit,
              link: `http://localhost:3000/Dashboard/Loadbank/${loadbankToEdit}`,
            },
          },
          { new: true }
        );

        // Add the loadbank to the future pdc and remove it from the current pdc
        if (futurePdc && currentPdc && currentPdc.loadbanks) {
          futurePdc.loadbanks.push(currentLoadbank._id);
          currentPdc.loadbanks.pull(currentLoadbank._id);

          // Save changes to both pdcs
          await futurePdc.save();
          await currentPdc.save();
        }

        res.status(200).json({
          message: "Loadbank moved and updated successfully",
          futurePdc,
          updatedLoadbankId,
        });
      } else if (pdcId === pdcToEdit && loadbankId === loadbankToEdit) {
        res.status(200).json({ message: "No changes" });
      }
    } catch (error) {
      res
        .status(500)
        .json({ message: "Internal Server Error", error: error.message });
    }
  }
);

module.exports = router;
