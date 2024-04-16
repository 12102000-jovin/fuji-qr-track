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
    catcherMCCBs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "CatcherMCCBModel",
      },
    ],
    leftCTInterfaces: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "LeftCTInterfaceModel",
      },
    ],
    rightCTInterfaces: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "RightCTInterfaceModel",
      },
    ],
    leftPrimaryChassisRails: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "LeftPrimaryChassisRailModel",
      },
    ],
    rightPrimaryChassisRails: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "RightPrimaryChassisRailModel",
      },
    ],
    leftCatcherChassisRails: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "LeftCatcherChassisRailModel",
      },
    ],
    rightCatcherChassisRails: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "RightCatcherChassisRailModel",
      },
    ],
  },
  {
    collection: "pdc",
  }
);

module.exports = mongoose.model("PDCModel", PDCSchema);
