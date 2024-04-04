const mongoose = require("mongoose");

const PDCSchema = new mongoose.Schema(
  {
    link: {
      required: true,
      type: String,
    },
    generatedDate: {
      type: String,
      required: true,
    },
    pdcId: {
      type: String,
      required: true,
      unique: true,
    },
    allocatedDate: {
      type: String,
    },
    panels: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "PanelModel",
      },
    ],
    loadbanks: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "LoadbankModel",
      },
    ],
    catcherLoadbanks: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "LoadbankModel",
      },
    ],
    primaryMCCBs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "PrimaryMCCBModel",
      },
    ],
  },
  {
    collection: "pdc",
  }
);

module.exports = mongoose.model("PDCModel", PDCSchema);
