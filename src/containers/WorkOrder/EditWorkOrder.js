import React, { useState, useEffect } from "react";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import { Dialog, DialogContent } from "@mui/material";
import axios from "axios";

const EditWorkOrder = ({ open, onClose, workOrderId }) => {
  const [workOrderIdToEdit, setWorkOrderIdToEdit] = useState("");
  const [workOrderDisabled, setWorkOrderDisabled] = useState(true);

  useEffect(() => {
    // Update the local state when the workOrderId prop changes
    setWorkOrderIdToEdit(workOrderId);
  }, [workOrderId]);

  useEffect(() => {
    setWorkOrderDisabled(true);
  }, [open]);

  const EditWorkOrder_API = "http://localhost:3001/WorkOrder/editWorkOrder/";

  const handleEditWorkOrder = async () => {
    try {
      const response = await axios.put(`${EditWorkOrder_API}${workOrderId}`, {
        workOrderId: workOrderIdToEdit,
      });

      if (response.status === 200) {
        console.log("Work Order Edited Successfully");
        onClose();
      } else {
        console.log("Error editing work order:", response.data.message);
        // Optionally, handle the case where deletion was not successful
      }
    } catch (error) {
      console.error("Error editing work order:", error);
    }
  };

  const handleWorkOrderDisabled = () => {
    setWorkOrderDisabled(false);
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
          Edit Work Order
        </p>
        <div>
          <label
            htmlFor="workOrderId"
            className="block mb-2 flex justify-start font-bold text-xl"
          >
            Work Order Id
          </label>
          <div className="flex items-center">
            <div className="relative w-full">
              <input
                type="text"
                id="workOrderId"
                className="border w-full px-2 py-1 rounded-md focus:outline-none focus:ring-3 focus:border-gray-600 text-black"
                value={workOrderIdToEdit}
                onChange={(e) => setWorkOrderIdToEdit(e.target.value)}
                disabled={workOrderDisabled}
              />
              {workOrderDisabled && (
                <p
                  fontSize="small"
                  className="absolute right-0 top-1/2 transform -translate-y-1/2 text-signature font-bold px-2 mr-2 rounded-md hover:bg-gray-300 hover:cursor-pointer hover:text-white"
                  onClick={handleWorkOrderDisabled}
                >
                  Edit
                </p>
              )}
            </div>
          </div>
        </div>
        <div className="flex justify-end mt-4">
          <button
            className="bg-signature hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md"
            onClick={() => handleEditWorkOrder()}
          >
            Edit Work Order
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditWorkOrder;
