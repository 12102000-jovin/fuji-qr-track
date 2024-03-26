import React, { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment-timezone";
import logo from "../../Images/FE-logo.png";
import ReactQRCode from "qrcode.react";
import JSZip from "jszip";
import html2canvas from "html2canvas";
import { FaQrcode } from "react-icons/fa";

const WorkOrderCustomQRGenerator = () => {
  const [numQR, setNumQR] = useState("0");
  const [startNum, setStartNum] = useState("0");
  const [qrCode, setQRcode] = useState([]);
  const [expectedRange, setExpectedRange] = useState("");
  const [imageData, setImageData] = useState([]);
  const [qrGeneratedStatus, setQRGeneratedStatus] = useState(false);
  const [duplicateError, setDuplicateError] = useState("");
  const [emptyInputError, setEmptyInputError] = useState(false);
  const [showExpectedRange, setShowExpectedRange] = useState(true);

  const linkFormat = "http://localhost:";
  const applicationPortNumber = process.env.REACT_APP_APPLICATION_PORT;

  const generateWorkOrder_API =
    "http://localhost:3001/WorkOrder/generateWorkOrder";

  useEffect(() => {
    if (numQR === "1") {
      setExpectedRange(
        `Expected Output: ${formatWorkOrderId(Number(startNum))}`
      );
    } else if (numQR > 1 && numQR !== "1") {
      setExpectedRange(
        ` Expected Output: ${formatWorkOrderId(
          Number(startNum)
        )} - ${formatWorkOrderId(Number(startNum) + Number(numQR) - 1)}`
      );
    } else {
      setExpectedRange("");
    }
  }, [numQR, startNum]);

  const handleDownloadAll = async () => {
    const zip = new JSZip();

    const promises = qrCode.map(async (code) => {
      const qrCodeElement = document.getElementById(
        `qrcode-${code.workOrderId}`
      );
      const qrCodeCanvas = await html2canvas(qrCodeElement, {
        width: 512,
        height: 565,
      });

      return {
        name: `${code.workOrderId}.png`,
        data: qrCodeCanvas
          .toDataURL("image/png")
          .replace(/^data:image\/(png|jpg);base64,/, ""),
      };
    });

    const files = await Promise.all(promises);

    files.forEach((file) => {
      zip.file(file.name, file.data, { base64: true });
    });

    zip.generateAsync({ type: "blob" }).then((content) => {
      const a = document.createElement("a");
      const url = URL.createObjectURL(content);
      a.href = url;
      a.download = `WorkOrder`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });
  };

  const handleDownload = async (workOrderId) => {
    const qrCodeElement = document.getElementById(`qrcode-${workOrderId}`);

    const qrCodeCanvas = await html2canvas(qrCodeElement, {
      width: 512,
      height: 565,
    });

    const a = document.createElement("a");
    a.href = qrCodeCanvas.toDataURL("image/png");
    a.download = `${workOrderId}.png`;
    a.click();
  };
  const formatWorkOrderId = (number) => {
    const currentYear = new Date().getFullYear();
    const yearPart = (currentYear % 2000).toString().padStart(2, "0");
    const formattedNumber = number.toString().padStart(4, "0");
    return `WO2${yearPart}${formattedNumber}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (numQR === "0" || numQR === "") {
      setQRGeneratedStatus(false);
      setDuplicateError(false);
      setEmptyInputError(true);
      return;
    }

    if (startNum === "0" || startNum === "") {
      setQRGeneratedStatus(false);
      setDuplicateError(false);
      setEmptyInputError(true);
      return;
    }

    const WorkOrders = Array.from({ length: numQR }, (_, index) => {
      const newWorkOrderId = formatWorkOrderId(Number(startNum) + index);
      return {
        link: `${linkFormat}${applicationPortNumber}/Dashboard/WorkOrder/WorkOrder${newWorkOrderId}`,
        generatedDate: moment()
          .tz("Australia/Sydney")
          .format("YYYY-MM-DD HH:mm:ss"),
        workOrderId: `${newWorkOrderId}`,
      };
    });

    try {
      const response = await axios.post(generateWorkOrder_API, { WorkOrders });
      console.log(response.data);

      setQRcode(() => {
        const newQRCodes = response.data.map((qrcode, index) => ({
          ...qrcode,
          workOrderId: `${formatWorkOrderId(Number(startNum) + index)}`,
        }));
        return newQRCodes;
      });

      setQRGeneratedStatus(true);
      setShowExpectedRange(false);
      setEmptyInputError(false);
      setDuplicateError(false);
    } catch (error) {
      console.error("Error generating WorkOrder:", error.message);
      setDuplicateError(
        error.response ? error.response.data : "An error occurred."
      );
      setEmptyInputError(false);
    }
  };

  return (
    <div>
      <div className="flex justify-center border-none">
        <div className="w-full p-6 text-white rounded-md">
          <div className="text-4xl text-center font-black">
            Generate Custom WorkOrder
          </div>
          {duplicateError && (
            <div className="flex justify-center">
              <p className="mt-3 p-1 pl-2 pr-2 bg-red-500 text-xs font-bold rounded-full">
                {duplicateError}
              </p>
            </div>
          )}
          {emptyInputError && (
            <div className="flex justify-center">
              <p className="mt-3 p-1 pl-2 pr-2 bg-red-500 text-xs font-bold rounded-full">
                {" "}
                Input all required fields
              </p>
            </div>
          )}
          <div className="mt-10">
            <label
              htmlFor="startNum"
              className="block text-base mb-2 flex justify-start font-bold text-xl"
            >
              Starting WorkOrder Number
            </label>
            <input
              type="number"
              id="startNum"
              className="border w-full px-2 py-1 rounded-md focus:outline-none focus:ring-3 focus:border-gray-600 text-black"
              min="1"
              onChange={(e) => setStartNum(e.target.value)}
            />
          </div>

          <div className="mt-10">
            <label
              htmlFor="numQR"
              className="block text-base mb-2 flex justify-start font-bold text-xl"
            >
              Number of WorkOrder QR
            </label>
            <input
              type="number"
              id="numQR"
              className="border w-full px-2 py-1 rounded-md focus:outline-none focus:ring-3 focus:border-gray-600 text-black"
              min="1"
              onChange={(e) => setNumQR(e.target.value)}
            />
            {showExpectedRange && expectedRange && (
              <div className="flex justify-start">
                <p className="mt-2 font-black p-1 text-white bg-secondary text-xs rounded-full pl-2 pr-2">
                  {expectedRange}
                </p>
              </div>
            )}
            <div className="text-center mt-10">
              <button
                className=" bg-black hover:bg-neutral-800 text-white font-semibold p-3 rounded-xl mt-5 shadow-lg"
                onClick={handleSubmit}
              >
                <div className="flex items-center">
                  <FaQrcode className="mr-2" />
                  <span> Generate WorkOrder </span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
      {qrGeneratedStatus && (
        <div>
          <div className="flex justify-center">
            <div className="m-5 flex justify-center items-center bg-slate-200 pb-5 w-full rounded-xl">
              <button
                className=" bg-secondary hover:bg-neutral-800 text-white font-semibold py-2 px-4 rounded mt-5 "
                onClick={handleDownloadAll}
              >
                Download All Generated QR
              </button>
            </div>
          </div>

          <div className="flex justify-center flex-wrap mt-5 rounded-xl">
            {qrCode.map((code, index) => (
              <div
                key={index}
                className="p-5 shadow-xl rounded-lg m-5 bg-white"
                style={{
                  color: "#043f9d",
                  fontFamily: "Avenir, sans-serif",
                  fontSize: "20px",
                  fontWeight: "bold",
                  textAlign: "center",
                }}
              >
                <div id={`qrcode-${code.workOrderId}`}>
                  <ReactQRCode
                    value={JSON.stringify({
                      link: code.link,
                      workOrderId: code.workOrderId,
                    })}
                    size={512}
                    imageSettings={{
                      src: logo,
                      excavate: true,
                      width: 60,
                      height: 35,
                    }}
                  />
                  <div className="mb-5">Work Order ID: {code.workOrderId}</div>
                </div>
                <img
                  src={imageData[code.workOrderId]}
                  alt={`Converted ${code.workOrderId}`}
                  style={{ display: "none", margin: "10px auto" }}
                />
                <div className="mt-5 flex items-center justify-center">
                  <button
                    className="bg-signature hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md"
                    onClick={() => handleDownload(code.workOrderId)}
                  >
                    Download
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
export default WorkOrderCustomQRGenerator;
