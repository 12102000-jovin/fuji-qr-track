const mongoose = require("mongoose");

const ComponentSchema = new mongoose.Schema(
  {
    componentType: {
      type: String,
      required: true,
    },
    componentDescription: {
      type: String,
      required: true,
    },
    componentSerialNumber: {
      type: String,
      unique: true,
      required: true,
    },
    allocatedDate: {
      type: String,
    },
  },
  {
    collection: "component",
  }
);

module.exports = mongoose.model("ComponentModel", ComponentSchema);
