import React from "react";
import { Dialog, DialogContent } from "@mui/material";
import Meter from "../../Images/Meter.jpg";
import Switch from "../../Images/Switch.jpg";

const ComponentImageModal = ({ open, onClose, type }) => {
  return (
    <Dialog open={open} onClose={onClose} className="">
      <DialogContent>
        {type === "Switch" && (
          <img src={Switch} alt="Switch" style={{ height: "300px" }} />
        )}

        {type === "Meter" && (
          <img src={Meter} alt="Meter" style={{ height: "300px" }} />
        )}

        <div className="flex justify-center items-center  mt-5">
          <button
            className="bg-red-500 text-white font-black rounded py-1 px-2"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ComponentImageModal;
