import React, { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment-timezone";
import { FaQrcode } from "react-icons/fa";
import ReactQRCode from "qrcode.react";
import logo from "../../Images/FE-logo.png";
import JSZip from "jszip";
import html2canvas from "html2canvas";

const WorkOrderQRGenerator = () => {
  const [numQR, setNumQR] = useState("0");
  const [latestWorkOrderId, setLatestWorkOrderId] = useState("0");
  const [expectedRange, setExpectedRange] = useState("");
  const [qrCode, setQRcode] = useState([]);
  const [qrGeneratedStatus, setQRGeneratedStatus] = useState(false);
  const [imageData, setImageData] = useState([]);
  const [showExpectedRange, setShowExpectedRange] = useState(true);
  const [emptyInputError, setEmptyInputError] = useState(false);
  const [duplicateError, setDuplicateError] = useState(null);

  const linkFormat = "http://localhost:";
  const applicationPortNumber = process.env.REACT_APP_APPLICATION_PORT;

  const generateWorkOrder_API =
    "http://localhost:3001/WorkOrder/generateWorkOrder";
  const getLatestWorkOrder_API =
    "http://localhost:3001/WorkOrder/getLatestWorkOrder";

  useEffect(() => {
    fetchLatestWorkOrder();
  }, []);

  useEffect(() => {
    console.log("Latest WorkOrder:", latestWorkOrderId);
  }, [latestWorkOrderId]);

  useEffect(() => {
    if (numQR === "1") {
      setExpectedRange(
        `Expected Output: ${formatWorkOrderId(Number(latestWorkOrderId) + 1)}`
      );
    } else if (numQR > 1 && numQR !== "1") {
      setExpectedRange(
        ` Expected Output: ${formatWorkOrderId(
          Number(latestWorkOrderId) + 1
        )} - ${formatWorkOrderId(Number(latestWorkOrderId) + Number(numQR))}`
      );
    } else {
      setExpectedRange("");
    }
  }, [numQR, latestWorkOrderId]);

  const extractWorkOrderId = (workOrderString) => {
    const currentYear = new Date().getFullYear();

    return workOrderString.replace(
      `WO2${(currentYear % 2000).toString().padStart(2, "0")}`,
      ""
    );
  };

  const fetchLatestWorkOrder = async () => {
    try {
      const response = await axios.get(getLatestWorkOrder_API);
      const latestWorkOrder = response.data;
      console.log("This", latestWorkOrder);
      const latestWorkOrderId = extractWorkOrderId(latestWorkOrder);
      setLatestWorkOrderId(Number(latestWorkOrderId));
    } catch (error) {
      console.error("Error fetching latest WorkOrder:", error.message);
    }
  };

  const formatWorkOrderId = (number) => {
    const currentYear = new Date().getFullYear();
    const yearPart = (currentYear % 2000).toString().padStart(2, "0");
    const formattedNumber = number.toString().padStart(4, "0");
    return `WO2${yearPart}${formattedNumber}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("NumQR:", numQR);

    if (numQR === "0" || numQR === "") {
      setQRGeneratedStatus(false);
      setEmptyInputError(true);
      return;
    }

    const WorkOrders = Array.from({ length: numQR }, (_, index) => {
      fetchLatestWorkOrder();
      console.log("Latest WorkOrder:", latestWorkOrderId);

      const newWorkOrderId = formatWorkOrderId(
        Number(latestWorkOrderId + 1) + index
      );

      return {
        link: `${linkFormat}${applicationPortNumber}/Dashboard/WorkOrder/${newWorkOrderId}`,
        generatedDate: moment()
          .tz("Australia/Sydney")
          .format("YYYY-MM-DD HH:mm:ss"),
        workOrderId: `${newWorkOrderId}`,
      };
    });

    try {
      const response = await axios.post(generateWorkOrder_API, { WorkOrders });
      console.log(response.data);
      fetchLatestWorkOrder();

      setQRcode(() => {
        const newQRCodes = response.data.map((qrcode, index) => ({
          ...qrcode,
          workOrderIdId: `${formatWorkOrderId(
            Number(latestWorkOrderId + 1) + index
          )}`,
        }));
        return newQRCodes;
      });

      setQRGeneratedStatus(true);
      setShowExpectedRange(false);
      setEmptyInputError(false);
    } catch (error) {
      console.error("Error generating WorkOrder:", error.message);
    }
  };

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

  return (
    <div>
      <div className="flex justify-center border-none">
        <div className="w-full p-6 text-white rounded-md">
          <div className="text-4xl text-center font-black">
            {" "}
            Generate Work Order
          </div>

          <div className="mt-10">
            <label
              htmlFor="numQR"
              className="block text-base mb-2 flex justify-start font-bold text-xl"
            >
              Number of Work Order QR{" "}
              <div className="flex items-center">
                <span className="text-white p-1 pl-2 pr-2 ml-2 font-black rounded-full text-xs bg-green-700">
                  {" "}
                  Latest WorkOrder:{" "}
                  {formatWorkOrderId(Number(latestWorkOrderId))}
                </span>
              </div>
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
                  <span> Generate Work Order </span>
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
                  src={imageData[code.WorkOrderId]}
                  alt={`Converted ${code.WorkOrderId}`}
                  style={{ display: "none", margin: "10px auto" }}
                />
                <div className="mt-5 flex items-center justify-center">
                  <button
                    className="bg-signature hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded "
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

export default WorkOrderQRGenerator;
