import React, { useState } from "react";
import axios from "axios";
import moment from "moment-timezone";

const LoadbankComponentForm = (loadbankId) => {
  const [meterValue, setMeterValue] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successfulMessage, setSuccessfulMessage] = useState("");

  const AllocateLoadbank_API =
    "http://localhost:3001/Allocate/AllocateLoadbankComponent";

  const handleMeterChange = (event) => {
    setMeterValue(event.target.value);
  };

  const handleAllocate = async () => {
    try {
      const response = await axios.post(AllocateLoadbank_API, {
        loadbankId: loadbankId.loadbankId,
        componentType: "Meter",
        componentSerialNumber: meterValue,
        allocatedDate: moment()
          .tz("Australia/Sydney")
          .format("YYYY-MM-DD HH:mm:ss"),
      });

      //Handle the response
      console.log(response.data);

      // Clear error message if successful
      setErrorMessage("");
      setSuccessfulMessage("Component Allocated to Loadbank successfully");
    } catch (error) {
      if (error.response) {
        setSuccessfulMessage("");
        setErrorMessage(error.response.data.message || "Internal Server Error");
      } else {
        setSuccessfulMessage("");
        setErrorMessage("Error making the request");
      }
    }
  };

  return (
    <div>
      <div className="p-5 bg-signature text-white font-bold rounded-md">
        <div className="flex justify-start text-2xl font-black">
          Loadbank Components
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
            className="block text-base mt-10 font-black text-xl p-1 text-white rounded-md"
          >
            Meter
          </label>
        </div>
        <input
          type="text"
          id="component1"
          onChange={handleMeterChange}
          autoFocus
          value={meterValue}
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
          Allocate Components to {loadbankId.loadbankId}
        </button>
      </div>
    </div>
  );
};

export default LoadbankComponentForm;
