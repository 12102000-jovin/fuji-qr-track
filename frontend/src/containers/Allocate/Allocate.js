import React, { useState, useRef } from "react";
import axios from "axios";
import CircularProgress from "@mui/material/CircularProgress";

const Allocate = () => {
  const [inputPDCValue, setInputPDCValue] = useState("");
  const [showSubAssemblyInput, setShowSubAssemblyInput] = useState(false);
  const [detectedType, setDetectedType] = useState("");
  const [wrongPDCQRError, setWrongPDCQRError] = useState(false);
  const [isAllocateLoading, setIsAllocateLoading] = useState(false);

  const [subAssemblyInputValue, setSubAssemblyInputValue] = useState("");
  const [wrongSubAssemblyError, setWrongSubAssemblyError] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");
  const [successfulMessage, setSuccessfulMessage] = useState("");

  const pdcInputRef = useRef(null);
  const resetPDCRef = useRef(null);

  const subAssemblyInputRef = useRef(null);
  const resetSubAssemblyRef = useRef(null);

  const allocateSubAssemblyRef = useRef(null);

  const AllocateSubAssembly_API =
    "http://localhost:3001/Allocate/AllocateSubAssembly";

  const handlePDCInputChange = (event) => {
    setInputPDCValue(event.target.value);
  };

  const handleSubAssemblyInputChange = (event) => {
    setSubAssemblyInputValue(event.target.value);
  };

  const handlePDCKeyDown = (event) => {
    if (event.key === "Enter") {
      const isPDCPattern = /^PDC\d{6}$/.test(inputPDCValue);
      if (isPDCPattern) {
        setInputPDCValue(inputPDCValue);
        setShowSubAssemblyInput(true);
        setWrongPDCQRError(false);
      } else {
        try {
          const parsedInput = JSON.parse(inputPDCValue);
          if (parsedInput.pdcId) {
            setInputPDCValue(parsedInput.pdcId);
            setShowSubAssemblyInput(true);
            setWrongPDCQRError(false);
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

  const handleSubAssemblyKeyDown = (event) => {
    if (event.key === "Enter") {
      console.log("Entered");
      const isPanelPattern = /^CPAN\d{6}$/.test(subAssemblyInputValue);
      const isLoadbankPattern = /^LB\d{6}-P$/.test(subAssemblyInputValue);
      const isLoadbankCatcherPattern = /^LB\d{6}-C$/.test(
        subAssemblyInputValue
      );
      const isMCCBPrimaryPattern = /^MCCBPAN\d{6}-P$/.test(
        subAssemblyInputValue
      );
      const isMCCBCatcherPattern = /^MCCBPAN\d{6}-C$/.test(
        subAssemblyInputValue
      );
      const isCTInterfaceLeftPattern = /^CT\d{6}L-P$/.test(
        subAssemblyInputValue
      );
      const isCTInterfaceRightPattern = /^CT\d{6}R-P$/.test(
        subAssemblyInputValue
      );
      const isChassisRailLeftPrimaryPattern = /^CHR\d{6}L-P$/.test(
        subAssemblyInputValue
      );

      const isChassisRailRightPrimaryPattern = /^CHR\d{6}R-P$/.test(
        subAssemblyInputValue
      );

      const isChassisRailLeftCatcherPattern = /^CHR\d{6}L-C$/.test(
        subAssemblyInputValue
      );

      const isChassisRailRightCatcherPattern = /^CHR\d{6}R-C$/.test(
        subAssemblyInputValue
      );
      const isRoofPrimaryPattern = /^ROOF\d{6}-P$/.test(subAssemblyInputValue);

      if (isPanelPattern) {
        setShowSubAssemblyInput(subAssemblyInputValue);
        setDetectedType("Panel");
        setWrongSubAssemblyError(false);
      } else if (isLoadbankPattern) {
        setShowSubAssemblyInput(subAssemblyInputValue);
        setDetectedType("Loadbank (Primary)");
        setWrongSubAssemblyError(false);
      } else if (isLoadbankCatcherPattern) {
        setShowSubAssemblyInput(subAssemblyInputValue);
        setDetectedType("Loadbank (Catcher)");
        setWrongSubAssemblyError(false);
      } else if (isMCCBPrimaryPattern) {
        setShowSubAssemblyInput(subAssemblyInputValue);
        setDetectedType("MCCB Panel (Primary)");
        setWrongSubAssemblyError(false);
      } else if (isMCCBCatcherPattern) {
        setShowSubAssemblyInput(subAssemblyInputValue);
        setDetectedType("MCCB Panel (Catcher)");
        setWrongSubAssemblyError(false);
      } else if (isCTInterfaceLeftPattern) {
        setShowSubAssemblyInput(subAssemblyInputValue);
        setDetectedType("CT Interface (Left)");
        setWrongSubAssemblyError(false);
      } else if (isCTInterfaceRightPattern) {
        setShowSubAssemblyInput(subAssemblyInputValue);
        setDetectedType("CT Interface (Right)");
        setWrongSubAssemblyError(false);
      } else if (isChassisRailLeftPrimaryPattern) {
        setShowSubAssemblyInput(subAssemblyInputValue);
        setDetectedType("Chassis Rail (Left) (Primary)");
        setWrongSubAssemblyError(false);
      } else if (isChassisRailRightPrimaryPattern) {
        setShowSubAssemblyInput(subAssemblyInputValue);
        setDetectedType("Chassis Rail (Right) (Primary)");
        setWrongSubAssemblyError(false);
      } else if (isChassisRailLeftCatcherPattern) {
        setShowSubAssemblyInput(subAssemblyInputValue);
        setDetectedType("Chassis Rail (Left) (Catcher)");
        setWrongSubAssemblyError(false);
      } else if (isChassisRailRightCatcherPattern) {
        setShowSubAssemblyInput(subAssemblyInputValue);
        setDetectedType("Chassis Rail (Right) (Catcher)");
        setWrongSubAssemblyError(false);
      } else if (isRoofPrimaryPattern) {
        setShowSubAssemblyInput(subAssemblyInputValue);
        setDetectedType("Roof (Primary)");
        setWrongSubAssemblyError(false);
      } else {
        try {
          const parsedInput = JSON.parse(subAssemblyInputValue);
          if (parsedInput.panelId) {
            console.log("Panel Detected");
            setSubAssemblyInputValue(parsedInput.panelId);
            setDetectedType("Panel");
            setWrongSubAssemblyError(false);
          } else if (parsedInput.loadbankPrimaryId) {
            setSubAssemblyInputValue(parsedInput.loadbankPrimaryId);
            setDetectedType("Loadbank (Primary)");
            setWrongSubAssemblyError(false);
          } else if (parsedInput.loadbankCatcherId) {
            setSubAssemblyInputValue(parsedInput.loadbankCatcherId);
            setDetectedType("Loadbank (Catcher)");
            setWrongSubAssemblyError(false);
          } else if (parsedInput.MCCBPrimaryId) {
            setSubAssemblyInputValue(parsedInput.MCCBPrimaryId);
            setDetectedType("MCCB Panel (Primary)");
            setWrongSubAssemblyError(false);
          } else if (parsedInput.MCCBCatcherId) {
            setSubAssemblyInputValue(parsedInput.MCCBCatcherId);
            setDetectedType("MCCB Panel (Catcher)");
            setWrongSubAssemblyError(false);
          } else if (parsedInput.leftCTInterfaceId) {
            setSubAssemblyInputValue(parsedInput.leftCTInterfaceId);
            setDetectedType("CT Interface (Left)");
            setWrongSubAssemblyError(false);
          } else if (parsedInput.rightCTInterfaceId) {
            setSubAssemblyInputValue(parsedInput.rightCTInterfaceId);
            setDetectedType("CT Interface (Right)");
            setWrongSubAssemblyError(false);
          } else if (parsedInput.leftPrimaryChassisRailId) {
            setSubAssemblyInputValue(parsedInput.leftPrimaryChassisRailId);
            setDetectedType("Chassis Rail (Left) (Primary)");
            setWrongSubAssemblyError(false);
          } else if (parsedInput.rightPrimaryChassisRailId) {
            setSubAssemblyInputValue(parsedInput.rightPrimaryChassisRailId);
            setDetectedType("Chassis Rail (Right) (Primary)");
            setWrongSubAssemblyError(false);
          } else if (parsedInput.leftCatcherChassisRailId) {
            setSubAssemblyInputValue(parsedInput.leftCatcherChassisRailId);
            setDetectedType("Chassis Rail (Left) (Catcher)");
            setWrongSubAssemblyError(false);
          } else if (parsedInput.rightCatcherChassisRailId) {
            setSubAssemblyInputValue(parsedInput.rightCatcherChassisRailId);
            setDetectedType("Chassis Rail (Right) (Catcher)");
            setWrongSubAssemblyError(false);
          } else if (parsedInput.roofPrimaryId) {
            setSubAssemblyInputValue(parsedInput.roofPrimaryId);
            setDetectedType("Roof (Primary)");
            setWrongSubAssemblyError(false);
          } else {
            setWrongSubAssemblyError(true);
            setDetectedType("");
          }
        } catch (error) {
          setWrongSubAssemblyError(true);
          setDetectedType("");
        }
      }
    }
  };

  const handleResetPDCscan = () => {
    // Focus on the "Select PDC" input when the button is clicked
    pdcInputRef.current.focus();
    setSubAssemblyInputValue("");
    setInputPDCValue("");
    setShowSubAssemblyInput(false);
    setErrorMessage("");
    setSuccessfulMessage("");
    setDetectedType("");
  };

  const handleResetSubAssemblyScan = () => {
    // Focus on the "Select SubAssembly" input when the button is clicked
    subAssemblyInputRef.current.focus();
    setSubAssemblyInputValue("");
    setErrorMessage("");
    setDetectedType("");
    setSuccessfulMessage("");
    setWrongSubAssemblyError("");
  };

  const handleKeyPress = (event) => {
    if (event.key === "]") {
      event.preventDefault();
      // Focus on the reset button when "]" key is pressed      // Reset PDC
      resetPDCRef.current.focus();
      setSuccessfulMessage("");
      setErrorMessage("");
      setDetectedType("");
      setWrongPDCQRError("");
    } else if (event.key === "[") {
      // Focus on the reset button when "[" key is pressed      // Reset SubAssembly
      if (showSubAssemblyInput) {
        resetSubAssemblyRef.current.focus();
      }
    } else if (event.key === "#") {
      if (showSubAssemblyInput && subAssemblyInputValue && detectedType) {
        allocateSubAssemblyRef.current.focus();
      }
    }
  };

  const handleAllocate = async () => {
    try {
      setIsAllocateLoading(true);
      const response = await axios.post(AllocateSubAssembly_API, {
        inputPDCValue,
        subAssemblyInputValue,
      });

      // Clear error message if successful
      setErrorMessage("");
      if (response.status === 200) {
        setSuccessfulMessage(`${detectedType} Allocated to PDC successfully`);
        setIsAllocateLoading(false);
      }
    } catch (error) {
      // Handle error and set error message
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
    <div onKeyDown={handleKeyPress} tabIndex={0}>
      <div className="flex justify-center bg-background border-none">
        <div className="w-3/4 p-5 shadow-lg bg-white text-black rounded-md mt-5 mb-10">
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
                placeholder="Enter PDC"
              />
              <button
                ref={resetPDCRef}
                className="absolute right-0 top-1/2 transform -translate-y-1/2  bg-black text-white p-2 mr-2 rounded-md hover:bg-secondary"
                onClick={handleResetPDCscan}
              >
                <div className="flex items-center">
                  <span className="font-bold"> Reset </span>
                </div>
              </button>
            </div>
          </div>

          {wrongPDCQRError && (
            <div className="flex justify-start">
              <span className="p-1 pl-2 pr-2 bg-red-500 text-xs rounded-full text-white mt-2">
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
              <div className="p-5 bg-signature rounded-md">
                <div className="flex justify-start">
                  <label
                    htmlFor="subAssembly"
                    className="block text-base font-black text-xl p-1 text-white"
                  >
                    Select Sub-Assembly
                  </label>
                </div>
                <div className="relative w-full">
                  <input
                    type="text"
                    id="subAssembly"
                    onChange={handleSubAssemblyInputChange}
                    onKeyDown={handleSubAssemblyKeyDown}
                    autoFocus
                    ref={subAssemblyInputRef}
                    value={subAssemblyInputValue}
                    className="border w-full px-2 py-4 rounded-md focus:outline-none focus:ring-3 focus:border-gray-600 text-black"
                    placeholder="Enter Sub-Assembly"
                    disabled={detectedType}
                  />
                  <button
                    ref={resetSubAssemblyRef}
                    className="absolute right-0 top-1/2 transform -translate-y-1/2  font-bold bg-black text-white p-2 mr-2 rounded-md hover:bg-secondary"
                    onClick={handleResetSubAssemblyScan}
                  >
                    Reset
                  </button>
                </div>

                {wrongSubAssemblyError && (
                  <div className="flex justify-start">
                    <span className="p-1 pl-2 pr-2 bg-red-500 text-xs rounded-full text-white font-bold mt-2">
                      {" "}
                      Invalid SubAssembly QR{" "}
                    </span>{" "}
                  </div>
                )}
                {detectedType && (
                  <div className="flex justify-start">
                    <span className="p-1 pl-2 pr-2 bg-green-500 text-xs rounded-full text-white font-bold mt-2">
                      {detectedType} Detected
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {inputPDCValue && subAssemblyInputValue && detectedType && (
        <div className="flex justify-center">
          <button
            className="p-3 bg-black text-white font-black rounded-md mt-5"
            onClick={handleAllocate}
            ref={allocateSubAssemblyRef}
          >
            <div className="flex justify-center items-center">
              {isAllocateLoading && (
                <CircularProgress
                  color="inherit"
                  style={{
                    width: "20px",
                    height: "20px",
                    marginRight: "8px",
                  }}
                />
              )}
              {isAllocateLoading
                ? "Allocating..."
                : `Allocate ${detectedType} to PDC`}
            </div>
          </button>
        </div>
      )}
    </div>
  );
};

export default Allocate;
