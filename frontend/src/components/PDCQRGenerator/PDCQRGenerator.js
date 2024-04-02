import React, { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment-timezone";
import { FaQrcode } from "react-icons/fa";
import ReactQRCode from "qrcode.react";
import logo from "../../Images/FE-logo.png";
import JSZip from "jszip";
import html2canvas from "html2canvas";

const PDCQRGenerator = () => {
  const [numQR, setNumQR] = useState("0");
  const [latestPDCId, setLatestPDCId] = useState("0");
  const [expectedRange, setExpectedRange] = useState("");
  const [qrCode, setQRcode] = useState([]);
  const [qrGeneratedStatus, setQRGeneratedStatus] = useState(false);
  const [imageData, setImageData] = useState([]);
  const [showExpectedRange, setShowExpectedRange] = useState(true);
  const [emptyInputError, setEmptyInputError] = useState(false);
  const [duplicateError, setDuplicateError] = useState(null);

  const [workOrderIdError, setWorkOrderIdError] = useState(false);

  const [workOrders, setWorkOrders] = useState([]);
  const [selectedWorkOrderId, setSelectedWorkOrderId] = useState("");

  const linkFormat = "http://localhost:";
  const applicationPortNumber = process.env.REACT_APP_APPLICATION_PORT;

  const generatePDC_API = "http://localhost:3001/PDC/generatePDC";
  const getLatestPDC_API = "http://localhost:3001/PDC/getLatestPDC";
  const fetchWorkOrderData_API =
    "http://localhost:3001/WorkOrder/getAllWorkOrder";

  useEffect(() => {
    fetchLatestPDC();
  }, []);

  useEffect(() => {
    console.log("Latest PDC:", latestPDCId);
  }, [latestPDCId]);

  useEffect(() => {
    setShowExpectedRange(true);
  }, [numQR]);

  useEffect(() => {
    if (numQR === "1") {
      setExpectedRange(
        `Expected Output: PDC${formatPDCId(Number(latestPDCId) + 1)}`
      );
    } else if (numQR > 1 && numQR !== "1") {
      setExpectedRange(
        ` Expected Output: PDC${formatPDCId(
          Number(latestPDCId) + 1
        )} - PDC${formatPDCId(Number(latestPDCId) + Number(numQR))}`
      );
    } else {
      setExpectedRange("");
    }
  }, [numQR, latestPDCId]);

  useEffect(() => {
    // Fetch work orders from your API
    fetch(`${fetchWorkOrderData_API}`)
      .then((response) => response.json())
      .then((data) => {
        setWorkOrders(data);
      })
      .catch((error) => console.error("Error fetching work orders:", error));
  }, []);

  const extractPDCId = (pdcString) => {
    return pdcString.replace("PDC", "");
  };

  const fetchLatestPDC = async () => {
    try {
      const response = await axios.get(getLatestPDC_API);
      const latestPDC = response.data;
      const latestPDCId = extractPDCId(latestPDC);
      setLatestPDCId(Number(latestPDCId));
    } catch (error) {
      console.error("Error fetching latest PDC:", error.message);
    }
  };

  const formatPDCId = (number) => {
    return number.toString().padStart(6, "0");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // console.log("NumQR :", numQR);

    if (numQR === "0" || numQR === "") {
      setQRGeneratedStatus(false);
      setEmptyInputError(true);
      setWorkOrderIdError(false);
      return;
    }

    // Assuming you have a variable selectedWorkOrderId for the selected Work Order Id
    if (!selectedWorkOrderId) {
      setWorkOrderIdError(true);
      setQRGeneratedStatus(false);
      setEmptyInputError(false);
      return;
    }

    const PDCs = Array.from({ length: numQR }, (_, index) => {
      fetchLatestPDC();

      console.log("Latest PDC:", latestPDCId);

      const newPDCId = formatPDCId(Number(latestPDCId + 1) + index);
      return {
        link: `${linkFormat}${applicationPortNumber}/Dashboard/PDC/PDC${newPDCId}`,
        generatedDate: moment()
          .tz("Australia/Sydney")
          .format("YYYY-MM-DD HH:mm:ss"),
        pdcId: `PDC${newPDCId}`,
        workOrderId: selectedWorkOrderId,
      };
    });

    try {
      const response = await axios.post(generatePDC_API, { PDCs });
      console.log(response.data);
      fetchLatestPDC();

      setQRcode(() => {
        const newQRCodes = response.data.map((qrcode, index) => ({
          ...qrcode,
          pdcId: `PDC${formatPDCId(Number(latestPDCId + 1) + index)}`,
        }));
        return newQRCodes;
      });

      setQRGeneratedStatus(true);
      setShowExpectedRange(false);
      setEmptyInputError(false);
      setWorkOrderIdError(false);
    } catch (error) {
      console.error("Error generating PDC:", error.message);
    }
  };

  const handleDownloadAll = async () => {
    const zip = new JSZip();

    const promises = qrCode.map(async (code) => {
      const qrCodeElement = document.getElementById(`qrcode-${code.pdcId}`);
      const qrCodeCanvas = await html2canvas(qrCodeElement, {
        width: 512,
        height: 565,
      });

      return {
        name: `${code.pdcId}.png`,
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
      a.download = `PDC`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });
  };

  const handleDownload = async (pdcId) => {
    const qrCodeElement = document.getElementById(`qrcode-${pdcId}`);

    const qrCodeCanvas = await html2canvas(qrCodeElement, {
      width: 512,
      height: 565,
    });

    const a = document.createElement("a");
    a.href = qrCodeCanvas.toDataURL("image/png");
    a.download = `${pdcId}.png`;
    a.click();
  };

  return (
    <div>
      <div className="flex justify-center border-none">
        <div className="w-full p-6 text-white rounded-md">
          <div className="text-4xl text-center font-black"> Generate PDC</div>
          {emptyInputError && (
            <div className="flex justify-center">
              <p className="mt-3 p-1 pl-2 pr-2 bg-red-500 text-xs font-bold rounded-full">
                {" "}
                Please Input Number of QR to be generated
              </p>
            </div>
          )}
          {duplicateError && (
            <div className="flex justify-center">
              <p className="mt-3 p-1 pl-2 pr-2 bg-red-500 text-xs font-bold rounded-full">
                {duplicateError}
              </p>
            </div>
          )}
          {workOrderIdError && (
            <div className="flex justify-center">
              <p className="mt-3 p-1 pl-2 pr-2 bg-red-500 text-xs font-bold rounded-full">
                {" "}
                Please Select Work Order Id
              </p>
            </div>
          )}
          <div className="mt-10">
            <label
              htmlFor="workOrder"
              className="block text-base mb-2 flex justify-start font-bold text-xl"
            >
              Work Order
            </label>
            <select
              id="WorkOrderIdDropdown"
              onChange={(e) => setSelectedWorkOrderId(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring focus:border-blue-300 sm:text-sm text-black"
            >
              <option value="" disabled defaultValue selected>
                Select Work Order Id
              </option>
              {workOrders
                .sort((a, b) => b.workOrderId.localeCompare(a.workOrderId))
                .map((workOrder) => (
                  <option key={workOrder._id} value={workOrder.workOrderId}>
                    {workOrder.workOrderId}
                  </option>
                ))}
            </select>
          </div>
          <div className="mt-10">
            <label
              htmlFor="numQR"
              className="block text-base mb-2 flex justify-start font-bold text-xl"
            >
              Number of PDC QR{" "}
              <div className="flex items-center">
                <span className="text-white p-1 pl-2 pr-2 ml-2 font-black rounded-full text-xs bg-green-700">
                  {" "}
                  Latest PDC: PDC{formatPDCId(Number(latestPDCId))}
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
                  <span> Generate PDC </span>
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
                <div id={`qrcode-${code.pdcId}`}>
                  <ReactQRCode
                    value={JSON.stringify({
                      link: code.link,
                      pdcId: code.pdcId,
                    })}
                    size={512}
                    imageSettings={{
                      src: logo,
                      excavate: true,
                      width: 60,
                      height: 35,
                    }}
                  />
                  <div className="mb-5">PDC ID: {code.pdcId}</div>
                </div>
                <img
                  src={imageData[code.pdcId]}
                  alt={`Converted ${code.pdcId}`}
                  style={{ display: "none", margin: "10px auto" }}
                />
                <div className="mt-5 flex items-center justify-center">
                  <button
                    className="bg-signature hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded "
                    onClick={() => handleDownload(code.pdcId)}
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

export default PDCQRGenerator;
