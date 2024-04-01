import React, { useState } from "react";
import axios from "axios";
import moment from "moment-timezone";
import PhotoIcon from "@mui/icons-material/Photo";
import ComponentImageModal from "./ComponentImageModal";
import CircularProgress from "@mui/material/CircularProgress";
import Tooltip from "@mui/material/Tooltip";

const PanelComponentForm = (panelId) => {
  const [switchValue, setSwitchValue] = useState("");
  const [breakerValue, setBreakerValue] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successfulMessage, setSuccessfulMessage] = useState("");
  const [componentImageModalState, setComponentImageModalState] =
    useState(false);
  const [componentImageModalType, setComponentImageModalType] = useState("");

  const [isAllocateLoading, setIsAllocateLoading] = useState(false);

  const AllocatePanel_API =
    "http://localhost:3001/Allocate/AllocatePanelComponent";

  const handleSwitchChange = (e) => {
    setSwitchValue(e.target.value);
  };

  const handleBreakerChange = (e) => {
    setBreakerValue(e.target.value);
  };

  const handleOpenImageModal = (type) => {
    setComponentImageModalState(true);
    setComponentImageModalType(type);
  };

  const handleCloseImageModal = () => {
    setComponentImageModalState(false);
    setComponentImageModalType("");
  };

  const handleAllocate = async () => {
    try {
      setIsAllocateLoading(true);

      if (switchValue !== null && switchValue !== "") {
        const response = await axios.post(AllocatePanel_API, {
          panelId: panelId.panelId,
          componentType: "Switch",
          componentDescription: "SW-DESC-12345678",
          componentSerialNumber: switchValue,
          allocatedDate: moment()
            .tz("Australia/Sydney")
            .format("YYYY-MM-DD HH:mm:ss"),
        });

        //Handle the response
        console.log("Switch Value", response.data);
      }

      if (breakerValue !== null && breakerValue !== "") {
        const response = await axios.post(AllocatePanel_API, {
          panelId: panelId.panelId,
          componentType: "Breaker",
          componentDescription: "BR-DESC-12345678",
          componentSerialNumber: breakerValue,
          allocatedDate: moment()
            .tz("Australia/Sydney")
            .format("YYYY-MM-DD HH:mm:ss"),
        });
        //Handle the response
        console.log("Breaker Value", response.data);
      }

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

        {/* ================================ S W I T C H ================================ */}
        <div>
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
                    onClick={() => handleOpenImageModal("Switch")}
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
        </div>

        {/* ================================ B R E A K E R S ================================ */}
        <div>
          <div className="flex justify-start">
            <label
              htmlFor="component1"
              className="block text-base mt-5 font-black text-xl p-1 text-white rounded-md"
            >
              <div className="flex items-center">
                Breaker{" "}
                <Tooltip
                  title="View Breaker Image"
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
                    onClick={() => handleOpenImageModal("Breaker")}
                  />
                </Tooltip>
              </div>

              <ComponentImageModal
                open={componentImageModalState}
                onClose={handleCloseImageModal}
                type={componentImageModalType}
              />
            </label>
          </div>
          <input
            type="text"
            id="component1"
            onChange={handleBreakerChange}
            //   onKeyDown={handlePanelKeyDown}
            autoFocus
            value={breakerValue}
            className="border w-full px-2 py-3 rounded-md text-black focus:outline-none focus:ring-3 focus:border-gray-600"
            placeholder="Enter Breaker"
          />
        </div>

        {/* ================================ A L L O C A T E   B U T T O N ================================ */}
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
