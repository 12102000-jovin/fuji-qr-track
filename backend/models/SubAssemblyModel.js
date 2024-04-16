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
    collection: "primaryMCCB",
  }
);

const CatcherMCCBSchema = new mongoose.Schema(
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
    collection: "catcherMCCB",
  }
);

const CTInterfaceLeftSchema = new mongoose.Schema(
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
    CTId: {
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
    collection: "leftCTInterface",
  }
);

const CTInterfaceRightSchema = new mongoose.Schema(
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
    CTId: {
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
    collection: "rightCTInterface",
  }
);

const ChassisRailLeftPrimarySchema = new mongoose.Schema(
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
    chassisId: {
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
    collection: "leftPrimaryChassisRail",
  }
);

const ChassisRailRightPrimarySchema = new mongoose.Schema(
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
    chassisId: {
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
    collection: "rightPrimaryChassisRail",
  }
);

const ChassisRailLeftCatcherSchema = new mongoose.Schema(
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
    chassisId: {
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
    collection: "leftCatcherChassisRail",
  }
);

const ChassisRailRightCatcherSchema = new mongoose.Schema(
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
    chassisId: {
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
    collection: "rightCatcherChassisRail",
  }
);

const RoofPrimarySchema = new mongoose.Schema(
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
    roofId: {
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
    collection: "primaryRoof",
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
  CatcherMCCBModel: mongoose.model("CatcherMCCBModel", CatcherMCCBSchema),
  CTInterfaceLeftModel: mongoose.model(
    "LeftCTInterfaceModel",
    CTInterfaceLeftSchema
  ),
  CTInterfaceRightModel: mongoose.model(
    "RightCTInterfaceModel",
    CTInterfaceRightSchema
  ),
  ChassisRailLeftPrimaryModel: mongoose.model(
    "LeftPrimaryChassisRailModel",
    ChassisRailLeftPrimarySchema
  ),
  ChassisRailRightPrimaryModel: mongoose.model(
    "RightPrimaryChassisRailModel",
    ChassisRailRightPrimarySchema
  ),
  ChassisRailLeftCatcherModel: mongoose.model(
    "LeftCatcherChassisRailModel",
    ChassisRailLeftCatcherSchema
  ),
  ChassisRailRightCatcherModel: mongoose.model(
    "RightCatcherChassisRailModel",
    ChassisRailRightCatcherSchema
  ),
  RoofPrimaryModel: mongoose.model("PrimaryRoofModel", RoofPrimarySchema),
};
