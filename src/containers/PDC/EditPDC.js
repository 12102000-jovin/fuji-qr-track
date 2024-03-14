import React, { useState, useEffect } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { Dialog, DialogContent } from "@mui/material";
import axios from "axios";

const EditPDC = ({ open, onClose, pdcId }) => {
  const [pdcIdToEdit, setPDCIdToEdit] = useState("");
  const [workOrderId, setWorkOrderId] = useState("");
  const [workOrders, setWorkOrders] = useState([]);
  const [selectedWorkOrderId, setSelectedWorkOrderId] = useState("");

  const [workOrderDisabled, setWorkOrderDisabled] = useState(true);

  const [pdcDisabled, setPDCdisabled] = useState(true);

  const fetchDashboardPDCData_API = `http://localhost:3001/Dashboard/${pdcId}/showPDCDashboard`;
  const fetchWorkOrderData_API =
    "http://localhost:3001/WorkOrder/getAllWorkOrder";

  const editPDC_API = `http://localhost:3001/PDC/editPDC/${workOrderId}/${pdcId}`;

  useEffect(() => {
    setPDCIdToEdit(pdcId);
  }, [pdcId]);

  useEffect(() => {
    setSelectedWorkOrderId(workOrderId);
  }, [workOrderId]);

  useEffect(() => {
    setWorkOrderDisabled(true);
    setPDCdisabled(true);
  }, [open]);

  useEffect(() => {
    const fetchWorkOrderId = async () => {
      try {
        const response = await axios.get(`${fetchDashboardPDCData_API}`);
        setWorkOrderId(response.data.workOrderId);
      } catch (error) {
        console.error("Error fetching workOrderId:", error);
      }
    };

    fetchWorkOrderId();
  }, [pdcId]);

  useEffect(() => {
    // Fetch work orders from your API
    fetch(`${fetchWorkOrderData_API}`)
      .then((response) => response.json())
      .then((data) => {
        setWorkOrders(data);
      })
      .catch((error) => console.error("Error fetching work orders:", error));
  }, []);

  const handleWorkOrderDisabled = () => {
    setWorkOrderDisabled(false);
  };

  const handlePDCDisabled = () => {
    setPDCdisabled(false);
  };

  const handleEditPDC = async () => {
    console.log(selectedWorkOrderId);
    console.log(pdcIdToEdit);

    try {
      const response = await axios.put(`${editPDC_API}`, {
        workOrderIdToEdit: selectedWorkOrderId,
        pdcIdToEdit: pdcIdToEdit,
      });

      if (response.status === 200) {
        console.log("PDC Edited Successfully");
        onClose();
      }
    } catch (error) {
      console.error("Error editing work order:", error);
    }
  };

  return (
    <Dialog fullWidth open={open} onClose={onClose} sx={{ marginTop: "-60vh" }}>
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

        <p className="block mb-10 flex justify-center text-signature font-bold text-3xl">
          Edit PDC
        </p>

        <div>
          <label
            htmlFor="pdcId"
            className="block mb-2 flex justify-start font-bold text-xl"
          >
            Work Order Id
          </label>
          <div className="flex items-center">
            <select
              id="WorkOrderIdDropdown"
              value={selectedWorkOrderId}
              onChange={(e) => setSelectedWorkOrderId(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring focus:border-blue-300 sm:text-sm text-black"
              disabled={workOrderDisabled}
            >
              <option value="" disabled defaultValue selected>
                Select Work Order Id
              </option>
              {workOrders.map((workOrder) => (
                <option key={workOrder._id} value={workOrder.workOrderId}>
                  {workOrder.workOrderId}
                </option>
              ))}
            </select>
            {workOrderDisabled && (
              <p
                fontSize="small"
                className="text-signature font-bold ml-2 p-1 rounded-md hover:bg-gray-300 hover:cursor-pointer hover:text-white"
                onClick={handleWorkOrderDisabled}
              >
                Edit
              </p>
            )}
          </div>
        </div>

        <div className="mt-5">
          <label
            htmlFor="workOrderId"
            className="block mb-2 flex justify-start font-bold text-xl"
          >
            PDC Id
          </label>
          <div className="flex items-center">
            <div className="relative w-full">
              <input
                type="text"
                id="workOrderId"
                className="border w-full px-2 py-1 rounded-md focus:outline-none focus:ring-3 focus:border-gray-600 text-black"
                value={pdcIdToEdit}
                onChange={(e) => setPDCIdToEdit(e.target.value)}
                disabled={pdcDisabled}
              />
              {pdcDisabled && (
                <p
                  fontSize="small"
                  className="absolute right-0 top-1/2 transform -translate-y-1/2 text-signature font-bold px-2 mr-2 rounded-md hover:bg-gray-300 hover:cursor-pointer hover:text-white"
                  onClick={handlePDCDisabled}
                >
                  Edit
                </p>
              )}
            </div>
          </div>
          <div className="flex justify-end mt-4">
            <button
              className="bg-signature hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md"
              onClick={() => handleEditPDC()}
            >
              Edit PDC
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditPDC;
