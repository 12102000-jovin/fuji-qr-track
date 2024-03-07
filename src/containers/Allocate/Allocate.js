import React, { useState, useRef } from "react";
import QrCodeScannerRoundedIcon from "@mui/icons-material/QrCodeScannerRounded";
import axios from "axios";
import moment from "moment-timezone";

const Allocate = () => {
  const [inputPDCValue, setInputPDCValue] = useState("");
  const [showSubAssemblyInput, setShowSubAssemblyInput] = useState(false);
  const [wrongPDCQRError, setWrongPDCQRError] = useState(false);

  const [inputPanelValue, setInputPanelValue] = useState("");
  const [wrongPanelQRError, setWrongPanelQRError] = useState(false);

  const [inputLoadbankValue, setInputLoadbankValue] = useState("");
  const [wrongLoadbankQRError, setWrongLoadbankQRError] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");
  const [successfulMessage, setSuccessfulMessage] = useState("");

  const pdcInputRef = useRef(null); // Create a ref for the "Select PDC" input
  const resetPDCRef = useRef(null); // Create a ref for the scan button

  const AllocateSubAssembly_API =
    "http://localhost:3001/Allocate/AllocateSubAssembly";

  const handlePDCInputChange = (event) => {
    setInputPDCValue(event.target.value);
  };

  const handlePanelInputChange = (event) => {
    setInputPanelValue(event.target.value);
  };

  const handleLoadbankInputChange = (event) => {
    setInputLoadbankValue(event.target.value);
  };

  const handlePDCKeyDown = (event) => {
    if (event.key === "Enter") {
      const isPDCPattern = /^PDC\d{6}$/.test(inputPDCValue);
      if (isPDCPattern) {
        setInputPDCValue(inputPDCValue);
        setShowSubAssemblyInput(true);
        setWrongPDCQRError(false);
        setInputPanelValue("");
        setWrongPanelQRError(false);
      } else {
        try {
          const parsedInput = JSON.parse(inputPDCValue);
          if (parsedInput.pdcId) {
            setInputPDCValue(parsedInput.pdcId);
            setShowSubAssemblyInput(true);
            setWrongPDCQRError(false);
            setInputPanelValue("");
            setWrongPanelQRError(false);
          } else {
            setShowSubAssemblyInput(false);
            setWrongPDCQRError(true);
          }
        } catch (error) {
          setShowSubAssemblyInput(false);
          setWrongPDCQRError(true);
        }
      }
    }
  };

  const handlePanelKeyDown = (event) => {
    if (event.key === "Enter") {
      const isPanelPattern = /^PANEL\d{6}$/.test(inputPanelValue);
      if (isPanelPattern) {
        setInputPanelValue(inputPanelValue);
        setWrongPanelQRError(false);
      } else {
        try {
          const parsedInput = JSON.parse(inputPanelValue);
          if (parsedInput.panelId) {
            setInputPanelValue(parsedInput.panelId);
            setWrongPanelQRError(false);
          } else {
            // setShowSubAssemblyInput(false);
            setWrongPanelQRError(true);
          }
        } catch (error) {
          //   setShowSubAssemblyInput(false);
          setWrongPanelQRError(true);
        }
      }
    }
  };

  const handleLoadbankKeyDown = (event) => {
    if (event.key === "Enter") {
      const isLoadbankPattern = /^LB\d{6}$/.test(inputLoadbankValue);
      if (isLoadbankPattern) {
        setInputLoadbankValue(inputLoadbankValue);
        setWrongLoadbankQRError(false);
      } else {
        try {
          const parsedInput = JSON.parse(inputLoadbankValue);
          if (parsedInput.loadbankId) {
            setInputLoadbankValue(parsedInput.loadbankId);
            setWrongLoadbankQRError(false);
          } else {
            setWrongLoadbankQRError(true);
          }
        } catch (error) {
          //   setShowSubAssemblyInput(false);
          setWrongLoadbankQRError(true);
        }
      }
    }
  };

  const handlePDCscan = () => {
    // Focus on the "Select PDC" input when the button is clicked
    pdcInputRef.current.focus();
    setInputPDCValue("");
    setShowSubAssemblyInput(false);
    setErrorMessage("");
  };

  const handleKeyPress = (event) => {
    if (event.key === "]") {
      event.preventDefault();
      // Focus on the scan button when "]" key is pressed      // Reset PDC
      resetPDCRef.current.focus();
      setSuccessfulMessage("");
      setErrorMessage("");
    }
  };

  const handleAllocate = async () => {
    try {
      const response = await axios.post(AllocateSubAssembly_API, {
        inputPDCValue,
        inputPanelValue,
        inputLoadbankValue,
      });
      // Handle the response
      console.log(response.data);

      // Clear error message if successful
      setErrorMessage("");
      setSuccessfulMessage("Sub-Assembly Allocated to PDC successfully");
    } catch (error) {
      // Handle error and set error message
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
    <div onKeyDown={handleKeyPress} tabIndex={0}>
      <div className="flex justify-center bg-background border-none">
        <div className="w-3/4 p-6 shadow-lg bg-white text-black rounded-md mt-5 mb-10">
          <div className="text-4xl text-center font-black text-signature">
            {" "}
            Allocate Sub-Assembly{" "}
          </div>
          <div className="flex justify-center">
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
          </div>
          <div className="mt-10">
            <label
              htmlFor="PDC"
              className="block text-base mb-2 flex justify-start font-bold text-xl"
            >
              Select PDC
            </label>
          </div>

          <div className="flex items-center justify-center">
            <div className="relative w-full">
              <input
                type="text"
                id="PDC"
                value={inputPDCValue}
                onChange={handlePDCInputChange}
                onKeyDown={handlePDCKeyDown}
                autoFocus
                ref={pdcInputRef}
                className="border w-full px-2 py-4 rounded-md focus:outline-none focus:ring-3 focus:border-gray-600 text-black"
                disabled={showSubAssemblyInput}
              />
              <button
                ref={resetPDCRef}
                className="absolute right-0 top-1/2 transform -translate-y-1/2  bg-signature text-white p-2 mr-2 rounded-md hover:bg-secondary"
                onClick={handlePDCscan}
              >
                <div className="flex items-center">
                  <span className="font-bold"> Scan </span>
                  <span> &nbsp; </span>
                  <QrCodeScannerRoundedIcon />
                </div>
              </button>
            </div>
          </div>

          {wrongPDCQRError && (
            <div className="flex justify-start">
              <span className="p-1 pl-2 pr-2 bg-red-500 text-xs rounded-full text-white font-bold mt-2">
                {" "}
                Invalid PDC QR{" "}
              </span>{" "}
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-center bg-background border-none">
        <div className="w-3/4">
          {showSubAssemblyInput && (
            <div>
              <div className="p-5 bg-signature text-white font-bold rounded-md">
                <div className="flex justify-start text-3xl font-black ">
                  Sub-Assembly
                </div>

                {/* =============== P A N E L  ===============*/}
                <div className="flex justify-start">
                  <label
                    htmlFor="Panel"
                    className="block text-base mt-10 font-black text-xl p-1 text-white rounded-md"
                  >
                    Panel
                  </label>
                </div>
                <input
                  type="text"
                  id="Panel"
                  onChange={handlePanelInputChange}
                  onKeyDown={handlePanelKeyDown}
                  autoFocus
                  value={inputPanelValue}
                  className="border w-full px-2 py-3 rounded-md focus:outline-none focus:ring-3 focus:border-gray-600 text-black"
                />
                {wrongPanelQRError && (
                  <div className="flex justify-start">
                    <span className="p-1 pl-2 pr-2 bg-red-500 text-xs rounded-full text-white font-bold mt-2">
                      {" "}
                      Invalid Panel QR{" "}
                    </span>{" "}
                  </div>
                )}

                {/* =============== L O A D B A N K  ===============*/}
                <div className="flex justify-start">
                  <label
                    htmlFor="Panel"
                    className="block text-base mt-10 font-black text-xl p-1 text-white rounded-md"
                  >
                    Loadbank
                  </label>
                </div>

                <input
                  type="text"
                  id="Loadbank"
                  onChange={handleLoadbankInputChange}
                  onKeyDown={handleLoadbankKeyDown}
                  autoFocus
                  value={inputLoadbankValue}
                  className="border w-full px-2 py-3 rounded-md focus:outline-none focus:ring-3 focus:border-gray-600 text-black"
                />
                {wrongLoadbankQRError && (
                  <div className="flex justify-start">
                    <span className="p-1 pl-2 pr-2 bg-red-500 text-xs rounded-full text-white font-bold mt-2">
                      {" "}
                      Invalid Loadbank QR{" "}
                    </span>{" "}
                  </div>
                )}

                <div className="flex justify-start">
                  <label
                    htmlFor="Other Sub-Assembly"
                    className="block text-base mt-10 font-black text-xl p-1 text-whhite rounded-md"
                  >
                    Other Sub-Assembly...
                  </label>
                </div>
                <input
                  type="text"
                  className="border w-full px-2 py-3 rounded-md focus:outline-none focus:ring-3 focus:border-gray-600 text-black"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      <button
        className="p-3 bg-black text-white font-black rounded-md mt-5"
        onClick={handleAllocate}
      >
        {" "}
        Allocate SubAssembly to PDC
      </button>
    </div>
  );
};

export default Allocate;
