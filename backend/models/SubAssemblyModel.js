const mongoose = require("mongoose");

const PanelSchema = new mongoose.Schema(
  {
    link: {
      required: true,
      type: String,
      unique: true,
    },
    generatedDate: {
      type: String,
      required: true,
    },
    panelId: {
      type: String,
      required: true,
      unique: true,
    },
    allocatedDate: {
      type: String,
    },
    isAllocated: {
      type: Boolean,
      default: false,
    },
    components: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ComponentModel",
      },
    ],
  },
  {
    collection: "panel",
  }
);

const LoadbankSchema = new mongoose.Schema(
  {
    link: {
      required: true,
      type: String,
      unique: true,
    },
    generatedDate: {
      type: String,
      required: true,
    },
    loadbankId: {
      type: String,
      required: true,
      unique: true,
    },
    allocatedDate: {
      type: String,
    },
    isAllocated: {
      type: Boolean,
      default: false,
    },
    components: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ComponentModel",
      },
    ],
  },
  {
    collection: "loadbank",
  }
);

const LoadbankCatcherSchema = new mongoose.Schema(
  {
    link: {
      required: true,
      type: String,
      unique: true,
    },
    generatedDate: {
      type: String,
      required: true,
    },
    loadbankId: {
      type: String,
      required: true,
      unique: true,
    },
    allocatedDate: {
      type: String,
    },
    isAllocated: {
      type: Boolean,
      default: false,
    },
    components: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ComponentModel",
      },
    ],
  },
  {
    collection: "loadbankCatcher",
  }
);

const PrimaryMCCBSchema = new mongoose.Schema(
  {
    link: {
      required: true,
      type: String,
      unique: true,
    },
    generatedDate: {
      type: String,
      // required: true,
    },
    MCCBId: {
      type: String,
      required: true,
      unique: true,
    },
    allocatedDate: {
      type: String,
    },
    isAllocated: {
      type: Boolean,
      default: false,
    },
    components: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ComponentModel",
      },
    ],
  },
  {
    collection: "PrimaryMCCB",
  }
);

// Export both models
module.exports = {
  LoadbankModel: mongoose.model("LoadbankModel", LoadbankSchema),
  LoadbankCatcherModel: mongoose.model(
    "LoadbankCatcherModel",
    LoadbankCatcherSchema
  ),
  PanelModel: mongoose.model("PanelModel", PanelSchema),
  PrimaryMCCBModel: mongoose.model("PrimaryMCCBModel", PrimaryMCCBSchema),
};
