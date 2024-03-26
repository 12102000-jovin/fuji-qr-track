import React, { useState } from "react";
import axios from "axios";
import moment from "moment-timezone";
import PhotoIcon from "@mui/icons-material/Photo";
import ComponentImageModal from "./ComponentImageModal";
import CircularProgress from "@mui/material/CircularProgress";
import Tooltip from "@mui/material/Tooltip";

const PanelComponentForm = (panelId) => {
  const [switchValue, setSwitchValue] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successfulMessage, setSuccessfulMessage] = useState("");
  const [componentImageModalState, setComponentImageModalState] =
    useState(false);

  const [isAllocateLoading, setIsAllocateLoading] = useState(false);

  const AllocatePanel_API =
    "http://localhost:3001/Allocate/AllocatePanelComponent";

  const handleSwitchChange = (e) => {
    setSwitchValue(e.target.value);
  };

  const handleOpenImageModal = () => {
    setComponentImageModalState(true);
  };

  const handleCloseImageModal = () => {
    setComponentImageModalState(false);
  };

  const handleAllocate = async () => {
    try {
      setIsAllocateLoading(true);
      const response = await axios.post(AllocatePanel_API, {
        panelId: panelId.panelId,
        componentType: "Switch",
        componentSerialNumber: switchValue,
        allocatedDate: moment()
          .tz("Australia/Sydney")
          .format("YYYY-MM-DD HH:mm:ss"),
      });

      //Handle the response
      console.log(response.data);

      // Clear error message if successful
      setErrorMessage("");
      setSuccessfulMessage("Component Allocated to Panel successfully");
      setIsAllocateLoading(false);
    } catch (error) {
      if (error.response) {
        setSuccessfulMessage("");
        setErrorMessage(error.response.data.message || "Internal Server Error");
        setIsAllocateLoading(false);
      } else {
        setSuccessfulMessage("");
        setErrorMessage("Error making the request");
        setIsAllocateLoading(false);
      }
    }
  };

  return (
    <div>
      <div className="p-5 bg-signature text-white rounded-md">
        <div className="flex justify-start text-2xl font-black mb-5">
          Panel Components
        </div>
        {errorMessage && (
          <span className="p-1 pl-2 pr-2 bg-red-500 text-xs rounded-full text-white font-bold mt-2">
            {errorMessage}
          </span>
        )}
        {successfulMessage && (
          <span className="p-1 pl-2 pr-2 bg-green-500 text-xs rounded-full text-white font-bold mt-2">
            {successfulMessage}
          </span>
        )}
        <div className="flex justify-start">
          <label
            htmlFor="component1"
            className="block text-base mt-5 font-black text-xl p-1 text-white rounded-md"
          >
            <div className="flex items-center">
              Switch{" "}
              <Tooltip
                title="View Switch Image"
                placement="top"
                arrow
                slotProps={{
                  popper: {
                    modifiers: [
                      {
                        name: "offset",
                        options: {
                          offset: [0, -5],
                        },
                      },
                    ],
                  },
                }}
              >
                <PhotoIcon
                  fontSize="small"
                  className="ml-2"
                  onClick={handleOpenImageModal}
                />
              </Tooltip>
            </div>

            <ComponentImageModal
              open={componentImageModalState}
              onClose={() => handleCloseImageModal()}
              type="Switch"
            />
          </label>
        </div>
        <input
          type="text"
          id="component1"
          onChange={handleSwitchChange}
          //   onKeyDown={handlePanelKeyDown}
          autoFocus
          value={switchValue}
          className="border w-full px-2 py-3 rounded-md text-black focus:outline-none focus:ring-3 focus:border-gray-600"
          placeholder="Enter Switch"
        />

        <div className="flex justify-start">
          <label
            htmlFor="Other Sub-Assembly"
            className="block text-base mt-10 font-black text-xl p-1 text-white rounded-md"
          >
            Other Components...
          </label>
        </div>
        <input
          type="text"
          className="border w-full px-2 py-3 rounded-md focus:outline-none focus:ring-3 focus:border-gray-600 text-black"
        />
        <div className="flex justify-center">
          <button
            className="p-3 bg-black text-white font-black rounded-md mt-5"
            onClick={handleAllocate}
          >
            <div className="flex items-center">
              {isAllocateLoading && (
                <CircularProgress
                  color="inherit"
                  style={{ width: "20px", height: "20px", marginRight: "8px" }}
                />
              )}
              {isAllocateLoading
                ? "Allocating..."
                : `Allocate Components to ${panelId.panelId}`}
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PanelComponentForm;
