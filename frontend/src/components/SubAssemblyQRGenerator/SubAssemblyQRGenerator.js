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
  const [selectedSubAssemblyType, setSelectedSubAssemblyType] = useState("");

  const [latestPanelId, setLatestPanelId] = useState("0");
  const [expectedPanelRange, setExpectedPanelRange] = useState("");
  const [showExpectedPanelRange, setShowExpectedPanelRange] = useState(true);

  const [latestLoadbankId, setLatestLoadbankId] = useState("0");
  const [expectedLoadbankRange, setExpectedLoadbankRange] = useState("");
  const [showExpectedLoadbankRange, setShowExpectedLoadbankRange] =
    useState(true);

  const [latestLoadbankCatcherId, setLatestLoadbankCatcherId] = useState("0");
  const [expectedLoadbankCatcherRange, setExpectedLoadbankCatcherRange] =
    useState("");
  const [
    showExpectedLoadbankCatcherRange,
    setShowExpectedLoadbankCatcherRange,
  ] = useState(true);

  const [latestMCCBPrimaryId, setLatestMCCBPrimaryId] = useState("0");
  const [expectedMCCBPrimaryRange, setExpectedMCCBPrimaryRange] = useState("");
  const [showExpectedMCCBPrimaryRange, setShowExpectedMCCBPrimaryRange] =
    useState(true);

  const [latestMCCBCatcherId, setLatestMCCBCatcherId] = useState("0");
  const [expectedMCCBCatcherRange, setExpectedMCCBCatcherRange] = useState("");
  const [showExpectedMCCBCatcherRange, setShowExpectedMCCBCatcherRange] =
    useState(true);

  const [latestLeftCTInterfaceId, setLatestLeftCTInterfaceId] = useState("0");
  const [expectedLeftCTInterfaceRange, setExpectedLeftCTInterfaceRange] =
    useState("");
  const [
    showExpectedLeftCTInterfaceRange,
    setShowExpectedLeftCTInterfaceRange,
  ] = useState(true);

  const [emptyInputError, setEmptyInputError] = useState(false);
  const [qrGeneratedStatus, setQRGeneratedStatus] = useState(false);
  const [qrCode, setQRcode] = useState([]);
  const [imageData, setImageData] = useState([]);

  const linkFormat = "http://localhost:";
  const applicationPortNumber = process.env.REACT_APP_APPLICATION_PORT;

  const generatePanel_API =
    "http://localhost:3001/SubAssembly/Panel/generateSubAssembly";
  const getLatestPanel_API =
    "http://localhost:3001/SubAssembly/Panel/getLatestPanel";

  const generateLoadbank_API =
    "http://localhost:3001/SubAssembly/LoadbankPrimary/generateSubAssembly";
  const getLatestLoadbank_API =
    "http://localhost:3001/SubAssembly/LoadbankPrimary/getLatestLoadbank";

  const getLatestLoadbankCatcher_API =
    "http://localhost:3001/SubAssembly/LoadbankCatcher/getLatestLoadbank";
  const generateLoadbankCatcher_API =
    "http://localhost:3001/SubAssembly/LoadbankCatcher/generateSubAssembly";

  const generateMCCBPrimary_API =
    "http://localhost:3001/SubAssembly/MCCBPrimary/generateSubAssembly";
  const getLatestMCCBPrimary_API =
    "http://localhost:3001/SubAssembly/MCCBPrimary/getLatestMCCB";

  const generateMCCBCatcher_API =
    "http://localhost:3001/SubAssembly/MCCBCatcher/generateSubAssembly";
  const getLatestMCCBCatcher_API =
    "http://localhost:3001/SubAssembly/MCCBCatcher/getLatestMCCB";

  const generateLeftCTInterface_API =
    "http://localhost:3001/SubAssembly/CTInterfaceLeft/generateSubAssembly";
  const getLatestLeftCTInterface_API =
    "http://localhost:3001/SubAssembly/CTInterfaceLeft/getLatestCTInterface";

  // ======================================= P A N E L =======================================
  useEffect(() => {
    fetchLatestPanel();
  }, []);

  useEffect(() => {
    console.log("Latest Panel:", latestPanelId);
  }, [latestPanelId]);

  useEffect(() => {
    if (numQR === "1") {
      setExpectedPanelRange(
        `Expected Output: CPAN${formatId(Number(latestPanelId) + 1)}`
      );
    } else if (numQR > 1 && numQR !== "1") {
      setExpectedPanelRange(
        ` Expected Output: CPAN${formatId(
          Number(latestPanelId) + 1
        )} - CPAN${formatId(Number(latestPanelId) + Number(numQR))}`
      );
    } else {
      setExpectedPanelRange("");
    }
  }, [numQR, latestPanelId]);

  useEffect(() => {
    setShowExpectedPanelRange(true);
  }, [numQR]);

  const fetchLatestPanel = async () => {
    try {
      const response = await axios.get(getLatestPanel_API);
      const latestPanel = response.data;
      const latestPanelId = extractPanelId(latestPanel);
      setLatestPanelId(Number(latestPanelId));
    } catch (error) {
      console.error("Error fetching latest Panel:", error.message);
    }
  };

  const extractPanelId = (panelString) => {
    return panelString.replace("CPAN", "");
  };

  const formatId = (number) => {
    return number.toString().padStart(6, "0");
  };

  // ==================================== L O A D B A N K (P R I M A R Y)=======================================

  useEffect(() => {
    fetchLatestLoadbank();
  }, []);

  useEffect(() => {
    if (numQR === "1") {
      setExpectedLoadbankRange(
        `Expected Output: LB${formatId(Number(latestLoadbankId) + 1)}-P`
      );
    } else if (numQR > 1 && numQR !== "1") {
      setExpectedLoadbankRange(
        ` Expected Output: LB${formatId(
          Number(latestLoadbankId) + 1
        )}-P - LB${formatId(Number(latestLoadbankId) + Number(numQR))}-P`
      );
    } else {
      setExpectedLoadbankRange("");
    }
  }, [numQR, latestLoadbankId]);

  useEffect(() => {
    setShowExpectedLoadbankRange(true);
  }, [numQR]);

  const fetchLatestLoadbank = async () => {
    try {
      const response = await axios.get(getLatestLoadbank_API);
      const latestLoadbank = response.data;
      const latestLoadbankId = extractLoadbankId(latestLoadbank);
      setLatestLoadbankId(Number(latestLoadbankId));
    } catch (error) {
      console.error("Error fetching latest Loadbank:", error.message);
    }
  };

  const extractLoadbankId = (loadbankString) => {
    // Remove "LB" prefix and "P" suffix from the loadbankString
    return loadbankString.replace("LB", "").replace("-P", "");
  };

  // ==================================== L O A D B A N K (C A T C H E R) =======================================

  useEffect(() => {
    fetchLatestLoadbankCatcher();
  }, []);

  useEffect(() => {
    if (numQR === "1") {
      setExpectedLoadbankCatcherRange(
        `Expected Output: LB${formatId(Number(latestLoadbankCatcherId) + 1)}-C`
      );
    } else if (numQR > 1 && numQR !== "1") {
      setExpectedLoadbankCatcherRange(
        ` Expected Output: LB${formatId(
          Number(latestLoadbankCatcherId) + 1
        )}-C - LB${formatId(Number(latestLoadbankCatcherId) + Number(numQR))}-C`
      );
    } else {
      setExpectedLoadbankCatcherRange("");
    }
  }, [numQR, latestLoadbankCatcherId]);

  useEffect(() => {
    setShowExpectedLoadbankCatcherRange(true);
  }, [numQR]);

  const fetchLatestLoadbankCatcher = async () => {
    try {
      const response = await axios.get(getLatestLoadbankCatcher_API);
      const latestLoadbank = response.data;
      const latestLoadbankId = extractLoadbankCatcherId(latestLoadbank);
      setLatestLoadbankCatcherId(Number(latestLoadbankId));
    } catch (error) {
      console.error("Error fetching latest Loadbank:", error.message);
    }
  };

  const extractLoadbankCatcherId = (loadbankString) => {
    // Remove "LB" prefix and "P" suffix from the loadbankString
    return loadbankString.replace("LB", "").replace("-C", "");
  };

  // ==================================== M C C B (P R I M A R Y) =======================================
  useEffect(() => {
    fetchLatestMCCBPrimary();
  }, []);

  useEffect(() => {
    if (numQR === "1") {
      setExpectedMCCBPrimaryRange(
        `Expected Output: MCCBPAN${formatId(Number(latestMCCBPrimaryId) + 1)}-P`
      );
    } else if (numQR > 1 && numQR !== "1") {
      setExpectedMCCBPrimaryRange(
        ` Expected Output: MCCBPAN${formatId(
          Number(latestMCCBPrimaryId) + 1
        )}-P - MCCBPAN${formatId(
          Number(latestMCCBPrimaryId) + Number(numQR)
        )}-P`
      );
    } else {
      setExpectedMCCBPrimaryRange("");
    }
  }, [numQR, latestMCCBPrimaryId]);

  useEffect(() => {
    setShowExpectedMCCBPrimaryRange(true);
  }, [numQR]);

  const fetchLatestMCCBPrimary = async () => {
    try {
      const response = await axios.get(getLatestMCCBPrimary_API);
      const latestMCCB = response.data;
      const latestMCCBId = extractMCCBPrimaryId(latestMCCB);
      setLatestMCCBPrimaryId(Number(latestMCCBId));
    } catch (error) {
      console.error("Error fetching latest MCCB:", error.message);
    }
  };

  const extractMCCBPrimaryId = (MCCBString) => {
    // Remove "MCCB" prefix and "P" suffix from the MCCBString
    return MCCBString.replace("MCCBPAN", "").replace("-P", "");
  };

  // ==================================== M C C B (C A T C H E R) =======================================
  useEffect(() => {
    fetchLatestMCCBCatcher();
  }, []);

  useEffect(() => {
    if (numQR === "1") {
      setExpectedMCCBCatcherRange(
        `Expected Output: MCCBPAN${formatId(Number(latestMCCBCatcherId) + 1)}-C`
      );
    } else if (numQR > 1 && numQR !== "1") {
      setExpectedMCCBCatcherRange(
        ` Expected Output: MCCBPAN${formatId(
          Number(latestMCCBCatcherId) + 1
        )}-C - MCCBPAN${formatId(
          Number(latestMCCBCatcherId) + Number(numQR)
        )}-C`
      );
    } else {
      setExpectedMCCBCatcherRange("");
    }
  }, [numQR, latestMCCBCatcherId]);

  useEffect(() => {
    setShowExpectedMCCBCatcherRange(true);
  }, [numQR]);

  const fetchLatestMCCBCatcher = async () => {
    try {
      const response = await axios.get(getLatestMCCBCatcher_API);
      const latestMCCB = response.data;
      const latestMCCBId = extractMCCBCatcherId(latestMCCB);
      setLatestMCCBCatcherId(Number(latestMCCBId));
    } catch (error) {
      console.error("Error fetching latest MCCB:", error.message);
    }
  };

  const extractMCCBCatcherId = (MCCBString) => {
    // Remove "MCCB" prefix and "P" suffix from the MCCBString
    return MCCBString.replace("MCCBPAN", "").replace("-C", "");
  };

  // ==================================== C T I N T E R F A C E (L E F T) =======================================
  useEffect(() => {
    fetchLatestLeftCTInterface();
  }, []);

  useEffect(() => {
    if (numQR === "1") {
      setExpectedLeftCTInterfaceRange(
        `Expected Output: CT${formatId(Number(latestLeftCTInterfaceId) + 1)}L-P`
      );
    } else if (numQR > 1 && numQR !== "1") {
      setExpectedLeftCTInterfaceRange(
        ` Expected Output: CT${formatId(
          Number(latestLeftCTInterfaceId) + 1
        )}L-P - CT${formatId(
          Number(latestLeftCTInterfaceId) + Number(numQR)
        )}L-P`
      );
    } else {
      setExpectedLeftCTInterfaceRange("");
    }
  }, [numQR, latestLeftCTInterfaceId]);

  useEffect(() => {
    setShowExpectedLeftCTInterfaceRange(true);
  }, [numQR]);

  const fetchLatestLeftCTInterface = async () => {
    try {
      const response = await axios.get(getLatestLeftCTInterface_API);
      const latestLeftCTInterface = response.data;
      const latestLeftCTInterfaceId = extractLeftCTInterfaceId(
        latestLeftCTInterface
      );
      setLatestLeftCTInterfaceId(Number(latestLeftCTInterfaceId));
    } catch (error) {
      console.error("Error fetching latest MCCB:", error.message);
    }
  };

  const extractLeftCTInterfaceId = (MCCBString) => {
    // Remove "MCCB" prefix and "P" suffix from the MCCBString
    return MCCBString.replace("CT", "").replace("L-P", "");
  };

  // ==================================== S U B M I T =======================================

  useEffect(() => {
    setQRGeneratedStatus(false);
    setEmptyInputError(false);
  }, [selectedSubAssemblyType]);

  const handleSubmit = async (e) => {
    console.log(numQR);
    console.log(selectedSubAssemblyType);

    setQRGeneratedStatus(false);

    e.preventDefault();

    if (numQR === "0" || numQR === "") {
      //   setQRGeneratedStatus(false);
      setEmptyInputError(true);
      return;
    }

    // ======================================= P A N E L =======================================
    if (selectedSubAssemblyType === "Panel") {
      const Panels = Array.from({ length: numQR }, (_, index) => {
        const newPanelId = formatId(Number(latestPanelId + 1) + index);
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
        fetchLatestPanel();

        setQRcode(() => {
          const newQRCodes = response.data.map((qrcode, index) => ({
            ...qrcode,
            panelId: `CPAN${formatId(Number(latestPanelId + 1) + index)}`,
          }));
          return newQRCodes;
        });

        setQRGeneratedStatus(true);
        setShowExpectedPanelRange(false);
        setEmptyInputError(false);
      } catch (error) {
        console.error("Error generating Panel:", error.message);
      }
      // ==================================== L O A D B A N K (P R I M A R Y)=======================================
    } else if (selectedSubAssemblyType === "LoadbankPrimary") {
      const Loadbanks = Array.from({ length: numQR }, (_, index) => {
        const newLoadbankId = formatId(Number(latestLoadbankId + 1) + index);
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
        fetchLatestLoadbank();

        setQRcode(() => {
          const newQRCodes = response.data.map((qrcode, index) => ({
            ...qrcode,
            loadbankId: `LB${formatId(Number(latestLoadbankId + 1) + index)}-P`,
          }));
          return newQRCodes;
        });

        setQRGeneratedStatus(true);
        setShowExpectedLoadbankRange(false);
        setEmptyInputError(false);
      } catch (error) {
        console.error("Error generating Loadbank:", error.message);
      }
      // ==================================== L O A D B A N K (C A T C H E R) =======================================
    } else if (selectedSubAssemblyType === "LoadbankCatcher") {
      const Loadbanks = Array.from({ length: numQR }, (_, index) => {
        const newLoadbankId = formatId(
          Number(latestLoadbankCatcherId + 1) + index
        );
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
        fetchLatestLoadbankCatcher();

        setQRcode(() => {
          const newQRCodes = response.data.map((qrcode, index) => ({
            ...qrcode,
            loadbankId: `LB${formatId(
              Number(latestLoadbankCatcherId + 1) + index
            )}-C`,
          }));
          return newQRCodes;
        });

        setQRGeneratedStatus(true);
        setShowExpectedLoadbankCatcherRange(false);
        setEmptyInputError(false);
      } catch (error) {
        console.error("Error generating Loadbank:", error.message);
      }
      // ==================================== M C C B (P R I M A R Y) =======================================
    } else if (selectedSubAssemblyType === "MCCBPrimary") {
      const MCCBs = Array.from({ length: numQR }, (_, index) => {
        const newMCCBId = formatId(Number(latestMCCBPrimaryId + 1) + index);
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
        fetchLatestMCCBPrimary();

        setQRcode(() => {
          const newQRCodes = response.data.map((qrcode, index) => ({
            ...qrcode,
            MCCBId: `MCCBPAN${formatId(
              Number(latestMCCBPrimaryId + 1) + index
            )}-P`,
          }));
          return newQRCodes;
        });

        setQRGeneratedStatus(true);
        setShowExpectedMCCBPrimaryRange(false);
        setEmptyInputError(false);
      } catch (error) {
        console.error("Error generating MCCB:", error.message);
      }
      // ==================================== M C C B (C A T C H E R) =======================================
    } else if (selectedSubAssemblyType === "MCCBCatcher") {
      const MCCBs = Array.from({ length: numQR }, (_, index) => {
        const newMCCBId = formatId(Number(latestMCCBCatcherId + 1) + index);
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
        fetchLatestMCCBCatcher();

        setQRcode(() => {
          const newQRCodes = response.data.map((qrcode, index) => ({
            ...qrcode,
            MCCBId: `MCCBPAN${formatId(
              Number(latestMCCBCatcherId + 1) + index
            )}-C`,
          }));
          return newQRCodes;
        });

        setQRGeneratedStatus(true);
        setShowExpectedMCCBCatcherRange(false);
        setEmptyInputError(false);
      } catch (error) {
        console.error("Error generating MCCB:", error.message);
      }
      // ==================================== C T I N T E R F A C E (L E F T) =======================================
    } else if (selectedSubAssemblyType === "LeftCTInterface") {
      const LeftCTInterfaces = Array.from({ length: numQR }, (_, index) => {
        const newCTInterfaceId = formatId(
          Number(latestLeftCTInterfaceId + 1) + index
        );
        return {
          link: `${linkFormat}${applicationPortNumber}/Dashboard/CTInterface/CT${newCTInterfaceId}L-P`,
          generatedDate: moment()
            .tz("Australia/Sydney")
            .format("YYYY-MM-DD HH:mm:ss"),
          CTId: `CT${newCTInterfaceId}L-P`,
        };
      });

      try {
        const response = await axios.post(generateLeftCTInterface_API, {
          LeftCTInterfaces,
        });
        console.log(response.data);
        fetchLatestLeftCTInterface();

        setQRcode(() => {
          const newQRCodes = response.data.map((qrcode, index) => ({
            ...qrcode,
            CTId: `CT${formatId(
              Number(latestLeftCTInterfaceId + 1) + index
            )}L-P`,
          }));
          return newQRCodes;
        });

        setQRGeneratedStatus(true);
        setShowExpectedLeftCTInterfaceRange(false);
        setEmptyInputError(false);
      } catch (error) {
        console.error("Error generating CT Interface:", error.message);
      }
    } else {
      console.log("Unvalid Type");
    }
  };

  useEffect(() => {
    // Get the current URL
    const currentUrl = window.location.href;

    // Check if the URL contains "Panel"
    if (currentUrl.includes("Panel")) {
      // Set the selected value of the dropdown to "Panel"
      setSelectedSubAssemblyType("Panel");
      fetchLatestPanel();
    } else if (currentUrl.includes("LoadbankPrimary")) {
      // Set the selected value of the dropdown to "Loadbank"
      setSelectedSubAssemblyType("LoadbankPrimary");
      fetchLatestLoadbank();
    } else if (currentUrl.includes("LoadbankCatcher")) {
      // Set the selected value of the dropdown to "Loadbank"
      setSelectedSubAssemblyType("LoadbankCatcher");
      fetchLatestLoadbankCatcher();
    } else if (currentUrl.includes("MCCBPrimary")) {
      // Set the selected value of the dropdown to "MCCB"
      setSelectedSubAssemblyType("MCCBPrimary");
      fetchLatestMCCBPrimary();
    } else if (currentUrl.includes("MCCBCatcher")) {
      // Set the selected value of the dropdown to "MCCB"
      setSelectedSubAssemblyType("MCCBCatcher");
      fetchLatestMCCBCatcher();
    } else if (currentUrl.includes("CTInterfaceLeft")) {
      // Set the selected value of the dropdown to "LeftCTInterface"
      setSelectedSubAssemblyType("LeftCTInterface");
      fetchLatestLeftCTInterface();
    }
  }, []);

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
          : selectedSubAssemblyType === "MCCBCatcher"
          ? code.MCCBId
          : selectedSubAssemblyType === "LeftCTInterface"
          ? code.CTId
          : code.CTId;

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
          ? "Panel "
          : selectedSubAssemblyType === "LoadbankPrimary"
          ? "Loadbank (Primary) "
          : selectedSubAssemblyType === "LoadbankCatcher"
          ? "Loadbank (Catcher) "
          : selectedSubAssemblyType === "MCCBPrimary"
          ? "MCCB Panel (Primary) "
          : selectedSubAssemblyType === "MCCBCatcher"
          ? "MCCB Panel (Catcher) "
          : "CT Interface (Left)";
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
            Generate Sub-Assembly
          </div>
          {emptyInputError && (
            <div className="flex justify-center">
              <p className="mt-3 p-1 pl-2 pr-2 bg-red-500 text-xs font-bold rounded-full">
                {" "}
                Please Input Number of QR to be generated
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
              <option value="LeftCTInterface">CT Interface (Left)</option>
            </select>
            {selectedSubAssemblyType && (
              <div className="mt-5">
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
                    ? "Loadbank (Catcher) "
                    : selectedSubAssemblyType === "MCCBPrimary"
                    ? "MCCB Panel (Primary) "
                    : selectedSubAssemblyType === "MCCBCatcher"
                    ? "MCCB Panel (Catcher) "
                    : "CT Interface (Left) "}
                  QR
                  <div className="flex items-center">
                    {selectedSubAssemblyType === "Panel" && (
                      <span className="text-white p-1 pl-2 pr-2 ml-2  font-black rounded-full text-xs bg-green-700">
                        Latest Control Panel Id: CPAN
                        {formatId(Number(latestPanelId))}
                      </span>
                    )}
                    {selectedSubAssemblyType === "LoadbankPrimary" && (
                      <span className="text-white p-1 pl-2 pr-2 ml-2  font-black rounded-full text-xs bg-green-700">
                        Latest Loadbank Id: LB
                        {formatId(Number(latestLoadbankId))}-P
                      </span>
                    )}
                    {selectedSubAssemblyType === "LoadbankCatcher" && (
                      <span className="text-white p-1 pl-2 pr-2 ml-2  font-black rounded-full text-xs bg-green-700">
                        Latest Loadbank Id: LB
                        {formatId(Number(latestLoadbankCatcherId))}-C
                      </span>
                    )}
                    {selectedSubAssemblyType === "MCCBPrimary" && (
                      <span className="text-white p-1 pl-2 pr-2 ml-2  font-black rounded-full text-xs bg-green-700">
                        Latest MCCB Panel Id: MCCBPAN
                        {formatId(Number(latestMCCBPrimaryId))}-P
                      </span>
                    )}
                    {selectedSubAssemblyType === "MCCBCatcher" && (
                      <span className="text-white p-1 pl-2 pr-2 ml-2  font-black rounded-full text-xs bg-green-700">
                        Latest MCCB Panel Id: MCCBPAN
                        {formatId(Number(latestMCCBCatcherId))}-C
                      </span>
                    )}
                    {selectedSubAssemblyType === "LeftCTInterface" && (
                      <span className="text-white p-1 pl-2 pr-2 ml-2  font-black rounded-full text-xs bg-green-700">
                        Latest CT Interface (Left) Id: CT
                        {formatId(Number(latestLeftCTInterfaceId))}L-P
                      </span>
                    )}
                  </div>
                </label>
                <input
                  type="number"
                  id="numQR"
                  className="border w-full px-2 py-1 rounded-md focus:outline-none focus:ring-3 focus:border-gray-600 text-black"
                  min="1"
                  onChange={(e) => setNumQR(e.target.value)}
                />
                {/* ================================ P A N E L  ================================ */}
                {selectedSubAssemblyType === "Panel" &&
                  showExpectedPanelRange &&
                  expectedPanelRange && (
                    <div className="flex justify-start">
                      <p className="mt-2 font-black p-1 text-white bg-secondary text-xs rounded-full pl-2 pr-2">
                        {expectedPanelRange}
                      </p>
                    </div>
                  )}
                {/* ================================ L O A D B A N K (P R I M A R Y)  ================================ */}
                {selectedSubAssemblyType === "LoadbankPrimary" &&
                  showExpectedLoadbankRange &&
                  expectedLoadbankRange && (
                    <div className="flex justify-start">
                      <p className="mt-2 font-black p-1 text-white bg-secondary text-xs rounded-full pl-2 pr-2">
                        {expectedLoadbankRange}
                      </p>
                    </div>
                  )}
                {/* ================================ L O A D B A N K (C A T C H E R)  ================================ */}
                {selectedSubAssemblyType === "LoadbankCatcher" &&
                  showExpectedLoadbankCatcherRange &&
                  expectedLoadbankRange && (
                    <div className="flex justify-start">
                      <p className="mt-2 font-black p-1 text-white bg-secondary text-xs rounded-full pl-2 pr-2">
                        {expectedLoadbankCatcherRange}
                      </p>
                    </div>
                  )}
                {/* ================================ M C C B (P R I M A R Y)  ================================ */}
                {selectedSubAssemblyType === "MCCBPrimary" &&
                  showExpectedMCCBPrimaryRange &&
                  expectedMCCBPrimaryRange && (
                    <div className="flex justify-start">
                      <p className="mt-2 font-black p-1 text-white bg-secondary text-xs rounded-full pl-2 pr-2">
                        {expectedMCCBPrimaryRange}
                      </p>
                    </div>
                  )}
                {/* ================================ M C C B (C A T C H E R)  ================================ */}
                {selectedSubAssemblyType === "MCCBCatcher" &&
                  showExpectedMCCBCatcherRange &&
                  expectedMCCBCatcherRange && (
                    <div className="flex justify-start">
                      <p className="mt-2 font-black p-1 text-white bg-secondary text-xs rounded-full pl-2 pr-2">
                        {expectedMCCBCatcherRange}
                      </p>
                    </div>
                  )}
                {/* ================================ C T I N T E R F A C E (L E F T)  ================================ */}
                {selectedSubAssemblyType === "LeftCTInterface" &&
                  showExpectedLeftCTInterfaceRange &&
                  expectedLeftCTInterfaceRange && (
                    <div className="flex justify-start">
                      <p className="mt-2 font-black p-1 text-white bg-secondary text-xs rounded-full pl-2 pr-2">
                        {expectedLeftCTInterfaceRange}
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
          {/* ================================ P A N E L  ================================ */}
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
                  <div>
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
                      <div className="mb-5">
                        Control Panel ID: {code.panelId}
                      </div>
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
                </div>
              ))}
            </div>
          )}
          {/* ================================ L O A D B A N K (P R I M A R Y)  ================================ */}
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
                  <div>
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
                      <div className="mb-5">
                        Loadbank ID: {code.loadbankId}{" "}
                        <span className="text-red-500 ml-1 mr-1 font-black">
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
                </div>
              ))}
            </div>
          )}
          {/* ================================ L O A D B A N K (C A T C H E R)  ================================ */}
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
                  <div>
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
                      <div className="mb-5">
                        Loadbank ID: {code.loadbankId}{" "}
                        <span className="text-red-500 ml-1 mr-1 font-black">
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
                </div>
              ))}
            </div>
          )}
          {/* ================================ M C C B (P R I M A R Y)  ================================ */}
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
                  <div>
                    <div id={`qrcode-${code.MCCBId}`}>
                      <ReactQRCode
                        value={JSON.stringify({
                          link: code.link,
                          MCCBPrimaryId: code.MCCBId,
                        })}
                        size={512}
                        imageSettings={{
                          src: logo,
                          excavate: true,
                          width: 60,
                          height: 35,
                        }}
                      />
                      <div className="mb-5">
                        MCCB Panel ID : {code.MCCBId}{" "}
                        <span className="text-red-500 ml-1 mr-1 font-black">
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
                </div>
              ))}
            </div>
          )}
          {/* ================================ M C C B (C A T C H E R)  ================================ */}
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
                  <div>
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
                      <div className="mb-5">
                        MCCB Panel ID: {code.MCCBId}{" "}
                        <span className="text-red-500 ml-1 mr-1 font-black">
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
                </div>
              ))}
            </div>
          )}
          {/* ================================ C T I N T E R F A C E (L E F T)  ================================ */}
          {selectedSubAssemblyType === "LeftCTInterface" && (
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
                  <div>
                    <div id={`qrcode-${code.CTId}`}>
                      <ReactQRCode
                        value={JSON.stringify({
                          link: code.link,
                          LeftCTInterfaceId: code.CTId,
                        })}
                        size={512}
                        imageSettings={{
                          src: logo,
                          excavate: true,
                          width: 60,
                          height: 35,
                        }}
                      />
                      <div className="mb-5">
                        CT Interface ID: {code.CTId}{" "}
                        <span className="text-red-500 ml-1 mr-1 font-black">
                          {" "}
                          (Left)
                        </span>
                      </div>
                    </div>

                    <img
                      src={imageData[code.CTId]}
                      alt={`Converted ${code.CTId}`}
                      style={{ display: "none", margin: "10px auto" }}
                    />

                    <div className="mt-5 flex items-center justify-center">
                      <button
                        className="bg-signature hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded "
                        onClick={() => handleDownload(code.CTId)}
                      >
                        Download
                      </button>
                    </div>
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
