import React from "react";
import { Dialog, DialogContent, DialogActions } from "@mui/material";

const SelectedWorkOrder = ({ open, onClose }) => {
  return (
    <Dialog
      open={open}
      onClose={() => setOpenSelectedQRModal(false)}
      PaperProps={{
        sx: {
          borderRadius: "12px",
          outline: "none",
          minWidth: "70vw",
        },
      }}
    >
      <DialogContent className="bg-blue-900">
        <div className="flex flex-wrap justify-center items-center">
          {selectedRowsQRCodes.map((qrCode, index) => (
            <div className="p-5 m-5 bg-white rounded-lg shadow-md" key={index}>
              <div className="flex flex-col justify-center items-center">
                <div
                  ref={captureRef}
                  id={`selectedQRCode-${qrCode.workOrderId}`}
                >
                  <ReactQRCode
                    value={qrCode.qrCodeData}
                    size={512}
                    imageSettings={{
                      text: "QR Code",
                      src: logo,
                      excavate: true,
                      width: 60,
                      height: 35,
                    }}
                  />
                  <p
                    style={{
                      fontFamily: "Avenir, sans-serif",
                      fontSize: "20px",
                      fontWeight: "bold",
                    }}
                    className="text-signature text-center"
                  >
                    WorkOrder ID: {qrCode.workOrderId}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
      <DialogActions>
        <button
          className="bg-signature text-white font-semibold rounded ml-16 py-2 px-4"
          onClick={handleDownloadAllSelectedQR}
        >
          Download
        </button>
        <button
          className="bg-red-600 hover:bg-red-500 text-white font-semibold py-2 px-4 rounded"
          onClick={() => setOpenSelectedQRModal(false)}
        >
          Close
        </button>
      </DialogActions>
    </Dialog>
  );
};

export default SelectedWorkOrder;
