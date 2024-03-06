import React, { useState, useEffect } from "react";

import { FaQrcode } from "react-icons/fa";
import moment from "moment-timezone";
import axios from "axios";
import ReactQRCode from "qrcode.react";
import logo from "../../Images/FE-logo.png";
import JSZip from "jszip";
import html2canvas from "html2canvas";

const SubAssemblyQRGenerator = () => {
  const [numQR, setNumQR] = useState("0");
  const [startNum, setStartNum] = useState("0");

  const [qrCode, setQRcode] = useState([]);
  const [expectedPanelRange, setExpectedPanelRange] = useState("");
  const [imageData, setImageData] = useState([]);
  const [qrGeneratedStatus, setQRGeneratedStatus] = useState(false);
  const [duplicateError, setDuplicateError] = useState(false);
  const [emptyInputError, setEmptyInputError] = useState(false);
  const [showExpectedPanelRange, setShowExpectedPanelRange] = useState(true);

  const [selectedSubAssemblyType, setSelectedSubAssemblyType] = useState("");

  const linkFormat = "http://localhost:";
  const applicationPortNumber = process.env.REACT_APP_APPLICATION_PORT;

  const generatePanel_API =
    "http://localhost:3001/SubAssembly/Panel/generateSubAssembly";
  const generateLoadbank_API =
    "http://localhost:3001/SubAssembly/Loadbank/generateSubAssembly";

  useEffect(() => {
    if (numQR === "1") {
      setExpectedPanelRange(
        `Expected Output: PANEL${formatId(Number(startNum))}`
      );
    } else if (numQR > 1 && numQR !== "1") {
      setExpectedPanelRange(
        ` Expected Output: PANEL${formatId(Number(startNum))} - PANEL${formatId(
          Number(startNum) + Number(numQR) - 1
        )}`
      );
    } else {
      setExpectedPanelRange("");
    }
  }, [numQR, startNum]);

  useEffect(() => {
    setShowExpectedPanelRange(true);
  }, [numQR]);

  useEffect(() => {
    // Get the current URL
    const currentUrl = window.location.href;

    // Check if the URL contains "Panel"
    if (currentUrl.includes("Panel")) {
      // Set the selected value of the dropdown to "Panel"
      setSelectedSubAssemblyType("Panel");
    }
  }, []);

  const formatId = (number) => {
    return number.toString().padStart(6, "0");
  };

  const extractPanelId = (panelString) => {
    return panelString.replace("PANEL", "");
  };

  const handleSubmit = async (e) => {
    console.log(numQR);
    console.log(selectedSubAssemblyType);

    setQRGeneratedStatus(false);

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

    if (selectedSubAssemblyType === "Panel") {
      const Panels = Array.from({ length: numQR }, (_, index) => {
        const newPanelId = formatId(Number(startNum) + index);
        return {
          link: `${linkFormat}${applicationPortNumber}/Dashboard/PANEL/PANEL${newPanelId}`,
          generatedDate: moment()
            .tz("Australia/Sydney")
            .format("YYYY-MM-DD HH:mm:ss"),
          panelId: `PANEL${newPanelId}`,
        };
      });

      try {
        const response = await axios.post(generatePanel_API, { Panels });
        console.log(response.data);

        setQRcode(() => {
          const newQRCodes = response.data.map((qrcode, index) => ({
            ...qrcode,
            panelId: `PANEL${formatId(Number(startNum) + index)}`,
          }));
          return newQRCodes;
        });

        setQRGeneratedStatus(true);
        setShowExpectedPanelRange(false);
        setEmptyInputError(false);
        setDuplicateError(false);
      } catch (error) {
        console.error("Error generating Panel:", error.message);
        setDuplicateError(
          error.response ? error.response.data : "An error occurred."
        );
        setEmptyInputError(false);
      }
    } else if (selectedSubAssemblyType === "Loadbank") {
      const Loadbanks = Array.from({ length: numQR }, (_, index) => {
        const newLoadbankId = formatId(Number(1) + index);
        return {
          link: `${linkFormat}${applicationPortNumber}/LB${newLoadbankId}`,
          generatedDate: moment()
            .tz("Australia/Sydney")
            .format("YYYY-MM-DD HH:mm:ss"),
          loadbankId: `LB${newLoadbankId}`,
        };
      });

      try {
        const response = await axios.post(generateLoadbank_API, { Loadbanks });
        console.log(response.data);

        setShowExpectedPanelRange(false);
        setEmptyInputError(false);
      } catch (error) {
        console.error("Error generating Panel:", error.message);
      }
    } else {
      console.log("Unvalid Type");
    }
  };

  const handleDownload = async (panelId) => {
    const qrCodeElement = document.getElementById(`qrcode-${panelId}`);

    const qrCodeCanvas = await html2canvas(qrCodeElement, {
      width: 512,
      height: 565,
    });

    const a = document.createElement("a");
    a.href = qrCodeCanvas.toDataURL("image/png");
    a.download = `${panelId}.png`;
    a.click();
  };

  const handleDownloadAll = async () => {
    const zip = new JSZip();

    const promises = qrCode.map(async (code) => {
      const qrCodeElement = document.getElementById(`qrcode-${code.panelId}`);
      const qrCodeCanvas = await html2canvas(qrCodeElement, {
        width: 512,
        height: 565,
      });

      return {
        name: `${code.panelId}.png`,
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
      a.download = `PANEL`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });
  };

  return (
    <div>
      <div className="flex justify-center border-none">
        <div className="w-full p-6 text-white rounded-md">
          <div className="text-4xl text-center font-black">
            Generate Custom Sub-Assembly
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
              htmlFor="SubAssemblyType"
              className="block text-base mb-2 flex justify-start font-bold text-xl"
            >
              Select Sub-Assembly
            </label>
            <select
              id="subAssemblyTypeDropdown"
              onChange={(e) => setSelectedSubAssemblyType(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring focus:border-blue-300 sm:text-sm text-black"
            >
              <option value="" disabled defaultValue>
                Select Sub-Assembly Type
              </option>

              <option value="Panel">Panel</option>
              <option>Loadbank</option>
            </select>
            {selectedSubAssemblyType && (
              <div className="mt-5">
                <div className="mt-10">
                  <label
                    htmlFor="startNum"
                    className="block text-base mb-2 flex justify-start font-bold text-xl"
                  >
                    Starting {selectedSubAssemblyType} Number
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
                    Number of {selectedSubAssemblyType} QR
                  </label>
                  <input
                    type="number"
                    id="numQR"
                    className="border w-full px-2 py-1 rounded-md focus:outline-none focus:ring-3 focus:border-gray-600 text-black"
                    min="1"
                    onChange={(e) => setNumQR(e.target.value)}
                  />
                </div>

                {showExpectedPanelRange && expectedPanelRange && (
                  <div className="flex jsutify-start">
                    <p className="mt-2 font-black p-1 text-white bg-secondary text-xs rounded-full pl-2 pr-2">
                      {expectedPanelRange}
                    </p>
                  </div>
                )}
              </div>
            )}

            <div className="text-center mt-10">
              <button
                className=" bg-black hover:bg-neutral-800 text-white font-semibold p-3 rounded-xl mt-5 shadow-lg"
                onClick={handleSubmit}
              >
                <div className="flex items-center">
                  <FaQrcode className="mr-2" />
                  <span> Generate {selectedSubAssemblyType} </span>
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
                <div id={`qrcode-${code.panelId}`}>
                  <ReactQRCode
                    value={JSON.stringify({
                      link: code.link,
                      panelId: code.panelId,
                    })}
                    size={512}
                    imageSettings={{
                      src: logo,
                      excavate: true,
                      width: 60,
                      height: 35,
                    }}
                  />
                  <div className="mb-5">Panel ID: {code.panelId}</div>
                </div>
                <img
                  src={imageData[code.panelId]}
                  alt={`Converted ${code.panelId}`}
                  style={{ display: "none", margin: "10px auto" }}
                />
                <div className="mt-5 flex items-center justify-center">
                  <button
                    className="bg-signature hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded "
                    onClick={() => handleDownload(code.panelId)}
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

export default SubAssemblyQRGenerator;
