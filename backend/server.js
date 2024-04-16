// Load environment variables from a .env file
require("dotenv").config();

// Import necessary libraries and modules
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// Retrieve the MongoDB connection string from the environment variables
const mongoString = process.env.DATABASE_URL;

// Connect to MongoDB using Mongoose
mongoose.connect(mongoString);
const database = mongoose.connection;

// Event listener for MongoDB connection error
database.on("error", (error) => {
  console.error("MongoDB connection error:", error);
});

// Event listener for successful MongoDB connection
database.once("connected", () => {
  console.log("Database Connected");
});

// Create an instance of the Express application
const app = express();

// Enable JSON parsing for incoming requests
app.use(express.json());

// Enable CORS to allow cross-origin resource sharing
app.use(cors());

// Start the Express server on port 3001
const port = process.env.REACT_APP_SERVER_PORT;
app.listen(port, () => {
  console.log(`Server Started at http://localhost:${port}`);
});

const workOrderRoute = require("./routes/WorkOrderRoute");
app.use("/WorkOrder", workOrderRoute);

const pdcRoute = require("./routes/PDCRoute");
app.use("/PDC", pdcRoute);

const panelSubAssembly = require("./routes/PanelRoute");
app.use("/SubAssembly", panelSubAssembly);

const loadbankSubAssembly = require("./routes/LoadbankRoute");
app.use("/SubAssembly", loadbankSubAssembly);

const MCCBRoute = require("./routes/MCCBRoute");
app.use("/SubAssembly", MCCBRoute);

const CTInterfaceRoute = require("./routes/CTInterfaceRoute");
app.use("/SubAssembly", CTInterfaceRoute);

const ChassisRailRoute = require("./routes/ChassisRailRoute");
app.use("/SubAssembly", ChassisRailRoute);

const RoofRoute = require("./routes/RoofRoute");
app.use("/SubAssembly", RoofRoute);

const allocateRoute = require("./routes/AllocateRoute");
app.use("/Allocate", allocateRoute);

const dashboardRoute = require("./routes/DashboardRoute");
app.use("/Dashboard", dashboardRoute);

const componentRoute = require("./routes/ComponentRoute");
app.use("/Component", componentRoute);

module.exports = app;
