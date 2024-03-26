import React from "react";
import { Dialog, DialogContent } from "@mui/material";
import Meter from "../../Images/Meter.jpg";
import Switch from "../../Images/Switch.jpg";

const ComponentImageModal = ({ open, onClose, type }) => {
  return (
    <Dialog open={open} onClose={onClose} className="">
      <DialogContent>
        {type === "Switch" && (
          <div>
            <p className="text-center mb-10 text-2xl font-black"> Switch</p>
            <img src={Switch} alt="Switch" style={{ height: "300px" }} />
          </div>
        )}

        {type === "Meter" && (
          <div>
            <p className="text-center mb-10 text-2xl font-black"> Meter</p>
            <img src={Meter} alt="Meter" style={{ height: "300px" }} />
          </div>
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
