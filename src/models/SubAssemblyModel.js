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
  },
  {
    collection: "loadbank",
  }
);

// Export both models
module.exports = {
  LoadbankModel: mongoose.model("LoadbankModel", LoadbankSchema),
  PanelModel: mongoose.model("PanelModel", PanelSchema),
};
