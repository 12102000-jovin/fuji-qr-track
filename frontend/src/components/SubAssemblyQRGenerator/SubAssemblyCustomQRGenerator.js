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

  const [expectedLeftCTInterfaceRange, setExpectedLeftCTInterfaceRange] =
    useState("");
  const [
    showExpectedLeftCTInterfaceRange,
    setShowExpectedLeftCTInterfaceRange,
  ] = useState(true);

  const [expectedRightCTInterfaceRange, setExpectedRightCTInterfaceRange] =
    useState("");
  const [
    showExpectedRightCTInterfaceRange,
    setShowExpectedRightCTInterfaceRange,
  ] = useState(true);

  const [
    expectedLeftPrimaryChassisRailRange,
    setExpectedLeftPrimaryChassisRailRange,
  ] = useState("");
  const [
    showExpectedLeftPrimaryChassisRailRange,
    setShowExpectedLeftPrimaryChassisRailRange,
  ] = useState(true);

  const [
    expectedRightPrimaryChassisRailRange,
    setExpectedRightPrimaryChassisRailRange,
  ] = useState("");
  const [
    showExpectedRightPrimaryChassisRailRange,
    setShowExpectedRightPrimaryChassisRailRange,
  ] = useState(true);

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
  const generateLeftCTInterface_API =
    "http://localhost:3001/SubAssembly/CTInterfaceLeft/generateSubAssembly";
  const generateRightCTInterface_API =
    "http://localhost:3001/SubAssembly/CTInterfaceRight/generateSubAssembly";
  const generateLeftPrimaryChassisRail_API =
    "http://localhost:3001/SubAssembly/LeftPrimaryChassisRail/generateSubAssembly";
  const generateRightPrimaryChassisRail_API =
    "http://localhost:3001/SubAssembly/RightPrimaryChassisRail/generateSubAssembly";

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

  // ==================================== C T I N T E R F A C E (L E F T) =======================================

  useEffect(() => {
    setShowExpectedLeftCTInterfaceRange(true);
  }, [numQR]);

  useEffect(() => {
    if (numQR === "1") {
      setExpectedLeftCTInterfaceRange(
        `Expected Output: CT${formatId(Number(startNum))}L-P`
      );
    } else if (numQR > 1 && numQR !== "1") {
      setExpectedLeftCTInterfaceRange(
        ` Expected Output: CT${formatId(Number(startNum))}L-P - CT${formatId(
          Number(startNum) + Number(numQR) - 1
        )}L-P`
      );
    } else {
      setExpectedLeftCTInterfaceRange("");
    }
  }, [numQR, startNum]);
  // ==================================== C T I N T E R F A C E (R I G H T) =======================================

  useEffect(() => {
    setShowExpectedRightCTInterfaceRange(true);
  }, [numQR]);

  useEffect(() => {
    if (numQR === "1") {
      setExpectedRightCTInterfaceRange(
        `Expected Output: CT${formatId(Number(startNum))}R-P`
      );
    } else if (numQR > 1 && numQR !== "1") {
      setExpectedRightCTInterfaceRange(
        ` Expected Output: CT${formatId(Number(startNum))}R-P - CT${formatId(
          Number(startNum) + Number(numQR) - 1
        )}R-P`
      );
    } else {
      setExpectedRightCTInterfaceRange("");
    }
  }, [numQR, startNum]);

  // ==================================== C H A S S I S  R A I L (L E F T) (P R I M A R Y) =======================================

  useEffect(() => {
    setShowExpectedLeftPrimaryChassisRailRange(true);
  }, [numQR]);

  useEffect(() => {
    if (numQR === "1") {
      setExpectedLeftPrimaryChassisRailRange(
        `Expected Output: CHR${formatId(Number(startNum))}L-P`
      );
    } else if (numQR > 1 && numQR !== "1") {
      setExpectedLeftPrimaryChassisRailRange(
        ` Expected Output: CHR${formatId(Number(startNum))}L-P - CHR${formatId(
          Number(startNum) + Number(numQR) - 1
        )}L-P`
      );
    } else {
      setExpectedLeftPrimaryChassisRailRange("");
    }
  }, [numQR, startNum]);

  // ==================================== C H A S S I S  R A I L (R I G H T) (P R I M A R Y) =======================================

  useEffect(() => {
    setShowExpectedRightPrimaryChassisRailRange(true);
  }, [numQR]);

  useEffect(() => {
    if (numQR === "1") {
      setExpectedRightPrimaryChassisRailRange(
        `Expected Output: CHR${formatId(Number(startNum))}R-P`
      );
    } else if (numQR > 1 && numQR !== "1") {
      setExpectedRightPrimaryChassisRailRange(
        ` Expected Output: CHR${formatId(Number(startNum))}R-P - CHR${formatId(
          Number(startNum) + Number(numQR) - 1
        )}R-P`
      );
    } else {
      setExpectedRightPrimaryChassisRailRange("");
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

    // ======================================= P A N E L =======================================
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
      // ======================================= L O A D B A N K (P R I M A R Y) =======================================
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
      // ======================================= L O A D B A N K (C A T C H E R) =======================================
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
      // ======================================= M C C B (P R I M A R Y) =======================================
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
      // ======================================= M C C B (C A T C H E R) =======================================
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
      // ======================================= C T I N T E R F A C E (L E F T) =======================================
    } else if (selectedSubAssemblyType === "LeftCTInterface") {
      const LeftCTInterfaces = Array.from({ length: numQR }, (_, index) => {
        const newCTInterfaceId = formatId(Number(startNum) + index);
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

        setQRcode(() => {
          const newQRCodes = response.data.map((qrcode, index) => ({
            ...qrcode,
            CTId: `CT${formatId(Number(startNum) + index)}L-P`,
          }));
          return newQRCodes;
        });

        setQRGeneratedStatus(true);
        setShowExpectedLeftCTInterfaceRange(false);
        setEmptyInputError(false);
      } catch (error) {
        console.error("Error generating CT Interface:", error.message);
        setDuplicateError("Duplicate CT Interface Found");
        setEmptyInputError(false);
      }
      // ======================================= C T I N T E R F A C E (R I G H T) =======================================
    } else if (selectedSubAssemblyType === "RightCTInterface") {
      const RightCTInterfaces = Array.from({ length: numQR }, (_, index) => {
        const newCTInterfaceId = formatId(Number(startNum) + index);
        return {
          link: `${linkFormat}${applicationPortNumber}/Dashboard/CTInterface/CT${newCTInterfaceId}R-P`,
          generatedDate: moment()
            .tz("Australia/Sydney")
            .format("YYYY-MM-DD HH:mm:ss"),
          CTId: `CT${newCTInterfaceId}R-P`,
        };
      });

      try {
        const response = await axios.post(generateRightCTInterface_API, {
          RightCTInterfaces,
        });
        console.log(response.data);

        setQRcode(() => {
          const newQRCodes = response.data.map((qrcode, index) => ({
            ...qrcode,
            CTId: `CT${formatId(Number(startNum) + index)}R-P`,
          }));
          return newQRCodes;
        });

        setQRGeneratedStatus(true);
        setShowExpectedRightCTInterfaceRange(false);
        setEmptyInputError(false);
      } catch (error) {
        console.error("Error generating CT Interface:", error.message);
        setDuplicateError("Duplicate CT Interface Found");
        setEmptyInputError(false);
      }
      // ======================================= C H A S S I S (L E F T) (P R I M A R Y) =======================================
    } else if (selectedSubAssemblyType === "LeftPrimaryChassisRail") {
    } else if (selectedSubAssemblyType === "RightPrimaryChassisRail") {
      const RightPrimaryChassisRails = Array.from(
        { length: numQR },
        (_, index) => {
          const newRightPrimaryChassisRailId = formatId(
            Number(startNum) + index
          );
          return {
            link: `${linkFormat}${applicationPortNumber}/Dashboard/ChassisRail/CHR${newRightPrimaryChassisRailId}R-P`,
            generatedDate: moment()
              .tz("Australia/Sydney")
              .format("YYYY-MM-DD HH:mm:ss"),
            chassisId: `CHR${newRightPrimaryChassisRailId}R-P`,
          };
        }
      );

      try {
        const response = await axios.post(generateRightPrimaryChassisRail_API, {
          RightPrimaryChassisRails,
        });
        console.log(response.data);

        setQRcode(() => {
          const newQRCodes = response.data.map((qrcode, index) => ({
            ...qrcode,
            chassisId: `CHR${formatId(Number(startNum) + index)}R-P`,
          }));
          return newQRCodes;
        });

        setQRGeneratedStatus(true);
        setShowExpectedRightPrimaryChassisRailRange(false);
        setEmptyInputError(false);
      } catch (error) {
        console.error("Error generating Chassis Rail:", error.message);
        setDuplicateError("Duplicate Chassis Rail Found");
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
          : selectedSubAssemblyType === "MCCBCatcher"
          ? code.MCCBId
          : selectedSubAssemblyType === "LeftCTInterface"
          ? code.CTId
          : selectedSubAssemblyType === "RightCTInterface"
          ? code.CTId
          : selectedSubAssemblyType === "LeftPrimaryChassisRail"
          ? code.chassisId
          : selectedSubAssemblyType === "RightPrimaryChassisRail"
          ? code.chassisId
          : code.chassisId;

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
          : selectedSubAssemblyType === "LeftCTInterface"
          ? "CT Interface (Left) "
          : selectedSubAssemblyType === "RightCTInterface"
          ? "CT Interface (Right) "
          : selectedSubAssemblyType === "LeftPrimaryChassisRail"
          ? "Chassis Rail (Left) (Primary) "
          : "Chassis Rail (Right) (Primary)";
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
    } else if (currentUrl.includes("CTInterfaceLeft")) {
      // Set the selected value of the dropdown to "LeftCTInterface"
      setSelectedSubAssemblyType("LeftCTInterface");
    } else if (currentUrl.includes("CTInterfaceRight")) {
      // Set the selected value of the dropdown to "RightCTInterface"
      setSelectedSubAssemblyType("RightCTInterface");
    } else if (currentUrl.includes("ChassisRailLeftPrimary")) {
      // Set the selected value of the dropdown to "ChassisRailLeftPrimary"
      setSelectedSubAssemblyType("LeftPrimaryChassisRail");
    } else if (currentUrl.includes("ChassisRailRightPrimary")) {
      // Set the selected value of the dropdown to "ChassisRailRightPrimary"
      setSelectedSubAssemblyType("RightPrimaryChassisRail");
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
              <option value="LeftCTInterface">CT Interface (Left)</option>
              <option value="RightCTInterface">CT Interface (Right)</option>
              <option value="LeftPrimaryChassisRail">
                Chassis Rail (Left) (Primary)
              </option>
              <option value="RightPrimaryChassisRail">
                Chassis Rail (Right) (Primary)
              </option>
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
                      : selectedSubAssemblyType === "MCCBCatcher"
                      ? "MCCB Panel (Catcher) "
                      : selectedSubAssemblyType === "LeftCTInterface"
                      ? "CT Interface (Left) "
                      : selectedSubAssemblyType === "RightCTInterface"
                      ? "CT Interface (Right) "
                      : selectedSubAssemblyType === "LeftPrimaryChassisRail"
                      ? "Chassis Rail (Left) (Primary) "
                      : "Chassis Rail (Right) (Primary) "}
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
                      ? "Loadbank (Catcher) "
                      : selectedSubAssemblyType === "MCCBPrimary"
                      ? "MCCB Panel (Primary) "
                      : selectedSubAssemblyType === "MCCBCatcher"
                      ? "MCCB Panel (Catcher) "
                      : selectedSubAssemblyType === "LeftCTInterface"
                      ? "CT Interface (Left) "
                      : selectedSubAssemblyType === "RightCTInterface"
                      ? "CT Interface (Right) "
                      : selectedSubAssemblyType === "LeftPrimaryChassisRail"
                      ? "Chassis Rail (Left) (Primary) "
                      : "Chassis Rail (Right) (Primary) "}
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
                {selectedSubAssemblyType === "LeftCTInterface" &&
                  showExpectedLeftCTInterfaceRange &&
                  expectedLeftCTInterfaceRange && (
                    <div className="flex justify-start">
                      <p className="mt-2 font-black p-1 text-white bg-secondary text-xs rounded-full pl-2 pr-2">
                        {expectedLeftCTInterfaceRange}
                      </p>
                    </div>
                  )}
                {selectedSubAssemblyType === "RightCTInterface" &&
                  showExpectedRightCTInterfaceRange &&
                  expectedRightCTInterfaceRange && (
                    <div className="flex justify-start">
                      <p className="mt-2 font-black p-1 text-white bg-secondary text-xs rounded-full pl-2 pr-2">
                        {expectedRightCTInterfaceRange}
                      </p>
                    </div>
                  )}
                {selectedSubAssemblyType === "LeftPrimaryChassisRail" &&
                  showExpectedLeftPrimaryChassisRailRange &&
                  expectedLeftPrimaryChassisRailRange && (
                    <div className="flex justify-start">
                      <p className="mt-2 font-black p-1 text-white bg-secondary text-xs rounded-full pl-2 pr-2">
                        {expectedLeftPrimaryChassisRailRange}
                      </p>
                    </div>
                  )}

                {selectedSubAssemblyType === "RightPrimaryChassisRail" &&
                  showExpectedRightPrimaryChassisRailRange &&
                  expectedRightPrimaryChassisRailRange && (
                    <div className="flex justify-start">
                      <p className="mt-2 font-black p-1 text-white bg-secondary text-xs rounded-full pl-2 pr-2">
                        {expectedRightPrimaryChassisRailRange}
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
          {/* ================================ C T I N T E R F A C E (R I G H T)  ================================ */}
          {selectedSubAssemblyType === "RightCTInterface" && (
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
                          RightCTInterfaceId: code.CTId,
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
                          (Right)
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
          {/* ================================ C H A S S I S  R A I L (L E F T) (P R I M A R Y)  ================================ */}
          {selectedSubAssemblyType === "LeftPrimaryChassisRail" && (
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
                    <div id={`qrcode-${code.chassisId}`}>
                      <ReactQRCode
                        value={JSON.stringify({
                          link: code.link,
                          leftPrimaryChassisRailId: code.chassisId,
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
                        Chassis Rail ID: {code.chassisId}{" "}
                        <span className="text-red-500 ml-1 mr-1 font-black">
                          {" "}
                          (Left)
                        </span>
                        <span className="text-red-500 ml-1 mr-1 font-black">
                          {" "}
                          (Primary)
                        </span>
                      </div>
                    </div>

                    <img
                      src={imageData[code.chassisId]}
                      alt={`Converted ${code.chassisId}`}
                      style={{ display: "none", margin: "10px auto" }}
                    />

                    <div className="mt-5 flex items-center justify-center">
                      <button
                        className="bg-signature hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded "
                        onClick={() => handleDownload(code.chassisId)}
                      >
                        Download
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          {/* ================================ C H A S S I S  R A I L (R I G H T) (P R I M A R Y)  ================================ */}
          {selectedSubAssemblyType === "RightPrimaryChassisRail" && (
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
                    <div id={`qrcode-${code.chassisId}`}>
                      <ReactQRCode
                        value={JSON.stringify({
                          link: code.link,
                          rightPrimaryChassisRailId: code.chassisId,
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
                        Chassis Rail ID: {code.chassisId}{" "}
                        <span className="text-red-500 ml-1 mr-1 font-black">
                          {" "}
                          (Right)
                        </span>
                        <span className="text-red-500 ml-1 mr-1 font-black">
                          {" "}
                          (Primary)
                        </span>
                      </div>
                    </div>

                    <img
                      src={imageData[code.chassisId]}
                      alt={`Converted ${code.chassisId}`}
                      style={{ display: "none", margin: "10px auto" }}
                    />

                    <div className="mt-5 flex items-center justify-center">
                      <button
                        className="bg-signature hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded "
                        onClick={() => handleDownload(code.chassisId)}
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
