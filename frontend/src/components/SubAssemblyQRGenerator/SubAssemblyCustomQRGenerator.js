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
  const [imageData, setImageData] = useState([]);
  const [qrGeneratedStatus, setQRGeneratedStatus] = useState(false);
  const [duplicateError, setDuplicateError] = useState("");
  const [emptyInputError, setEmptyInputError] = useState(false);

  const [expectedPanelRange, setExpectedPanelRange] = useState("");
  const [showExpectedPanelRange, setShowExpectedPanelRange] = useState(true);

  const [expectedLoadbankRange, setExpectedLoadbankRange] = useState("");
  const [showExpectedLoadbankRange, setShowExpectedLoadbankRange] =
    useState(true);

  const [expectedLoadbankCatcherRange, setExpectedLoadbankCatcherRange] =
    useState("");
  const [
    showExpectedLoadbankCatcherRange,
    setShowExpectedLoadbankCatcherRange,
  ] = useState(true);

  const [expectedMCCBPrimaryRange, setExpectedMCCBPrimaryRange] = useState("");
  const [showExpectedMCCBPrimaryRange, setShowExpectedMCCBPrimaryRange] =
    useState(true);

  const [expectedMCCBCatcherRange, setExpectedMCCBCatcherRange] = useState("");
  const [showExpectedMCCBCatcherRange, setShowExpectedMCCBCatcherRange] =
    useState(true);

  const [selectedSubAssemblyType, setSelectedSubAssemblyType] = useState("");

  const linkFormat = "http://localhost:";
  const applicationPortNumber = process.env.REACT_APP_APPLICATION_PORT;

  const generatePanel_API =
    "http://localhost:3001/SubAssembly/Panel/generateSubAssembly";
  const generateLoadbank_API =
    "http://localhost:3001/SubAssembly/LoadbankPrimary/generateSubAssembly";
  const generateLoadbankCatcher_API =
    "http://localhost:3001/SubAssembly/LoadbankCatcher/generateSubAssembly";
  const generateMCCBPrimary_API =
    "http://localhost:3001/SubAssembly/MCCBPrimary/generateSubAssembly";
  const generateMCCBCatcher_API =
    "http://localhost:3001/SubAssembly/MCCBCatcher/generateSubAssembly";

  // ======================================= P A N E L =======================================

  useEffect(() => {
    if (numQR === "1") {
      setExpectedPanelRange(
        `Expected Output: CPAN${formatId(Number(startNum))}`
      );
    } else if (numQR > 1 && numQR !== "1") {
      setExpectedPanelRange(
        ` Expected Output: CPAN${formatId(Number(startNum))} - CPAN${formatId(
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

  const formatId = (number) => {
    return number.toString().padStart(6, "0");
  };

  // ==================================== L O A D B A N K (P R I M A R Y) =======================================

  useEffect(() => {
    setShowExpectedLoadbankRange(true);
  }, [numQR]);

  useEffect(() => {
    if (numQR === "1") {
      setExpectedLoadbankRange(
        `Expected Output: LB${formatId(Number(startNum))}-P`
      );
    } else if (numQR > 1 && numQR !== "1") {
      setExpectedLoadbankRange(
        ` Expected Output: LB${formatId(Number(startNum))}-P - LB${formatId(
          Number(startNum) + Number(numQR) - 1
        )}-P`
      );
    } else {
      setExpectedLoadbankRange("");
    }
  }, [numQR, startNum]);

  // ==================================== L O A D B A N K (C A T C H E R) =======================================

  useEffect(() => {
    setShowExpectedLoadbankCatcherRange(true);
  }, [numQR]);

  useEffect(() => {
    if (numQR === "1") {
      setExpectedLoadbankCatcherRange(
        `Expected Output: LB${formatId(Number(startNum))}-C`
      );
    } else if (numQR > 1 && numQR !== "1") {
      setExpectedLoadbankCatcherRange(
        ` Expected Output: LB${formatId(Number(startNum))}-C - LB${formatId(
          Number(startNum) + Number(numQR) - 1
        )}-C`
      );
    } else {
      setExpectedLoadbankCatcherRange("");
    }
  }, [numQR, startNum]);

  // ==================================== M C C B (P R I M A R Y) =======================================

  useEffect(() => {
    setShowExpectedMCCBPrimaryRange(true);
  }, [numQR]);

  useEffect(() => {
    if (numQR === "1") {
      setExpectedMCCBPrimaryRange(
        `Expected Output: MCCBPAN${formatId(Number(startNum))}-P`
      );
    } else if (numQR > 1 && numQR !== "1") {
      setExpectedMCCBPrimaryRange(
        ` Expected Output: MCCBPAN${formatId(
          Number(startNum)
        )}-P - MCCBPAN${formatId(Number(startNum) + Number(numQR) - 1)}-P`
      );
    } else {
      setExpectedMCCBPrimaryRange("");
    }
  }, [numQR, startNum]);

  // ==================================== M C C B (C A T C H E R) =======================================

  useEffect(() => {
    setShowExpectedMCCBCatcherRange(true);
  }, [numQR]);

  useEffect(() => {
    if (numQR === "1") {
      setExpectedMCCBCatcherRange(
        `Expected Output: MCCBPAN${formatId(Number(startNum))}-C`
      );
    } else if (numQR > 1 && numQR !== "1") {
      setExpectedMCCBCatcherRange(
        ` Expected Output: MCCBPAN${formatId(
          Number(startNum)
        )}-C - MCCBPAN${formatId(Number(startNum) + Number(numQR) - 1)}-C`
      );
    } else {
      setExpectedMCCBCatcherRange("");
    }
  }, [numQR, startNum]);

  // ==================================== S U B M I T =======================================

  useEffect(() => {
    setQRGeneratedStatus(false);
    setEmptyInputError(false);
    setDuplicateError("");
  }, [selectedSubAssemblyType]);

  const handleSubmit = async (e) => {
    console.log(numQR);
    console.log(selectedSubAssemblyType);

    setQRGeneratedStatus(false);

    e.preventDefault();

    if (numQR === "0" || numQR === "") {
      setQRGeneratedStatus(false);
      setDuplicateError("");
      setEmptyInputError(true);
      return;
    }

    if (startNum === "0" || startNum === "") {
      setQRGeneratedStatus(false);
      setDuplicateError("");
      setEmptyInputError(true);
      return;
    }

    if (selectedSubAssemblyType === "Panel") {
      const Panels = Array.from({ length: numQR }, (_, index) => {
        const newPanelId = formatId(Number(startNum) + index);
        return {
          link: `${linkFormat}${applicationPortNumber}/Dashboard/CPAN/CPAN${newPanelId}`,
          generatedDate: moment()
            .tz("Australia/Sydney")
            .format("YYYY-MM-DD HH:mm:ss"),
          panelId: `CPAN${newPanelId}`,
        };
      });

      try {
        const response = await axios.post(generatePanel_API, { Panels });
        console.log(response.data);

        setQRcode(() => {
          const newQRCodes = response.data.map((qrcode, index) => ({
            ...qrcode,
            panelId: `CPAN${formatId(Number(startNum) + index)}`,
          }));
          return newQRCodes;
        });

        setQRGeneratedStatus(true);
        setShowExpectedPanelRange(false);
        setEmptyInputError(false);
        setDuplicateError("");
      } catch (error) {
        console.error("Error generating Panel:", error.message);
        setDuplicateError("Duplicate Panel Found");
        setEmptyInputError(false);
      }
    } else if (selectedSubAssemblyType === "LoadbankPrimary") {
      const Loadbanks = Array.from({ length: numQR }, (_, index) => {
        const newLoadbankId = formatId(Number(startNum) + index);
        return {
          link: `${linkFormat}${applicationPortNumber}/Dashboard/Loadbank/LB${newLoadbankId}-P`,
          generatedDate: moment()
            .tz("Australia/Sydney")
            .format("YYYY-MM-DD HH:mm:ss"),
          loadbankId: `LB${newLoadbankId}-P`,
        };
      });

      try {
        const response = await axios.post(generateLoadbank_API, { Loadbanks });
        console.log(response.data);

        setQRcode(() => {
          const newQRCodes = response.data.map((qrcode, index) => ({
            ...qrcode,
            loadbankId: `LB${formatId(Number(startNum) + index)}-P`,
          }));
          return newQRCodes;
        });

        setQRGeneratedStatus(true);
        setShowExpectedLoadbankRange(false);
        setEmptyInputError(false);
      } catch (error) {
        console.error("Error generating Loadbank:", error.message);
        setDuplicateError("Duplicate Loadbank Found");
        setEmptyInputError(false);
      }
    } else if (selectedSubAssemblyType === "LoadbankCatcher") {
      const Loadbanks = Array.from({ length: numQR }, (_, index) => {
        const newLoadbankId = formatId(Number(startNum) + index);
        return {
          link: `${linkFormat}${applicationPortNumber}/Dashboard/Loadbank/LB${newLoadbankId}-C`,
          generatedDate: moment()
            .tz("Australia/Sydney")
            .format("YYYY-MM-DD HH:mm:ss"),
          loadbankId: `LB${newLoadbankId}-C`,
        };
      });

      try {
        const response = await axios.post(generateLoadbankCatcher_API, {
          Loadbanks,
        });
        console.log(response.data);

        setQRcode(() => {
          const newQRCodes = response.data.map((qrcode, index) => ({
            ...qrcode,
            loadbankId: `LB${formatId(Number(startNum) + index)}-C`,
          }));
          return newQRCodes;
        });

        setQRGeneratedStatus(true);
        setShowExpectedLoadbankRange(false);
        setEmptyInputError(false);
      } catch (error) {
        console.error("Error generating Loadbank:", error.message);
        setDuplicateError("Duplicate Loadbank Found");
        setEmptyInputError(false);
      }
    } else if (selectedSubAssemblyType === "MCCBPrimary") {
      const MCCBs = Array.from({ length: numQR }, (_, index) => {
        const newMCCBId = formatId(Number(startNum) + index);
        return {
          link: `${linkFormat}${applicationPortNumber}/Dashboard/MCCB/MCCBPAN${newMCCBId}-P`,
          generatedDate: moment()
            .tz("Australia/Sydney")
            .format("YYYY-MM-DD HH:mm:ss"),
          MCCBId: `MCCBPAN${newMCCBId}-P`,
        };
      });

      try {
        const response = await axios.post(generateMCCBPrimary_API, {
          MCCBs,
        });
        console.log(response.data);

        setQRcode(() => {
          const newQRCodes = response.data.map((qrcode, index) => ({
            ...qrcode,
            MCCBId: `MCCBPAN${formatId(Number(startNum) + index)}-P`,
          }));
          return newQRCodes;
        });

        setQRGeneratedStatus(true);
        setShowExpectedMCCBPrimaryRange(false);
        setEmptyInputError(false);
      } catch (error) {
        console.error("Error generating MCCB:", error.message);
        setDuplicateError("Duplicate MCCB Panel Found");
        setEmptyInputError(false);
      }
    } else if (selectedSubAssemblyType === "MCCBCatcher") {
      const MCCBs = Array.from({ length: numQR }, (_, index) => {
        const newMCCBId = formatId(Number(startNum) + index);
        return {
          link: `${linkFormat}${applicationPortNumber}/Dashboard/MCCB/MCCBPAN${newMCCBId}-C`,
          generatedDate: moment()
            .tz("Australia/Sydney")
            .format("YYYY-MM-DD HH:mm:ss"),
          MCCBId: `MCCBPAN${newMCCBId}-C`,
        };
      });

      try {
        const response = await axios.post(generateMCCBCatcher_API, {
          MCCBs,
        });
        console.log(response.data);

        setQRcode(() => {
          const newQRCodes = response.data.map((qrcode, index) => ({
            ...qrcode,
            MCCBId: `MCCBPAN${formatId(Number(startNum) + index)}-C`,
          }));
          return newQRCodes;
        });

        setQRGeneratedStatus(true);
        setShowExpectedMCCBCatcherRange(false);
        setEmptyInputError(false);
      } catch (error) {
        console.error("Error generating MCCB:", error.message);
        setDuplicateError("Duplicate MCCB Panel Found");
        setEmptyInputError(false);
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
      const id =
        selectedSubAssemblyType === "Panel"
          ? code.panelId
          : selectedSubAssemblyType === "LoadbankPrimary"
          ? code.loadbankId
          : selectedSubAssemblyType === "LoadbankCatcher"
          ? code.loadbankId
          : selectedSubAssemblyType === "MCCBPrimary"
          ? code.MCCBId
          : code.MCCBId;
      const qrCodeElement = document.getElementById(`qrcode-${id}`);
      const qrCodeCanvas = await html2canvas(qrCodeElement, {
        width: 512,
        height: 565,
      });

      return {
        name: `${id}.png`,
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
      a.download =
        selectedSubAssemblyType === "Panel"
          ? "Panel"
          : selectedSubAssemblyType === "LoadbankPrimary"
          ? "Loadbank (Primary)"
          : selectedSubAssemblyType === "LoadbankCatcher"
          ? "Loadbank (Catcher)"
          : selectedSubAssemblyType === "MCCBPrimary"
          ? "MCCB Panel (Primary)"
          : "MCCB Panel (Catcher)";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });
  };

  useEffect(() => {
    // Get the current URL
    const currentUrl = window.location.href;

    // Check if the URL contains "Panel"
    if (currentUrl.includes("Panel")) {
      // Set the selected value of the dropdown to "Panel"
      setSelectedSubAssemblyType("Panel");
    } else if (currentUrl.includes("LoadbankPrimary")) {
      // Set the selected value of the dropdown to "Loadbank"
      setSelectedSubAssemblyType("LoadbankPrimary");
    } else if (currentUrl.includes("LoadbankCatcher")) {
      // Set the selected value of the dropdown to "Loadbank"
      setSelectedSubAssemblyType("LoadbankCatcher");
    } else if (currentUrl.includes("MCCBPrimary")) {
      // Set the selected value of the dropdown to "Loadbank"
      setSelectedSubAssemblyType("MCCBPrimary");
    } else if (currentUrl.includes("MCCBCatcher")) {
      // Set the selected value of the dropdown to "Loadbank"
      setSelectedSubAssemblyType("MCCBCatcher");
    }
  }, []);

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
              value={selectedSubAssemblyType}
              onChange={(e) => setSelectedSubAssemblyType(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring focus:border-blue-300 sm:text-sm text-black"
            >
              <option value="" disabled defaultValue>
                Select Sub-Assembly Type
              </option>

              <option value="Panel">Panel</option>
              <option value="LoadbankPrimary">Loadbank (Primary)</option>
              <option value="LoadbankCatcher">Loadbank (Catcher)</option>
              <option value="MCCBPrimary">MCCB Panel (Primary)</option>
              <option value="MCCBCatcher">MCCB Panel (Catcher)</option>
            </select>
            {selectedSubAssemblyType && (
              <div className="mt-5">
                <div className="mt-10">
                  <label
                    htmlFor="startNum"
                    className="block text-base mb-2 flex justify-start font-bold text-xl"
                  >
                    Starting{" "}
                    {selectedSubAssemblyType === "Panel"
                      ? "Panel "
                      : selectedSubAssemblyType === "LoadbankPrimary"
                      ? "Loadbank (Primary) "
                      : selectedSubAssemblyType === "LoadbankCatcher"
                      ? "Loadbank (Catcher) "
                      : selectedSubAssemblyType === "MCCBPrimary"
                      ? "MCCB Panel (Primary) "
                      : "MCCB Panel (Catcher) "}
                    Number
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
                    Number of{" "}
                    {selectedSubAssemblyType === "Panel"
                      ? "Panel "
                      : selectedSubAssemblyType === "LoadbankPrimary"
                      ? "Loadbank (Primary) "
                      : selectedSubAssemblyType === "LoadbankCatcher"
                      ? "Loadbank (Catcher)"
                      : "MCCB Panel (Primary) "}
                    QR
                  </label>
                  <input
                    type="number"
                    id="numQR"
                    className="border w-full px-2 py-1 rounded-md focus:outline-none focus:ring-3 focus:border-gray-600 text-black"
                    min="1"
                    onChange={(e) => setNumQR(e.target.value)}
                  />
                </div>

                {selectedSubAssemblyType === "Panel" &&
                  showExpectedPanelRange &&
                  expectedPanelRange && (
                    <div className="flex jsutify-start">
                      <p className="mt-2 font-black p-1 text-white bg-secondary text-xs rounded-full pl-2 pr-2">
                        {expectedPanelRange}
                      </p>
                    </div>
                  )}

                {selectedSubAssemblyType === "LoadbankPrimary" &&
                  showExpectedLoadbankRange &&
                  expectedLoadbankRange && (
                    <div className="flex jsutify-start">
                      <p className="mt-2 font-black p-1 text-white bg-secondary text-xs rounded-full pl-2 pr-2">
                        {expectedLoadbankRange}
                      </p>
                    </div>
                  )}

                {selectedSubAssemblyType === "LoadbankCatcher" &&
                  showExpectedLoadbankCatcherRange &&
                  expectedLoadbankCatcherRange && (
                    <div className="flex jsutify-start">
                      <p className="mt-2 font-black p-1 text-white bg-secondary text-xs rounded-full pl-2 pr-2">
                        {expectedLoadbankCatcherRange}
                      </p>
                    </div>
                  )}

                {selectedSubAssemblyType === "MCCBPrimary" &&
                  showExpectedMCCBPrimaryRange &&
                  expectedMCCBPrimaryRange && (
                    <div className="flex jsutify-start">
                      <p className="mt-2 font-black p-1 text-white bg-secondary text-xs rounded-full pl-2 pr-2">
                        {expectedMCCBPrimaryRange}
                      </p>
                    </div>
                  )}
                {selectedSubAssemblyType === "MCCBCatcher" &&
                  showExpectedMCCBCatcherRange &&
                  expectedMCCBCatcherRange && (
                    <div className="flex jsutify-start">
                      <p className="mt-2 font-black p-1 text-white bg-secondary text-xs rounded-full pl-2 pr-2">
                        {expectedMCCBCatcherRange}
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
                  <span> Generate QR </span>
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

          {selectedSubAssemblyType === "Panel" && (
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
          )}

          {selectedSubAssemblyType === "LoadbankPrimary" && (
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
                  <div id={`qrcode-${code.loadbankId}`}>
                    <ReactQRCode
                      value={JSON.stringify({
                        link: code.link,
                        loadbankPrimaryId: code.loadbankId,
                      })}
                      size={512}
                      imageSettings={{
                        src: logo,
                        excavate: true,
                        width: 60,
                        height: 35,
                      }}
                    />
                    <div className="mb-5 flex items-center justify-center">
                      Loadbank ID : {code.loadbankId}{" "}
                      <span className="text-red-500 ml-1 mr-1 px-2 font-black">
                        {" "}
                        (Primary)
                      </span>
                    </div>
                  </div>
                  <img
                    src={imageData[code.loadbankId]}
                    alt={`Converted ${code.loadbankId}`}
                    style={{ display: "none", margin: "10px auto" }}
                  />
                  <div className="mt-5 flex items-center justify-center">
                    <button
                      className="bg-signature hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded "
                      onClick={() => handleDownload(code.loadbankId)}
                    >
                      Download
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {selectedSubAssemblyType === "LoadbankCatcher" && (
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
                  <div id={`qrcode-${code.loadbankId}`}>
                    <ReactQRCode
                      value={JSON.stringify({
                        link: code.link,
                        loadbankCatcherId: code.loadbankId,
                      })}
                      size={512}
                      imageSettings={{
                        src: logo,
                        excavate: true,
                        width: 60,
                        height: 35,
                      }}
                    />
                    <div className="mb-5 flex items-center justify-center">
                      Loadbank ID : {code.loadbankId}{" "}
                      <span className="text-red-500 ml-1 mr-1 px-2 font-black">
                        {" "}
                        (Catcher)
                      </span>
                    </div>
                  </div>
                  <img
                    src={imageData[code.loadbankId]}
                    alt={`Converted ${code.loadbankId}`}
                    style={{ display: "none", margin: "10px auto" }}
                  />
                  <div className="mt-5 flex items-center justify-center">
                    <button
                      className="bg-signature hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded "
                      onClick={() => handleDownload(code.loadbankId)}
                    >
                      Download
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {selectedSubAssemblyType === "MCCBPrimary" && (
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
                  <div id={`qrcode-${code.MCCBId}`}>
                    <ReactQRCode
                      value={JSON.stringify({
                        link: code.link,
                        MCCBCatcherId: code.MCCBId,
                      })}
                      size={512}
                      imageSettings={{
                        src: logo,
                        excavate: true,
                        width: 60,
                        height: 35,
                      }}
                    />
                    <div className="mb-5 flex items-center justify-center">
                      MCCB Panel ID : {code.MCCBId}{" "}
                      <span className="text-red-500 ml-1 mr-1 px-2 font-black">
                        {" "}
                        (Primary)
                      </span>
                    </div>
                  </div>
                  <img
                    src={imageData[code.MCCBId]}
                    alt={`Converted ${code.MCCBId}`}
                    style={{ display: "none", margin: "10px auto" }}
                  />
                  <div className="mt-5 flex items-center justify-center">
                    <button
                      className="bg-signature hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded "
                      onClick={() => handleDownload(code.MCCBId)}
                    >
                      Download
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {selectedSubAssemblyType === "MCCBCatcher" && (
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
                  <div id={`qrcode-${code.MCCBId}`}>
                    <ReactQRCode
                      value={JSON.stringify({
                        link: code.link,
                        MCCBCatcherId: code.MCCBId,
                      })}
                      size={512}
                      imageSettings={{
                        src: logo,
                        excavate: true,
                        width: 60,
                        height: 35,
                      }}
                    />
                    <div className="mb-5 flex items-center justify-center">
                      MCCB Panel ID : {code.MCCBId}{" "}
                      <span className="text-red-500 ml-1 mr-1 px-2 font-black">
                        {" "}
                        (Catcher)
                      </span>
                    </div>
                  </div>
                  <img
                    src={imageData[code.MCCBId]}
                    alt={`Converted ${code.MCCBId}`}
                    style={{ display: "none", margin: "10px auto" }}
                  />
                  <div className="mt-5 flex items-center justify-center">
                    <button
                      className="bg-signature hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded "
                      onClick={() => handleDownload(code.MCCBId)}
                    >
                      Download
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SubAssemblyQRGenerator;
