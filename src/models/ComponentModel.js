const mongoose = require("mongoose");

const ComponentSchema = new mongoose.Schema(
  {
    componentType: {
      type: String,
    },
    componentSerialNumber: {
      type: String,
      unique: true,
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
