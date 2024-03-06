import React, { useState, useRef } from "react";
import SubAssembly from "../SubAssembly/Panel";
import axios from "axios";
import moment from "moment-timezone";
import QrCodeScannerRoundedIcon from "@mui/icons-material/QrCodeScannerRounded";
import PanelComponentForm from "../../components/ComponentForms/PanelComponentForm";

const AllocateComponents = () => {
  const [inputSubAssemblyValue, setInputSubAssemblyValue] = useState("");
  const [showPanelForm, setShowPanelForm] = useState(false);
  const [showPDCForm, setShowPDCForm] = useState(false);

  const handleSubAssemblyChange = (event) => {
    setInputSubAssemblyValue(event.target.value);
  };

  const handleSubAssemblyKeyDown = (event) => {
    if (event.key === "Enter") {
      try {
        const parsedInput = JSON.parse(inputSubAssemblyValue);
        if (parsedInput.panelId && /^PANEL\d{6}$/.test(parsedInput.panelId)) {
          setInputSubAssemblyValue(parsedInput.panelId);
          setShowPanelForm(true);
          setShowPDCForm(false);
        } else if (parsedInput.pdcId && /^PDC\d{6}$/.test(parsedInput.pdcId)) {
          setInputSubAssemblyValue(parsedInput.pdcId);
          setShowPanelForm(false);
          setShowPDCForm(true);
        }
      } catch (error) {
        console.log(false);
      }
    }
  };

  return (
    <div>
      <div className="flex justify-center bg-background border-none">
        <div className="w-3/4 p-6 shadow-lg bg-white text-black rounded-md mt-5 mb-10">
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
                // ref={SubAssemblyRef}
                className="border w-full px-2 py-4 rounded-md focus:outline-none focus:ring-3 focus:border-gray-600 text-black"
                // disabled={showComponentInput}
              />
              <button
                // ref={resetSubAssemblyRef}
                className="absolute right-0 top-1/2 transform -translate-y-1/2  bg-signature text-white p-2 mr-2 rounded-md hover:bg-secondary"
                // onClick={handlePDCscan}
              >
                <div className="flex items-center">
                  <span className="font-bold"> Scan </span>
                  <span> &nbsp; </span>
                  <QrCodeScannerRoundedIcon />
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-center bg-background border-none">
        <div className="w-3/4">
          {showPanelForm && (
            <PanelComponentForm panelId={inputSubAssemblyValue} />
          )}
        </div>
      </div>
      {showPDCForm && <h1>PDC FORM</h1>}
    </div>
  );
};

export default AllocateComponents;
