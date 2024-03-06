import React, { useState } from "react";
import axios from "axios";
import moment from "moment-timezone";

const PanelComponentForm = (panelId) => {
  const [switchValue, setSwitchValue] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const AllocatePanel_API =
    "http://localhost:3001/Allocate/AllocatePanelComponent";

  const handleSwitchChange = (e) => {
    setSwitchValue(e.target.value);
  };

  const handleAllocate = async () => {
    try {
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
    } catch (error) {
      if (error.response) {
        setErrorMessage(error.response.data.message || "Internal Server Error");
      } else {
        setErrorMessage("Error making the request");
      }
    }
  };

  return (
    <div>
      <div className="p-5 bg-signature text-white font-bold rounded-md">
        <div className="flex justify-start text-3xl font-black ">
          Panel Components
        </div>
        <div className="flex justify-start">
          <label
            htmlFor="component1"
            className="block text-base mt-10 font-black text-xl p-1 text-white rounded-md"
          >
            Switch
          </label>
        </div>
        <input
          type="text"
          id="component1"
          onChange={handleSwitchChange}
          //   onKeyDown={handlePanelKeyDown}
          autoFocus
          value={switchValue}
          className="border w-full px-2 py-3 rounded-md focus:outline-none focus:ring-3 focus:border-gray-600 text-black"
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
        <button
          className="p-3 bg-black text-white font-black rounded-md mt-5"
          onClick={handleAllocate}
        >
          Allocate Components to {panelId.panelId}
        </button>
      </div>
    </div>
  );
};

export default PanelComponentForm;
