import React, { useState, useEffect } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { Dialog, DialogContent } from "@mui/material";
import axios from "axios";
import LaunchIcon from "@mui/icons-material/Launch";

const EditMCCBPrimary = ({ open, onClose, MCCBId }) => {
  const [generalError, setGeneralError] = useState("");
  const [selectedPDCId, setSelectedPDCId] = useState("");
  const [pdcDisabled, setPDCDisabled] = useState(true);
  const [PDCs, setPDCs] = useState([]);
  const [MCCBIdToEdit, setMCCBIdToEdit] = useState("");
  const [MCCBDisabled, setMCCBDisabled] = useState(true);
  const [pdcId, setPDCId] = useState("");

  const fetchPDCData_API = "http://localhost:3001/PDC/getAllPDC";
  const fetchDashboardMCCBData_API = `http://localhost:3001/Dashboard/${MCCBId}/showMCCBPrimaryDashboard`;
  const editMCCB_API = `http://localhost:3001/SubAssembly/MCCBPrimary/editMCCB/${pdcId}/${MCCBId}`;

  useEffect(() => {
    // Fetch PDCId
    const fetchPDCId = async () => {
      try {
        const response = await axios.get(`${fetchDashboardMCCBData_API}`);
        setPDCId(response.data.pdcId);
      } catch (error) {
        console.error("Error fetching pdcId:", error);
      }
    };
    fetchPDCId();
  }, [MCCBId]);

  useEffect(() => {
    // Fetch
    fetch(`${fetchPDCData_API}`)
      .then((response) => response.json())
      .then((data) => {
        setPDCs(data);
      })
      .catch((error) => console.error("Error fetching pdcs", error));
  }, [open]);

  useEffect(() => {
    console.log("this is the pdcid", pdcId);
    setSelectedPDCId(pdcId);
  }, [pdcId]);

  useEffect(() => {
    setMCCBIdToEdit(MCCBId);
  }, [MCCBId, open]);

  useEffect(() => {
    setMCCBDisabled(true);
    setPDCDisabled(true);
    setGeneralError("");
  }, [open]);

  const handlePDCDisabled = () => {
    setPDCDisabled(false);
  };

  const handleMCCBDisabled = () => {
    setMCCBDisabled(false);
  };

  const handleEditMCCB = async () => {
    console.log("Future PDC Id", selectedPDCId);
    console.log("Future MCCB Id", MCCBIdToEdit);

    console.log("Current PDC Id", pdcId);
    console.log("Current MCCB Id", MCCBId);

    setGeneralError("");

    try {
      const response = await axios.put(`${editMCCB_API}`, {
        pdcToEdit: selectedPDCId,
        MCCBToEdit: MCCBIdToEdit,
      });

      if (response.status === 200) {
        console.log("MCCB Edited Successfully");
        onClose();
      }
    } catch (error) {
      console.error("Error editing MCCB:", error);
      if (error.response && error.response.data) {
        const { error: errorMessage } = error.response.data;
        setGeneralError(errorMessage);
      } else {
        setGeneralError("An error occurred. Please try again later.");
      }
    }
  };

  return (
    <Dialog fullWidth open={open} onClose={onClose} sx={{ marginTop: "-40vh" }}>
      <DialogContent>
        <div className="relative">
          <div className="absolute top-0 right-0">
            <button
              className="bg-red-600 hover:bg-red-500 text-white font-semibold
              py-1 pl-2 pr-2 rounded"
              onClick={onClose}
            >
              <CloseIcon style={{ fontSize: "small" }} />
            </button>
          </div>
        </div>

        <p className="block mb-5 flex justify-center text-signature font-bold text-3xl">
          Edit MCCB
        </p>

        {generalError && (
          <div className="flex justify-center mb-10">
            <p className="text-xs font-bold text-white px-2 py-1 rounded-xl bg-red-600">
              {generalError}
            </p>
          </div>
        )}

        <div className="mt-5">
          <label
            htmlFor="pdcIdDropdown"
            className="block mb-2 flex justify-start font-bold text-xl"
          >
            PDC Id
            {pdcId === null && (
              <span className="flex items-center">
                <div className="flex">
                  <p className="text-xs text-white px-2 bg-red-500 rounded-full ml-3">
                    MCCB has not been allocated to any PDC.{" "}
                  </p>
                  <a
                    href="/allocateComponents"
                    className="ml-2 text-xs underline text-signature hover:text-"
                  >
                    Allocate{" "}
                    <span>
                      <LaunchIcon style={{ fontSize: "14px" }} />
                    </span>
                  </a>
                </div>
              </span>
            )}
          </label>
          {pdcId !== null && (
            <div className="flex items-center">
              <select
                id="pdcIdDropdown"
                value={selectedPDCId}
                onChange={(e) => setSelectedPDCId(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring focus:border-blue-300 sm:text-sm text-black"
                disabled={pdcDisabled}
              >
                <option value="" disabled defaultValue selected>
                  Select PDC Id
                </option>
                {PDCs.map((pdc) => (
                  <option key={pdc._id} value={pdc.pdcId}>
                    {pdc.pdcId}
                  </option>
                ))}
              </select>
              {pdcDisabled && (
                <p
                  fontSize="small"
                  className="text-signature font-bold ml-2 p-1 rounded-md hover:bg-gray-300 hover:cursor-pointer hover:text-white"
                  onClick={handlePDCDisabled}
                >
                  Edit
                </p>
              )}
            </div>
          )}
        </div>
        <div className="mt-5">
          <label
            htmlFor="MCCBId"
            className="block mb-2 flex justify-start font-bold text-xl"
          >
            MCCB Id
          </label>
          <div className="flex items-center">
            <div className="relative w-full">
              <input
                type="text"
                id="MCCBId"
                className="border w-full px-2 py-1 rounded-md focus:outline-none focus:ring-3 focus:border-gray-600 text-black"
                value={MCCBIdToEdit}
                onChange={(e) => setMCCBIdToEdit(e.target.value)}
                disabled={MCCBDisabled}
              />
              {MCCBDisabled && (
                <p
                  fontSize="small"
                  className="absolute right-0 top-1/2 transform -translate-y-1/2 text-signature font-bold px-2 mr-2 rounded-md hover:bg-gray-300 hover:cursor-pointer hover:text-white"
                  onClick={handleMCCBDisabled}
                >
                  Edit
                </p>
              )}
            </div>
          </div>
          <div className="flex justify-end mt-4">
            <button
              className="bg-signature hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md"
              onClick={() => handleEditMCCB()}
            >
              Edit MCCB
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditMCCBPrimary;
