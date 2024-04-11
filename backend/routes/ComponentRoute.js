const express = require("express");

const router = express.Router();

const ComponentModel = require("../models/ComponentModel");
const {
  PanelModel,
  LoadbankModel,
  LoadbankCatcherModel,
  PrimaryMCCBModel,
  CatcherMCCBModel,
  CTInterfaceLeftModel,
  CTInterfaceRightModel,
} = require("../models/SubAssemblyModel");

router.get("/getAllComponents", async (req, res) => {
  try {
    const ComponentData = await ComponentModel.find();
    res.json(ComponentData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete("/deleteComponent/:componentSerialNumber", async (req, res) => {
  try {
    const componentId = req.params.componentSerialNumber;

    const componentToDelete = await ComponentModel.findOneAndDelete({
      componentSerialNumber: componentId,
    });

    if (!componentToDelete) {
      return res.status(404).json({ message: "Component not found" });
    }

    // Extract the _id field of the deleted PDC
    const deletedComponentObjectId = componentToDelete._id;

    // Extract the _id field of the deleted component
    await PanelModel.updateMany(
      { components: deletedComponentObjectId },
      { $pull: { components: deletedComponentObjectId } }
    );

    // Extract the _id field of the deleted component
    await LoadbankModel.updateMany(
      { components: deletedComponentObjectId },
      { $pull: { components: deletedComponentObjectId } }
    );

    // Extract the _id field of the deleted component
    await LoadbankCatcherModel.updateMany(
      { components: deletedComponentObjectId },
      { $pull: { components: deletedComponentObjectId } }
    );

    // Extract the _id field of the deleted component
    await PrimaryMCCBModel.updateMany(
      { components: deletedComponentObjectId },
      { $pull: { components: deletedComponentObjectId } }
    );

    // Extract the _id field of the deleted component
    await CatcherMCCBModel.updateMany(
      { components: deletedComponentObjectId },
      { $pull: { components: deletedComponentObjectId } }
    );

    // Extract the _id field of the deleted component
    await CTInterfaceLeftModel.updateMany(
      { components: deletedComponentObjectId },
      { $pull: { components: deletedComponentObjectId } }
    );

    // Extract the _id field of the deleted component
    await CTInterfaceRightModel.updateMany(
      { components: deletedComponentObjectId },
      { $pull: { components: deletedComponentObjectId } }
    );

    console.log(componentToDelete);
    res.status(200).json({ message: "Component deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
