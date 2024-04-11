import React, { useState, useRef } from "react";
import PanelComponentForm from "../../components/ComponentForms/PanelComponentForm";
import LoadbankComponentForm from "../../components/ComponentForms/LoadbankComponentForm";
import LoadbankCatcherComponentForm from "../../components/ComponentForms/LoadbankCatcherComponentForm";
import MCCBPrimaryComponentForm from "../../components/ComponentForms/MCCBPrimaryComponentForm";
import MCCBCatcherComponentForm from "../../components/ComponentForms/MCCBCatcherComponentForm";
import LeftCTInterfaceComponentForm from "../../components/ComponentForms/LeftCTInterfaceComponentForm";
import RightCTInterfaceComponentForm from "../../components/ComponentForms/RightCTInterfaceComponentForm";

const AllocateComponents = () => {
  const [inputSubAssemblyValue, setInputSubAssemblyValue] = useState("");
  const [showPanelForm, setShowPanelForm] = useState(false);
  const [showLoadbankForm, setShowLoadbankForm] = useState(false);
  const [showLoadbankCatcherForm, setShowLoadbankCatcherForm] = useState(false);
  const [showMCCBPrimaryForm, setShowMCCBPrimaryForm] = useState(false);
  const [showMCCBCatcherForm, setShowMCCBCatcherForm] = useState(false);
  const [showLeftCTInterfaceForm, setShowLeftCTInterfaceForm] = useState(false);
  const [showRightCTInterfaceForm, setShowRightCTInterfaceForm] =
    useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const subAssemblyInputRef = useRef(null);
  const resetSubAssemblyRef = useRef(null);

  const handleSubAssemblyChange = (event) => {
    setInputSubAssemblyValue(event.target.value);
  };

  const handleSubAssemblyKeyDown = (event) => {
    if (event.key === "Enter") {
      const isPanelPattern = /^CPAN\d{6}$/.test(inputSubAssemblyValue);
      const isLoadbankPattern = /^LB\d{6}-P$/.test(inputSubAssemblyValue);
      const isLoadbankCatcherPattern = /^LB\d{6}-C$/.test(
        inputSubAssemblyValue
      );
      const isMCCBPrimaryPattern = /^MCCBPAN\d{6}-P$/.test(
        inputSubAssemblyValue
      );
      const isMCCBCatcherPattern = /^MCCBPAN\d{6}-C$/.test(
        inputSubAssemblyValue
      );
      const isCTInterfaceLeftPattern = /^CT\d{6}L-P$/.test(
        inputSubAssemblyValue
      );
      const isCTInterfaceRightPattern = /^CT\d{6}R-P$/.test(
        inputSubAssemblyValue
      );

      if (isPanelPattern) {
        setShowPanelForm(true);
        setShowLoadbankForm(false);
        setErrorMessage("");
      } else if (isLoadbankPattern) {
        setShowPanelForm(false);
        setShowLoadbankForm(true);
        setErrorMessage("");
      } else if (isLoadbankCatcherPattern) {
        setShowPanelForm(false);
        setShowLoadbankCatcherForm(true);
        setErrorMessage("");
      } else if (isMCCBPrimaryPattern) {
        setShowPanelForm(false);
        setShowMCCBPrimaryForm(true);
        setErrorMessage("");
      } else if (isMCCBCatcherPattern) {
        setShowPanelForm(false);
        setShowMCCBCatcherForm(true);
        setErrorMessage("");
      } else if (isCTInterfaceLeftPattern) {
        setShowPanelForm(false);
        setShowLeftCTInterfaceForm(true);
        setErrorMessage("");
      } else if (isCTInterfaceRightPattern) {
        setShowPanelForm(false);
        setShowRightCTInterfaceForm(true);
        setErrorMessage("");
      } else {
        try {
          const parsedInput = JSON.parse(inputSubAssemblyValue);
          if (parsedInput.panelId && /^CPAN\d{6}$/.test(parsedInput.panelId)) {
            setInputSubAssemblyValue(parsedInput.panelId);
            setShowPanelForm(true);
            setShowLoadbankForm(false);
            setErrorMessage("");
          } else if (
            parsedInput.loadbankPrimaryId &&
            /^LB\d{6}-P$/.test(parsedInput.loadbankPrimaryId)
          ) {
            setInputSubAssemblyValue(parsedInput.loadbankPrimaryId);
            setShowPanelForm(false);
            setShowLoadbankForm(true);
            setErrorMessage("");
          } else if (
            parsedInput.loadbankCatcherId &&
            /^LB\d{6}-C$/.test(parsedInput.loadbankCatcherId)
          ) {
            setInputSubAssemblyValue(parsedInput.loadbankCatcherId);
            setShowPanelForm(false);
            setShowLoadbankCatcherForm(true);
            setErrorMessage("");
          } else if (
            parsedInput.MCCBPrimaryId &&
            /^MCCBPAN\d{6}-P$/.test(parsedInput.MCCBPrimaryId)
          ) {
            setInputSubAssemblyValue(parsedInput.MCCBPrimaryId);
            setShowPanelForm(false);
            setShowMCCBPrimaryForm(true);
            setErrorMessage("");
          } else if (
            parsedInput.MCCBCatcherId &&
            /^MCCBPAN\d{6}-C$/.test(parsedInput.MCCBCatcherId)
          ) {
            setInputSubAssemblyValue(parsedInput.MCCBCatcherId);
            setShowPanelForm(false);
            setShowMCCBCatcherForm(true);
            setErrorMessage("");
          } else if (
            parsedInput.leftCTInterfaceId &&
            /^CT\d{6}L-P$/.test(parsedInput.leftCTInterfaceId)
          ) {
            setInputSubAssemblyValue(parsedInput.leftCTInterfaceId);
            setShowPanelForm(false);
            setShowLeftCTInterfaceForm(true);
            setErrorMessage("");
          } else if (
            parsedInput.rightCTInterfaceId &&
            /^CT\d{6}R-P$/.test(parsedInput.rightCTInterfaceId)
          ) {
            setInputSubAssemblyValue(parsedInput.rightCTInterfaceId);
            setShowPanelForm(false);
            setShowRightCTInterfaceForm(true);
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
      setShowLoadbankCatcherForm("");
      setErrorMessage("");
    }
  };

  const handleResetSubAssemblyScan = () => {
    subAssemblyInputRef.current.focus();
    setInputSubAssemblyValue("");
    setShowPanelForm(false);
    setShowLoadbankForm(false);
    setShowLoadbankCatcherForm(false);
    setShowMCCBPrimaryForm(false);
    setShowMCCBCatcherForm(false);
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
                disabled={
                  showPanelForm ||
                  showLoadbankForm ||
                  showLoadbankCatcherForm ||
                  showMCCBPrimaryForm
                }
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
          {showLoadbankCatcherForm && (
            <LoadbankCatcherComponentForm loadbankId={inputSubAssemblyValue} />
          )}
          {showMCCBPrimaryForm && (
            <MCCBPrimaryComponentForm MCCBId={inputSubAssemblyValue} />
          )}
          {showMCCBCatcherForm && (
            <MCCBCatcherComponentForm MCCBId={inputSubAssemblyValue} />
          )}
          {showLeftCTInterfaceForm && (
            <LeftCTInterfaceComponentForm CTId={inputSubAssemblyValue} />
          )}
          {showRightCTInterfaceForm && (
            <RightCTInterfaceComponentForm CTId={inputSubAssemblyValue} />
          )}
        </div>
      </div>
    </div>
  );
};

export default AllocateComponents;
