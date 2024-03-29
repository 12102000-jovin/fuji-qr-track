import React, { useState, useRef } from "react";
import PanelComponentForm from "../../components/ComponentForms/PanelComponentForm";
import LoadbankComponentForm from "../../components/ComponentForms/LoadbankComponentForm";

const AllocateComponents = () => {
  const [inputSubAssemblyValue, setInputSubAssemblyValue] = useState("");
  const [showPanelForm, setShowPanelForm] = useState(false);
  const [showLoadbankForm, setShowLoadbankForm] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const subAssemblyInputRef = useRef(null);
  const resetSubAssemblyRef = useRef(null);

  const handleSubAssemblyChange = (event) => {
    setInputSubAssemblyValue(event.target.value);
  };

  const handleSubAssemblyKeyDown = (event) => {
    if (event.key === "Enter") {
      const isPanelPattern = /^PANEL\d{6}$/.test(inputSubAssemblyValue);
      const isLoadbankPattern = /^LB\d{6}$/.test(inputSubAssemblyValue);

      if (isPanelPattern) {
        setShowPanelForm(true);
        setShowLoadbankForm(false);
        setErrorMessage("");
      } else if (isLoadbankPattern) {
        setShowPanelForm(false);
        setShowLoadbankForm(true);
        setErrorMessage("");
      } else {
        try {
          const parsedInput = JSON.parse(inputSubAssemblyValue);
          if (parsedInput.panelId && /^PANEL\d{6}$/.test(parsedInput.panelId)) {
            setInputSubAssemblyValue(parsedInput.panelId);
            setShowPanelForm(true);
            setShowLoadbankForm(false);
            setErrorMessage("");
          } else if (
            parsedInput.loadbankId &&
            /^LB\d{6}$/.test(parsedInput.loadbankId)
          ) {
            setInputSubAssemblyValue(parsedInput.loadbankId);
            setShowPanelForm(false);
            setShowLoadbankForm(true);
            setErrorMessage("");
          } else {
            setErrorMessage("Invalid Sub-Assembly QR");
          }
        } catch (error) {
          console.log("Parsing error:", error);
        }
      }
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "[") {
      event.preventDefault();
      subAssemblyInputRef.current.focus();
      setInputSubAssemblyValue("");
      setShowPanelForm("");
      setShowLoadbankForm("");
      setErrorMessage("");
    }
  };

  const handleResetSubAssemblyScan = () => {
    subAssemblyInputRef.current.focus();
    setInputSubAssemblyValue("");
    setShowPanelForm("");
    setShowLoadbankForm("");
    setErrorMessage("");
  };

  return (
    <div onKeyDown={handleKeyPress} tabIndex={0}>
      <div className="flex justify-center bg-background border-none">
        <div className="w-3/4 p-5 shadow-lg bg-white text-black rounded-md mt-5 mb-10">
          <div className="text-4xl text-center font-black text-signature">
            {" "}
            Allocate Components{" "}
          </div>
          <div className="mt-10">
            <label
              htmlFor="SubAssembly"
              className="block text-base mb-2 flex justify-start font-bold text-xl"
            >
              Select Sub-Assembly
            </label>
          </div>
          <div className="flex items-center justify-center">
            <div className="relative w-full">
              <input
                type="text"
                id="SubAssembly"
                value={inputSubAssemblyValue}
                onChange={handleSubAssemblyChange}
                onKeyDown={handleSubAssemblyKeyDown}
                autoFocus
                ref={subAssemblyInputRef}
                className="border w-full px-2 py-4 rounded-md focus:outline-none focus:ring-3 focus:border-gray-600 text-black"
                disabled={showPanelForm || showLoadbankForm}
                placeholder="Enter Sub-Assembly"
              />
              <button
                ref={resetSubAssemblyRef}
                className="absolute right-0 top-1/2 transform -translate-y-1/2  bg-black text-white p-2 mr-2 rounded-md hover:bg-secondary"
                // onClick={handlePDCscan}
              >
                <div
                  className="flex items-center font-bold"
                  onClick={handleResetSubAssemblyScan}
                >
                  Reset
                </div>
              </button>
            </div>
          </div>
          <div className="flex justify-start ">
            {errorMessage && (
              <p className="p-1 pl-2 pr-2 bg-red-500 text-xs rounded-full text-white font-bold mt-2">
                {errorMessage}
              </p>
            )}
          </div>
        </div>
      </div>
      <div className="flex justify-center bg-background border-none">
        <div className="w-3/4">
          {showPanelForm && (
            <PanelComponentForm panelId={inputSubAssemblyValue} />
          )}
          {showLoadbankForm && (
            <LoadbankComponentForm loadbankId={inputSubAssemblyValue} />
          )}
        </div>
      </div>
    </div>
  );
};

export default AllocateComponents;
