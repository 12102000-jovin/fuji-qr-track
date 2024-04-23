import React from "react";
import { Dialog, DialogContent } from "@mui/material";
import Meter from "../../Images/UMG-801PrimaryMeter.jpg";
import ModulCT from "../../Images/Modul 800-CT8-A.jpg";
import ModulDI from "../../Images/Modul 800-DI14.jpg";
import MoxaGateway from "../../Images/MOXA MB3170 Gateway.jpg";
import Switch from "../../Images/Switch.jpg";
import MoxaIoLogik from "../../Images/MOXA ioLogik.jpg";
import QuintPSU from "../../Images/Quint PSU.jpg";
import QuintCM from "../../Images/Quint CM.jpg";
import TrioDiode from "../../Images/Trio-Diode.jpg";

const ComponentImageModal = ({ open, onClose, type }) => {
  return (
    <Dialog open={open} onClose={onClose} className="bg-transparent">
      <DialogContent>
        {type === "Meter" && (
          <div>
            <p className="text-center mb-10 text-2xl font-black">
              {" "}
              UMG-801 Meter
            </p>
            <img src={Meter} alt="Meter" style={{ height: "300px" }} />
          </div>
        )}

        {type === "ModulCT" && (
          <div>
            <p className="text-center mb-10 text-2xl font-black"> </p>
            <img src={ModulCT} alt="ModulCT" style={{ height: "300px" }} />
          </div>
        )}

        {type === "ModulDI" && (
          <div>
            <p className="text-center mb-10 text-2xl font-black"> </p>
            <img src={ModulDI} alt="ModulDI" style={{ height: "300px" }} />
          </div>
        )}

        {type === "MoxaGateway" && (
          <div>
            <p className="text-center mb-10 text-2xl font-black"> </p>
            <img
              src={MoxaGateway}
              alt="MoxaGateway"
              style={{ height: "300px" }}
            />
          </div>
        )}

        {type === "Switch" && (
          <div>
            <p className="text-center mb-10 text-2xl font-black"> </p>
            <img src={Switch} alt="Switch" style={{ height: "300px" }} />
          </div>
        )}

        {type === "MoxaIoLogik" && (
          <div>
            <p className="text-center mb-10 text-2xl font-black"> </p>
            <img
              src={MoxaIoLogik}
              alt="MoxaIoLogik"
              style={{ height: "300px" }}
            />
          </div>
        )}

        {type === "Quint PSU" && (
          <div>
            <p className="text-center mb-10 text-2xl font-black"> </p>
            <img src={QuintPSU} alt="QuintPSU" style={{ height: "300px" }} />
          </div>
        )}

        {type === "Quint CM" && (
          <div>
            <p className="text-center mb-10 text-2xl font-black"> </p>
            <img src={QuintCM} alt="QuintCM" style={{ height: "300px" }} />
          </div>
        )}

        {type === "Trio Diode" && (
          <div>
            <p className="text-center mb-10 text-2xl font-black"> </p>
            <img src={TrioDiode} alt="TrioDiode" style={{ height: "300px" }} />
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
