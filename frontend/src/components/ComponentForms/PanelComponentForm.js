import React, { useEffect, useState } from "react";
import axios from "axios";
import moment from "moment-timezone";
import PhotoIcon from "@mui/icons-material/Photo";
import ComponentImageModal from "./ComponentImageModal";
import CircularProgress from "@mui/material/CircularProgress";
import Tooltip from "@mui/material/Tooltip";

const PanelComponentForm = (panelId) => {
  // const [switchValue, setSwitchValue] = useState("");
  // const [breakerValue, setBreakerValue] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successfulMessage, setSuccessfulMessage] = useState("");
  const [componentImageModalState, setComponentImageModalState] =
    useState(false);
  const [componentImageModalType, setComponentImageModalType] = useState("");
  const [isAllocateLoading, setIsAllocateLoading] = useState(false);

  const [meter1Value, setMeter1Value] = useState("");
  const [meter2Value, setMeter2Value] = useState("");
  const [catcherMeterValue, setCatcherMeterValue] = useState("");
  const [modulCTValue, setModulCTValue] = useState("");
  const [modulDI1Value, setModulDI1Value] = useState("");
  const [modulDI2Value, setModulDI2Value] = useState("");
  const [moxaGatewayValue, setMoxaGatewayValue] = useState("");
  const [switchHMIValue, setSwitchHMIValue] = useState("");
  const [switchNWValue, setSwitchNWValue] = useState("");
  const [moxaIoLogikValue, setMoxaIoLogikValue] = useState("");
  const [quintPSUPrimaryValue, setQuintPSUPrimaryValue] = useState("");
  const [quintPSUCatcherValue, setQuintPSUCatcherValue] = useState("");
  const [quintCMPrimaryValue, setQuintCMPrimaryValue] = useState("");
  const [quintCMCatcherValue, setQuintCMCatcherValue] = useState("");
  const [trioDiodeValue, setTrioDiodeValue] = useState("");

  const [meter1Exist, setMeter1Exist] = useState("");
  const [meter2Exist, setMeter2Exist] = useState("");
  const [catcherMeterExist, setCatcherMeterExist] = useState("");
  const [modulCTExist, setModulCTExist] = useState("");
  const [modulDI1Exist, setModulDI1Exist] = useState("");
  const [modulDI2Exist, setModulDI2Exist] = useState("");
  const [moxaGatewayExist, setMoxaGatewayExist] = useState("");
  const [switchHMIExist, setSwitchHMIExist] = useState("");
  const [switchNWExist, setSwitchNWExist] = useState("");
  const [moxaIoLogikExist, setMoxaIoLogikExist] = useState("");
  const [quintPSUPrimaryExist, setQuintPSUPrimaryExist] = useState("");
  const [quintPSUCatcherExist, setQuintPSUCatcherExist] = useState("");
  const [quintCMPrimaryExist, setQuintCMPrimaryExist] = useState("");
  const [quintCMCatcherExist, setQuintCMCatcherExist] = useState("");
  const [trioDiodeExist, setTrioDiodeExist] = useState("");

  const [componentComplete, setComponentComplete] = useState(false);

  const [controlPanelData, setControlPanelData] = useState(null);

  const AllocatePanel_API =
    "http://localhost:3001/Allocate/AllocatePanelComponent";

  const handleMeter1Change = (e) => {
    setMeter1Value(e.target.value);
  };

  const handleMeter2Change = (e) => {
    setMeter2Value(e.target.value);
  };

  const handleCatcherMeterChange = (e) => {
    setCatcherMeterValue(e.target.value);
  };

  const handleModulCTChange = (e) => {
    setModulCTValue(e.target.value);
  };

  const handleModulDI1Change = (e) => {
    setModulDI1Value(e.target.value);
  };

  const handleModulDI2Change = (e) => {
    setModulDI2Value(e.target.value);
  };

  const handleMoxaGatewayChange = (e) => {
    setMoxaGatewayValue(e.target.value);
  };

  const handleSwitchHMIChange = (e) => {
    setSwitchHMIValue(e.target.value);
  };

  const handleSwitchNWChange = (e) => {
    setSwitchNWValue(e.target.value);
  };

  const handleMoxaIoLogikChange = (e) => {
    setMoxaIoLogikValue(e.target.value);
  };

  const handleQuintPSUPrimaryChange = (e) => {
    setQuintPSUPrimaryValue(e.target.value);
  };

  const handleQuintPSUCatcherChange = (e) => {
    setQuintPSUCatcherValue(e.target.value);
  };

  const handleQuintCMPrimaryChange = (e) => {
    setQuintCMPrimaryValue(e.target.value);
  };

  const handleQuintCMCatcherChange = (e) => {
    setQuintCMCatcherValue(e.target.value);
  };

  const handleTrioDiodeChange = (e) => {
    setTrioDiodeValue(e.target.value);
  };

  const handleOpenImageModal = (type) => {
    setComponentImageModalState(true);
    setComponentImageModalType(type);
  };

  const handleCloseImageModal = () => {
    setComponentImageModalState(false);
    setComponentImageModalType("");
  };

  const handleComponentDashboard = () => {
    console.log("test");
  };

  const fetchControlPanelData_API = `http://localhost:3001/Dashboard/${panelId.panelId}/showPanelDashboard`;

  const fetchControlPanelData = async () => {
    try {
      const response = await axios.get(fetchControlPanelData_API);
      setControlPanelData(response.data);

      // Map component serial numbers to their types
      const componentMap = {};
      response.data.componentData.forEach((component) => {
        componentMap[component.componentSerialNumber] = component.componentType;
      });

      // Set component existence based on component data
      response.data.componentData.forEach((component) => {
        switch (component.componentType) {
          case "UMG-801 Primary Meter 1":
            setMeter1Exist(component.componentSerialNumber);
            break;
          case "UMG-801 Primary Meter 2":
            setMeter2Exist(component.componentSerialNumber);
            break;
          case "UMG-801 Catcher Meter":
            setCatcherMeterExist(component.componentSerialNumber);
            break;
          case "Modul 800-CT8-A":
            setModulCTExist(component.componentSerialNumber);
            break;
          case "Modul 800-D114 (A)":
            setModulDI1Exist(component.componentSerialNumber);
            break;
          case "Modul 800-D114 (B)":
            setModulDI2Exist(component.componentSerialNumber);
            break;
          case "MOXA MB3170 Gateway":
            setMoxaGatewayExist(component.componentSerialNumber);
            break;
          case "Phoenix Contact Ethernet FL-Switch 1005N (HMI)":
            setSwitchHMIExist(component.componentSerialNumber);
            break;
          case "Phoenix Contact Ethernet FL-Switch 1005N (NW)":
            setSwitchNWExist(component.componentSerialNumber);
            break;
          case "MOXA ioLogik E1212":
            setMoxaIoLogikExist(component.componentSerialNumber);
            break;
          case "Quint 4-PS/3AC/24DC/5 Power Supply Unit - Primary":
            setQuintPSUPrimaryExist(component.componentSerialNumber);
            break;
          case "Quint 4-PS/3AC/24DC/5 Power Supply Unit - Catcher":
            setQuintPSUCatcherExist(component.componentSerialNumber);
            break;
          case "Quint 4-CAP/3AC/24DC/4KJ Capacity Module - Primary":
            setQuintCMPrimaryExist(component.componentSerialNumber);
            break;
          case "Quint 4-CAP/3AC/24DC/4KJ Capacity Module - Catcher":
            setQuintCMCatcherExist(component.componentSerialNumber);
            break;
          case "Trio-Diode/12-24DC/2X10/1X20 Redundancy Module":
            setTrioDiodeExist(component.componentSerialNumber);
            break;
          // Add cases for other component types as needed
          default:
            break;
        }
      });
    } catch (error) {
      // Handle any errors here
      console.error("Error fetching control panel data:", error);
      return null;
    }
  };

  useEffect(() => {
    fetchControlPanelData();
    console.log(panelId);
  }, []);

  useEffect(() => {
    if (
      meter1Exist !== "" &&
      meter2Exist !== "" &&
      catcherMeterExist !== "" &&
      modulCTExist !== "" &&
      modulDI1Exist !== "" &&
      modulDI2Exist !== "" &&
      moxaGatewayExist !== "" &&
      switchHMIExist !== "" &&
      switchNWExist !== "" &&
      moxaIoLogikExist !== "" &&
      quintPSUPrimaryExist !== "" &&
      quintPSUCatcherExist !== "" &&
      quintCMPrimaryExist !== "" &&
      quintCMCatcherExist !== "" &&
      trioDiodeExist !== ""
    ) {
      setComponentComplete(true);
      setSuccessfulMessage("All components are completed!");
    }
  }, [
    meter1Exist,
    meter2Exist,
    catcherMeterExist,
    modulCTExist,
    modulDI1Exist,
    modulDI2Exist,
    moxaGatewayExist,
    switchHMIExist,
    switchNWExist,
    moxaIoLogikExist,
    quintPSUPrimaryExist,
    quintPSUCatcherExist,
    quintCMPrimaryExist,
    quintCMCatcherExist,
    trioDiodeExist,
  ]);

  const handleAllocate = async () => {
    try {
      setIsAllocateLoading(true);

      if (meter1Value !== null && meter1Value !== "") {
        const response = await axios.post(AllocatePanel_API, {
          panelId: panelId.panelId,
          componentType: "UMG-801 Primary Meter 1",
          componentDescription: "FUJI-PDC-JA-5231217",
          componentSerialNumber: meter1Value,
          allocatedDate: moment()
            .tz("Australia/Sydney")
            .format("YYYY-MM-DD HH:mm:ss"),
        });
      }

      if (meter2Value !== null && meter2Value !== "") {
        const response = await axios.post(AllocatePanel_API, {
          panelId: panelId.panelId,
          componentType: "UMG-801 Primary Meter 2",
          componentDescription: "FUJI-PDC-JA-5231218",
          componentSerialNumber: meter2Value,
          allocatedDate: moment()
            .tz("Australia/Sydney")
            .format("YYYY-MM-DD HH:mm:ss"),
        });
      }

      if (catcherMeterValue !== null && catcherMeterValue !== "") {
        const response = await axios.post(AllocatePanel_API, {
          panelId: panelId.panelId,
          componentType: "UMG-801 Catcher Meter",
          componentDescription: "FUJI-PDC-JA-5231219",
          componentSerialNumber: catcherMeterValue,
          allocatedDate: moment()
            .tz("Australia/Sydney")
            .format("YYYY-MM-DD HH:mm:ss"),
        });
      }

      if (modulCTValue !== null && modulCTValue !== "") {
        const response = await axios.post(AllocatePanel_API, {
          panelId: panelId.panelId,
          componentType: "Modul 800-CT8-A",
          componentDescription: "FUJI-PDC-JA-5231220",
          componentSerialNumber: modulCTValue,
          allocatedDate: moment()
            .tz("Australia/Sydney")
            .format("YYYY-MM-DD HH:mm:ss"),
        });
      }

      if (modulDI1Value !== null && modulDI1Value !== "") {
        const response = await axios.post(AllocatePanel_API, {
          panelId: panelId.panelId,
          componentType: "Modul 800-D114 (A)",
          componentDescription: "FUJI-PDC-JA-5231222",
          componentSerialNumber: modulDI1Value,
          allocatedDate: moment()
            .tz("Australia/Sydney")
            .format("YYYY-MM-DD HH:mm:ss"),
        });
      }

      if (modulDI2Value !== null && modulDI2Value !== "") {
        const response = await axios.post(AllocatePanel_API, {
          panelId: panelId.panelId,
          componentType: "Modul 800-D114 (B)",
          componentDescription: "FUJI-PDC-JA-5231222",
          componentSerialNumber: modulDI2Value,
          allocatedDate: moment()
            .tz("Australia/Sydney")
            .format("YYYY-MM-DD HH:mm:ss"),
        });
      }

      if (moxaGatewayValue !== null && moxaGatewayValue !== "") {
        const response = await axios.post(AllocatePanel_API, {
          panelId: panelId.panelId,
          componentType: "MOXA MB3170 Gateway",
          componentDescription: "FUJI-PDC-MB3170",
          componentSerialNumber: moxaGatewayValue,
          allocatedDate: moment()
            .tz("Australia/Sydney")
            .format("YYYY-MM-DD HH:mm:ss"),
        });
      }

      if (switchHMIValue !== null && switchHMIValue !== "") {
        const response = await axios.post(AllocatePanel_API, {
          panelId: panelId.panelId,
          componentType: "Phoenix Contact Ethernet FL-Switch 1005N (HMI)",
          componentDescription: "FUJI-PDC-PH-1085039",
          componentSerialNumber: switchHMIValue,
          allocatedDate: moment()
            .tz("Australia/Sydney")
            .format("YYYY-MM-DD HH:mm:ss"),
        });
      }

      if (switchNWValue !== null && switchNWValue !== "") {
        const response = await axios.post(AllocatePanel_API, {
          panelId: panelId.panelId,
          componentType: "Phoenix Contact Ethernet FL-Switch 1005N (NW)",
          componentDescription: "FUJI-PDC-PH-1085039",
          componentSerialNumber: switchNWValue,
          allocatedDate: moment()
            .tz("Australia/Sydney")
            .format("YYYY-MM-DD HH:mm:ss"),
        });
      }

      if (moxaIoLogikValue !== null && moxaIoLogikValue !== "") {
        const response = await axios.post(AllocatePanel_API, {
          panelId: panelId.panelId,
          componentType: "MOXA ioLogik E1212",
          componentDescription: "FUJI-PDC-E1212",
          componentSerialNumber: moxaIoLogikValue,
          allocatedDate: moment()
            .tz("Australia/Sydney")
            .format("YYYY-MM-DD HH:mm:ss"),
        });
      }

      if (quintPSUPrimaryValue !== null && quintPSUPrimaryValue !== "") {
        const response = await axios.post(AllocatePanel_API, {
          panelId: panelId.panelId,
          componentType: "Quint 4-PS/3AC/24DC/5 Power Supply Unit - Primary",
          componentDescription: "FUJI-PDC-QUINT-PWR-PCK-V2",
          componentSerialNumber: quintPSUPrimaryValue,
          allocatedDate: moment()
            .tz("Australia/Sydney")
            .format("YYYY-MM-DD HH:mm:ss"),
        });
      }

      if (quintPSUCatcherValue !== null && quintPSUCatcherValue !== "") {
        const response = await axios.post(AllocatePanel_API, {
          panelId: panelId.panelId,
          componentType: "Quint 4-PS/3AC/24DC/5 Power Supply Unit - Catcher",
          componentDescription: "FUJI-PDC-QUINT-PWR-PCK-V2",
          componentSerialNumber: quintPSUCatcherValue,
          allocatedDate: moment()
            .tz("Australia/Sydney")
            .format("YYYY-MM-DD HH:mm:ss"),
        });
      }

      if (quintCMPrimaryValue !== null && quintCMPrimaryValue !== "") {
        const response = await axios.post(AllocatePanel_API, {
          panelId: panelId.panelId,
          componentType: "Quint 4-CAP/3AC/24DC/4KJ Capacity Module - Primary",
          componentDescription: "FUJI-PDC-QUINT-PWR-PCK-V2",
          componentSerialNumber: quintCMPrimaryValue,
          allocatedDate: moment()
            .tz("Australia/Sydney")
            .format("YYYY-MM-DD HH:mm:ss"),
        });
      }

      if (quintCMCatcherValue !== null && quintCMCatcherValue !== "") {
        const response = await axios.post(AllocatePanel_API, {
          panelId: panelId.panelId,
          componentType: "Quint 4-CAP/3AC/24DC/4KJ Capacity Module - Catcher",
          componentDescription: "FUJI-PDC-QUINT-PWR-PCK-V2",
          componentSerialNumber: quintCMCatcherValue,
          allocatedDate: moment()
            .tz("Australia/Sydney")
            .format("YYYY-MM-DD HH:mm:ss"),
        });
      }

      if (trioDiodeValue !== null && trioDiodeValue !== "") {
        const response = await axios.post(AllocatePanel_API, {
          panelId: panelId.panelId,
          componentType: "Trio-Diode/12-24DC/2X10/1X20 Redundancy Module",
          componentDescription: "FUJI-PDC-QUINT-PWR-PCK-V2",
          componentSerialNumber: trioDiodeValue,
          allocatedDate: moment()
            .tz("Australia/Sydney")
            .format("YYYY-MM-DD HH:mm:ss"),
        });
      }

      // Clear error message if successful
      setErrorMessage("");
      setSuccessfulMessage("Component Allocated to Panel successfully");
      setIsAllocateLoading(false);
    } catch (error) {
      if (error.response) {
        setSuccessfulMessage("");
        setErrorMessage(error.response.data.message || "Internal Server Error");
        setIsAllocateLoading(false);
      } else {
        setSuccessfulMessage("");
        setErrorMessage("Error making the request");
        setIsAllocateLoading(false);
      }
    }
  };

  return (
    <div className="mb-10">
      <div className="p-5 bg-signature text-white rounded-md">
        <div className="flex justify-start text-2xl font-black mb-5">
          Control Panel Components
        </div>
        {errorMessage && (
          <span className="py-1 px-2 bg-red-500 text-xs rounded-full text-white font-bold mt-2 mb-5">
            {errorMessage}
          </span>
        )}
        {successfulMessage && (
          <span className="py-1 px-2 bg-green-500 text-xs rounded-full text-white font-bold mt-2 ">
            {successfulMessage}
          </span>
        )}
        <div className="mt-10">
          <div className="overflow-x-auto rounded-md">
            <table className="min-w-full divide-y divide-gray-200 ">
              <tbody className="bg-white divide-y divide-gray-200">
                {/* ================================ P R I M A R Y  M E T E R (1) ================================ */}
                <tr className="grid grid-cols-1 lg:grid-cols-2 pb-2 lg:pb-0">
                  <td className="py-2 lg:py-4 whitespace-nowrap text-start lg:text-center">
                    <label
                      htmlFor="meter1"
                      className="text-sm font-semibold text-gray-900 p-2 text-wrap"
                    >
                      UMG-801 Primary Meter 1
                    </label>
                  </td>
                  <td className="relative flex items-center px-2 lg:px-0 lg:pb-0">
                    {!meter1Exist && (
                      <input
                        type="text"
                        id="meter1"
                        onChange={handleMeter1Change}
                        autoFocus
                        value={meter1Value}
                        className="border w-full px-2 py-2 rounded-md text-black focus:outline-none focus:ring-3 focus:border-gray-600 text-sm lg:mr-1"
                        placeholder="Enter UMG-801 Primary Meter 1"
                      />
                    )}

                    {meter1Exist && (
                      <p
                        className="bg-signature font-medium px-2 rounded-full"
                        onClick={handleComponentDashboard()}
                      >
                        {" "}
                        {meter1Exist}
                      </p>
                    )}

                    <div className="absolute inset-y-0 right-0 flex items-center">
                      <Tooltip
                        title="View Meter Image"
                        placement="top"
                        arrow
                        slotProps={{
                          popper: {
                            modifiers: [
                              {
                                name: "offset",
                                options: {
                                  offset: [0, -5],
                                },
                              },
                            ],
                          },
                        }}
                      >
                        <PhotoIcon
                          fontSize="small"
                          className="text-black mr-4 lg:mr-2"
                          onClick={() => handleOpenImageModal("Meter")}
                        />
                      </Tooltip>
                    </div>
                  </td>
                </tr>

                {/* ================================ P R I M A R Y  M E T E R (2) ================================ */}
                <tr className="grid grid-cols-1 lg:grid-cols-2 pb-2 lg:pb-0">
                  <td className="py-2 lg:py-4 whitespace-nowrap text-start lg:text-center">
                    <label
                      htmlFor="meter2"
                      className="text-sm font-semibold text-gray-900 p-2 text-wrap"
                    >
                      UMG-801 Primary Meter 2
                    </label>
                  </td>
                  <td className="relative flex items-center px-2 lg:px-0 lg:pb-0">
                    {!meter2Exist && (
                      <input
                        type="text"
                        id="meter2"
                        onChange={handleMeter2Change}
                        //   onKeyDown={handlePanelKeyDown}
                        autoFocus
                        value={meter2Value}
                        className="border w-full px-2 py-2 rounded-md text-black focus:outline-none focus:ring-3 focus:border-gray-600 text-sm lg:mr-1"
                        placeholder="Enter UMG-801 Primary Meter 2"
                      />
                    )}

                    {meter2Exist && (
                      <p className="bg-signature font-medium px-2 rounded-full">
                        {" "}
                        {meter2Exist}
                      </p>
                    )}

                    <div className="absolute inset-y-0 right-0 flex items-center">
                      <Tooltip
                        title="View Meter Image"
                        placement="top"
                        arrow
                        slotProps={{
                          popper: {
                            modifiers: [
                              {
                                name: "offset",
                                options: {
                                  offset: [0, -5],
                                },
                              },
                            ],
                          },
                        }}
                      >
                        <PhotoIcon
                          fontSize="small"
                          className="text-black mr-4 lg:mr-2"
                          onClick={() => handleOpenImageModal("Meter")}
                        />
                      </Tooltip>
                    </div>
                  </td>
                </tr>
                {/* ================================ C A T C H E R  M E T E R  ================================ */}
                <tr className="grid grid-cols-1 lg:grid-cols-2 pb-2 lg:pb-0">
                  <td className="py-2 lg:py-4 whitespace-nowrap text-start lg:text-center">
                    <label
                      htmlFor="catcherMeter"
                      className="text-sm font-semibold text-gray-900 p-2 text-wrap"
                    >
                      UMG-801 Catcher Meter
                    </label>
                  </td>
                  <td className="relative flex items-center px-2 lg:px-0 lg:pb-0">
                    {!catcherMeterExist && (
                      <input
                        type="text"
                        id="catcherMeter"
                        onChange={handleCatcherMeterChange}
                        //   onKeyDown={handlePanelKeyDown}
                        autoFocus
                        value={catcherMeterValue}
                        className="border w-full px-2 py-2 rounded-md text-black focus:outline-none focus:ring-3 focus:border-gray-600 text-sm lg:mr-1"
                        placeholder="Enter UMG-801 Catcher Meter"
                      />
                    )}

                    {catcherMeterExist && (
                      <p className="bg-signature font-medium px-2 rounded-full">
                        {" "}
                        {catcherMeterExist}
                      </p>
                    )}

                    <div className="absolute inset-y-0 right-0 flex items-center">
                      <Tooltip
                        title="View Meter Image"
                        placement="top"
                        arrow
                        slotProps={{
                          popper: {
                            modifiers: [
                              {
                                name: "offset",
                                options: {
                                  offset: [0, -5],
                                },
                              },
                            ],
                          },
                        }}
                      >
                        <PhotoIcon
                          fontSize="small"
                          className="text-black mr-4 lg:mr-2"
                          onClick={() => handleOpenImageModal("Meter")}
                        />
                      </Tooltip>
                    </div>
                  </td>
                </tr>
                {/* ================================ M O D U L 800-CT8-A ================================ */}
                <tr className="grid grid-cols-1 lg:grid-cols-2 pb-2 lg:pb-0">
                  <td className="py-2 lg:py-4 whitespace-nowrap text-start lg:text-center">
                    <label
                      htmlFor="modulCT"
                      className="text-sm font-semibold text-gray-900 p-2 text-wrap"
                    >
                      Modul 800-CT8-A
                    </label>
                  </td>
                  <td className="relative flex items-center px-2 lg:px-0 lg:pb-0">
                    {!modulCTExist && (
                      <input
                        type="text"
                        id="modulCT"
                        onChange={handleModulCTChange}
                        //   onKeyDown={handlePanelKeyDown}
                        autoFocus
                        value={modulCTValue}
                        className="border w-full px-2 py-2 rounded-md text-black focus:outline-none focus:ring-3 focus:border-gray-600 text-sm lg:mr-1"
                        placeholder="Enter Modul 800-CT8-A"
                      />
                    )}

                    {modulCTExist && (
                      <p className="bg-signature font-medium px-2 rounded-full">
                        {" "}
                        {modulCTExist}
                      </p>
                    )}

                    <div className="absolute inset-y-0 right-0 flex items-center">
                      <Tooltip
                        title="View Modul Image"
                        placement="top"
                        arrow
                        slotProps={{
                          popper: {
                            modifiers: [
                              {
                                name: "offset",
                                options: {
                                  offset: [0, -5],
                                },
                              },
                            ],
                          },
                        }}
                      >
                        <PhotoIcon
                          fontSize="small"
                          className="text-black mr-4 lg:mr-2"
                          onClick={() => handleOpenImageModal("ModulCT")}
                        />
                      </Tooltip>
                    </div>
                  </td>
                </tr>
                {/* ================================ M O D U L 800-DI14 (A) ================================ */}
                <tr className="grid grid-cols-1 lg:grid-cols-2 pb-2 lg:pb-0">
                  <td className="py-2 lg:py-4 whitespace-nowrap text-start lg:text-center">
                    <label
                      htmlFor="modulDI(A)"
                      className="text-sm font-semibold text-gray-900 p-2 text-wrap"
                    >
                      Modul 800-DI14 (A)
                    </label>
                  </td>
                  <td className="relative flex items-center px-2 lg:px-0 lg:pb-0">
                    {!modulDI1Exist && (
                      <input
                        type="text"
                        id="modulDI(A)"
                        onChange={handleModulDI1Change}
                        autoFocus
                        value={modulDI1Value}
                        className="border w-full px-2 py-2 rounded-md text-black focus:outline-none focus:ring-3 focus:border-gray-600 text-sm lg:mr-1"
                        placeholder="Enter Modul 800-DI14 (A)"
                      />
                    )}

                    {modulDI1Exist && (
                      <p className="bg-signature font-medium px-2 rounded-full">
                        {modulDI1Exist}
                      </p>
                    )}
                    <div className="absolute inset-y-0 right-0 flex items-center">
                      <Tooltip
                        title="View Modul Image"
                        placement="top"
                        arrow
                        slotProps={{
                          popper: {
                            modifiers: [
                              {
                                name: "offset",
                                options: {
                                  offset: [0, -5],
                                },
                              },
                            ],
                          },
                        }}
                      >
                        <PhotoIcon
                          fontSize="small"
                          className="text-black mr-4 lg:mr-2"
                          onClick={() => handleOpenImageModal("ModulDI")}
                        />
                      </Tooltip>
                    </div>
                  </td>
                </tr>
                {/* ================================ M O D U L 800-DI14 (B) ================================ */}
                <tr className="grid grid-cols-1 lg:grid-cols-2 pb-2 lg:pb-0">
                  <td className="py-2 lg:py-4 whitespace-nowrap text-start lg:text-center">
                    <label
                      htmlFor="modulDI(B)"
                      className="text-sm font-semibold text-gray-900 p-2 text-wrap"
                    >
                      Modul 800-DI14 (B)
                    </label>
                  </td>
                  <td className="relative flex items-center px-2 lg:px-0 lg:pb-0">
                    {!modulDI2Exist && (
                      <input
                        type="text"
                        id="modulDI(B)"
                        onChange={handleModulDI2Change}
                        //   onKeyDown={handlePanelKeyDown}
                        autoFocus
                        value={modulDI2Value}
                        className="border w-full px-2 py-2 rounded-md text-black focus:outline-none focus:ring-3 focus:border-gray-600 text-sm lg:mr-1"
                        placeholder="Enter Modul 800-DI14 (B)"
                      />
                    )}

                    {modulDI2Exist && (
                      <p className="bg-signature font-medium px-2 rounded-full">
                        {modulDI2Exist}
                      </p>
                    )}

                    <div className="absolute inset-y-0 right-0 flex items-center">
                      <Tooltip
                        title="View Modul Image"
                        placement="top"
                        arrow
                        slotProps={{
                          popper: {
                            modifiers: [
                              {
                                name: "offset",
                                options: {
                                  offset: [0, -5],
                                },
                              },
                            ],
                          },
                        }}
                      >
                        <PhotoIcon
                          fontSize="small"
                          className="text-black mr-4 lg:mr-2"
                          onClick={() => handleOpenImageModal("ModulDI")}
                        />
                      </Tooltip>
                    </div>
                  </td>
                </tr>
                {/* ================================ M O X A MB3170 G A T E W A Y ================================ */}
                <tr className="grid grid-cols-1 lg:grid-cols-2 pb-2 lg:pb-0">
                  <td className="py-2 lg:py-4 whitespace-nowrap text-start lg:text-center">
                    <label
                      htmlFor="moxaGateway"
                      className="text-sm font-semibold text-gray-900 p-2 text-wrap"
                    >
                      Moxa MB3170 Gateway
                    </label>
                  </td>
                  <td className="relative flex items-center px-2 lg:px-0 lg:pb-0">
                    {!moxaGatewayExist && (
                      <input
                        type="text"
                        id="moxaGateway"
                        onChange={handleMoxaGatewayChange}
                        //   onKeyDown={handlePanelKeyDown}
                        autoFocus
                        value={moxaGatewayValue}
                        className="border w-full px-2 py-2 rounded-md text-black focus:outline-none focus:ring-3 focus:border-gray-600 text-sm lg:mr-1"
                        placeholder="Enter MOXA MB3170 Gateway"
                      />
                    )}

                    {moxaGatewayExist && (
                      <p className="bg-signature font-medium px-2 rounded-full">
                        {moxaGatewayExist}
                      </p>
                    )}

                    <div className="absolute inset-y-0 right-0 flex items-center">
                      <Tooltip
                        title="View Moxa MB3170 Gateway Image"
                        placement="top"
                        arrow
                        slotProps={{
                          popper: {
                            modifiers: [
                              {
                                name: "offset",
                                options: {
                                  offset: [0, -5],
                                },
                              },
                            ],
                          },
                        }}
                      >
                        <PhotoIcon
                          fontSize="small"
                          className="text-black mr-4 lg:mr-2"
                          onClick={() => handleOpenImageModal("MoxaGateway")}
                        />
                      </Tooltip>
                    </div>
                  </td>
                </tr>
                {/* ================================ S W I T C H  HMI ================================ */}
                <tr className="grid grid-cols-1 lg:grid-cols-2 pb-2 lg:pb-0">
                  <td className="py-2 lg:py-4 whitespace-nowrap text-start lg:text-center">
                    <label
                      htmlFor="switchHMI"
                      className="text-sm font-semibold text-gray-900 text-wrap p-2 text-wrap"
                    >
                      Phoenix Contact Ethernet FL-Switch 1005N (HMI)
                    </label>
                  </td>
                  <td className="relative flex items-center px-2 lg:px-0 lg:pb-0">
                    {!switchHMIExist && (
                      <input
                        type="text"
                        id="switchHMI"
                        onChange={handleSwitchHMIChange}
                        //   onKeyDown={handlePanelKeyDown}
                        autoFocus
                        value={switchHMIValue}
                        className="border w-full px-2 py-2 rounded-md text-black focus:outline-none focus:ring-3 focus:border-gray-600 text-sm lg:mr-1"
                        placeholder="Enter FL-Switch 1005N (HMI)"
                      />
                    )}

                    {switchHMIExist && (
                      <p className="bg-signature font-medium px-2 rounded-full">
                        {switchHMIExist}
                      </p>
                    )}
                    <div className="absolute inset-y-0 right-0 flex items-center">
                      <Tooltip
                        title="View Switch"
                        placement="top"
                        arrow
                        slotProps={{
                          popper: {
                            modifiers: [
                              {
                                name: "offset",
                                options: {
                                  offset: [0, -5],
                                },
                              },
                            ],
                          },
                        }}
                      >
                        <PhotoIcon
                          fontSize="small"
                          className="text-black mr-4 lg:mr-2"
                          onClick={() => handleOpenImageModal("Switch")}
                        />
                      </Tooltip>
                    </div>
                  </td>
                </tr>
                {/* ================================ S W I T C H  NW ================================ */}
                <tr className="grid grid-cols-1 lg:grid-cols-2 pb-2 lg:pb-0">
                  <td className="py-2 lg:py-4 whitespace-nowrap text-start lg:text-center">
                    <label
                      htmlFor="switchNW"
                      className="text-sm font-semibold text-gray-900 text-wrap p-2 text-wrap"
                    >
                      Phoenix Contact Ethernet FL-Switch 1005N (NW)
                    </label>
                  </td>
                  <td className="relative flex items-center px-2 lg:px-0 lg:pb-0">
                    {!switchNWExist && (
                      <input
                        type="text"
                        id="switchNW"
                        onChange={handleSwitchNWChange}
                        //   onKeyDown={handlePanelKeyDown}
                        autoFocus
                        value={switchNWValue}
                        className="border w-full px-2 py-2 rounded-md text-black focus:outline-none focus:ring-3 focus:border-gray-600 text-sm lg:mr-1"
                        placeholder="Enter FL-Switch 1005N (NW)"
                      />
                    )}

                    {switchNWExist && (
                      <p className="bg-signature font-medium px-2 rounded-full">
                        {switchNWExist}
                      </p>
                    )}
                    <div className="absolute inset-y-0 right-0 flex items-center">
                      <Tooltip
                        title="View Switch"
                        placement="top"
                        arrow
                        slotProps={{
                          popper: {
                            modifiers: [
                              {
                                name: "offset",
                                options: {
                                  offset: [0, -5],
                                },
                              },
                            ],
                          },
                        }}
                      >
                        <PhotoIcon
                          fontSize="small"
                          className="text-black mr-4 lg:mr-2"
                          onClick={() => handleOpenImageModal("Switch")}
                        />
                      </Tooltip>
                    </div>
                  </td>
                </tr>
                {/* ================================ M O X A  ioLOGIK ================================ */}
                <tr className="grid grid-cols-1 lg:grid-cols-2 pb-2 lg:pb-0">
                  <td className="py-2 lg:py-4 whitespace-nowrap text-start lg:text-center">
                    <label
                      htmlFor="moxaIoLogik"
                      className="text-sm font-semibold text-gray-900 text-wrap p-2 text-wrap"
                    >
                      MOXA ioLOGIK E1212
                    </label>
                  </td>
                  <td className="relative flex items-center px-2 lg:px-0 lg:pb-0">
                    {!moxaIoLogikExist && (
                      <input
                        type="text"
                        id="moxaIoLogik"
                        onChange={handleMoxaIoLogikChange}
                        //   onKeyDown={handlePanelKeyDown}
                        autoFocus
                        value={moxaIoLogikValue}
                        className="border w-full px-2 py-2 rounded-md text-black focus:outline-none focus:ring-3 focus:border-gray-600 text-sm lg:mr-1"
                        placeholder="Enter Moxa ioLogik E1212"
                      />
                    )}
                    {moxaIoLogikExist && (
                      <p className="bg-signature font-medium px-2 rounded-full">
                        {moxaIoLogikExist}
                      </p>
                    )}
                    <div className="absolute inset-y-0 right-0 flex items-center">
                      <Tooltip
                        title="View Moxa ioLogik"
                        placement="top"
                        arrow
                        slotProps={{
                          popper: {
                            modifiers: [
                              {
                                name: "offset",
                                options: {
                                  offset: [0, -5],
                                },
                              },
                            ],
                          },
                        }}
                      >
                        <PhotoIcon
                          fontSize="small"
                          className="text-black mr-4 lg:mr-2"
                          onClick={() => handleOpenImageModal("MoxaIoLogik")}
                        />
                      </Tooltip>
                    </div>
                  </td>
                </tr>
                {/* ================================ Q U I N T  P S U - P R I M A R Y ================================ */}
                <tr className="grid grid-cols-1 lg:grid-cols-2 pb-2 lg:pb-0">
                  <td className="py-2 lg:py-4 whitespace-nowrap text-start lg:text-center">
                    <label
                      htmlFor="quintPSUPrimary"
                      className="text-sm font-semibold text-gray-900 text-wrap p-2 text-wrap"
                    >
                      QUINT 4-PS/3AC/24DC/5 Power Supply Unit - Primary
                    </label>
                  </td>
                  <td className="relative flex items-center px-2 lg:px-0 lg:pb-0">
                    {!quintPSUPrimaryExist && (
                      <input
                        type="text"
                        id="quintPSUPrimary"
                        onChange={handleQuintPSUPrimaryChange}
                        //   onKeyDown={handlePanelKeyDown}
                        autoFocus
                        value={quintPSUPrimaryValue}
                        className="border w-full px-2 py-2 rounded-md text-black focus:outline-none focus:ring-3 focus:border-gray-600 text-sm lg:mr-1"
                        placeholder="Enter Quint Power Supply Unit - Primary"
                      />
                    )}

                    {quintPSUPrimaryExist && (
                      <p className="bg-signature font-medium px-2 rounded-full">
                        {quintPSUPrimaryExist}
                      </p>
                    )}

                    <div className="absolute inset-y-0 right-0 flex items-center">
                      <Tooltip
                        title="View Quint Power Supply Unit"
                        placement="top"
                        arrow
                        slotProps={{
                          popper: {
                            modifiers: [
                              {
                                name: "offset",
                                options: {
                                  offset: [0, -5],
                                },
                              },
                            ],
                          },
                        }}
                      >
                        <PhotoIcon
                          fontSize="small"
                          className="text-black mr-4 lg:mr-2"
                          onClick={() => handleOpenImageModal("Quint PSU")}
                        />
                      </Tooltip>
                    </div>
                  </td>
                </tr>
                {/* ================================ Q U I N T  P S U - C A T C H E R ================================ */}
                <tr className="grid grid-cols-1 lg:grid-cols-2 pb-2 lg:pb-0">
                  <td className="py-2 lg:py-4 whitespace-nowrap text-start lg:text-center">
                    <label
                      htmlFor="quintPSUCatcher"
                      className="text-sm font-semibold text-gray-900 text-wrap p-2 text-wrap"
                    >
                      QUINT 4-PS/3AC/24DC/5 Power Supply Unit - Catcher
                    </label>
                  </td>
                  <td className="relative flex items-center px-2 lg:px-0 lg:pb-0">
                    {!quintPSUCatcherExist && (
                      <input
                        type="text"
                        id="quintPSUCatcher"
                        onChange={handleQuintPSUCatcherChange}
                        //   onKeyDown={handlePanelKeyDown}
                        autoFocus
                        value={quintPSUCatcherValue}
                        className="border w-full px-2 py-2 rounded-md text-black focus:outline-none focus:ring-3 focus:border-gray-600 text-sm lg:mr-1"
                        placeholder="Enter Quint Power Supply Unit - Catcher"
                      />
                    )}

                    {quintPSUCatcherExist && (
                      <p className="bg-signature font-medium px-2 rounded-full">
                        {quintPSUCatcherExist}
                      </p>
                    )}
                    <div className="absolute inset-y-0 right-0 flex items-center">
                      <Tooltip
                        title="View Quint Power Supply Unit"
                        placement="top"
                        arrow
                        slotProps={{
                          popper: {
                            modifiers: [
                              {
                                name: "offset",
                                options: {
                                  offset: [0, -5],
                                },
                              },
                            ],
                          },
                        }}
                      >
                        <PhotoIcon
                          fontSize="small"
                          className="text-black mr-4 lg:mr-2"
                          onClick={() => handleOpenImageModal("Quint PSU")}
                        />
                      </Tooltip>
                    </div>
                  </td>
                </tr>
                {/* ================================ Q U I N T  C M - P R I M A R Y ================================ */}
                <tr className="grid grid-cols-1 lg:grid-cols-2 pb-2 lg:pb-0">
                  <td className="py-2 lg:py-4 whitespace-nowrap text-start lg:text-center">
                    <label
                      htmlFor="quintCMPrimary"
                      className="text-sm font-semibold text-gray-900 p-2 text-wrap"
                    >
                      QUINT 4-CAP/3AC/24DC/4KJ Capacity Module - Primary
                    </label>
                  </td>
                  <td className="relative flex items-center px-2 lg:px-0 lg:pb-0">
                    {!quintCMPrimaryExist && (
                      <input
                        type="text"
                        id="quintCMPrimary"
                        onChange={handleQuintCMPrimaryChange}
                        //   onKeyDown={handlePanelKeyDown}
                        autoFocus
                        value={quintCMPrimaryValue}
                        className="border w-full px-2 py-2 rounded-md text-black focus:outline-none focus:ring-3 focus:border-gray-600 text-sm lg:mr-1"
                        placeholder="Enter Quint Capacity Module - Primary"
                      />
                    )}
                    {quintCMPrimaryExist && (
                      <p className="bg-signature font-medium px-2 rounded-full">
                        {quintCMPrimaryExist}
                      </p>
                    )}
                    <div className="absolute inset-y-0 right-0 flex items-center">
                      <Tooltip
                        title="View Quint Capacity Module"
                        placement="top"
                        arrow
                        slotProps={{
                          popper: {
                            modifiers: [
                              {
                                name: "offset",
                                options: {
                                  offset: [0, -5],
                                },
                              },
                            ],
                          },
                        }}
                      >
                        <PhotoIcon
                          fontSize="small"
                          className="text-black mr-4 lg:mr-2"
                          onClick={() => handleOpenImageModal("Quint CM")}
                        />
                      </Tooltip>
                    </div>
                  </td>
                </tr>
                {/* ================================ Q U I N T  C M - C A T C H E R ================================ */}
                <tr className="grid grid-cols-1 lg:grid-cols-2 pb-2 lg:pb-0">
                  <td className="py-2 lg:py-4 whitespace-nowrap text-start lg:text-center">
                    <label
                      htmlFor="quintCMCatcher"
                      className="text-sm font-semibold text-wrap text-gray-900 p-2 text-wrap"
                    >
                      QUINT 4-CAP/3AC/24DC/4KJ Capacity Module - Catcher
                    </label>
                  </td>
                  <td className="relative flex items-center px-2 lg:px-0 lg:pb-0">
                    {!quintCMCatcherExist && (
                      <input
                        type="text"
                        id="quintCMCatcher"
                        onChange={handleQuintCMCatcherChange}
                        //   onKeyDown={handlePanelKeyDown}
                        autoFocus
                        value={quintCMCatcherValue}
                        className="border w-full px-2 py-2 rounded-md text-black focus:outline-none focus:ring-3 focus:border-gray-600 text-sm lg:mr-1"
                        placeholder="Enter Quint Capacity Module - Catcher"
                      />
                    )}

                    {quintCMCatcherExist && (
                      <p className="bg-signature font-medium px-2 rounded-full">
                        {quintCMCatcherExist}
                      </p>
                    )}
                    <div className="absolute inset-y-0 right-0 flex items-center">
                      <Tooltip
                        title="View Quint Capacity Module"
                        placement="top"
                        arrow
                        slotProps={{
                          popper: {
                            modifiers: [
                              {
                                name: "offset",
                                options: {
                                  offset: [0, -5],
                                },
                              },
                            ],
                          },
                        }}
                      >
                        <PhotoIcon
                          fontSize="small"
                          className="text-black mr-4 lg:mr-2"
                          onClick={() => handleOpenImageModal("Quint CM")}
                        />
                      </Tooltip>
                    </div>
                  </td>
                </tr>
                {/* ================================ T R I O - D I O D E ================================ */}
                <tr className="grid grid-cols-1 lg:grid-cols-2 pb-2 lg:pb-0">
                  <td className="py-2 lg:py-4 whitespace-nowrap text-start lg:text-center">
                    <label
                      htmlFor="trioDiode"
                      className="text-sm font-semibold text-gray-900 p-2 text-wrap"
                    >
                      Trio-Diode/12-24DC/2X10/1X20 Redundancy Module
                    </label>
                  </td>
                  <td className="relative flex items-center px-2 lg:px-0 lg:pb-0">
                    {!trioDiodeExist && (
                      <input
                        type="text"
                        id="trioDiode"
                        onChange={handleTrioDiodeChange}
                        //   onKeyDown={handlePanelKeyDown}
                        autoFocus
                        value={trioDiodeValue}
                        className="border w-full px-2 py-2 rounded-md text-black focus:outline-none focus:ring-3 focus:border-gray-600 text-sm lg:mr-1"
                        placeholder="Enter Trio Diode"
                      />
                    )}

                    {trioDiodeExist && (
                      <p className="bg-signature font-medium px-2 rounded-full">
                        {" "}
                        {trioDiodeExist}
                      </p>
                    )}
                    <div className="absolute inset-y-0 right-0 flex items-center">
                      <Tooltip
                        title="View Trio Diode"
                        placement="top"
                        arrow
                        slotProps={{
                          popper: {
                            modifiers: [
                              {
                                name: "offset",
                                options: {
                                  offset: [0, -5],
                                },
                              },
                            ],
                          },
                        }}
                      >
                        <PhotoIcon
                          fontSize="small"
                          className="text-black mr-4 lg:mr-2"
                          onClick={() => handleOpenImageModal("Trio Diode")}
                        />
                      </Tooltip>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* ================================ A L L O C A T E   B U T T O N ================================ */}
        {!componentComplete && (
          <div className="flex justify-center">
            <button
              className="p-3 bg-black text-white font-black rounded-md mt-5"
              onClick={handleAllocate}
            >
              <div className="flex items-center">
                {isAllocateLoading && (
                  <CircularProgress
                    color="inherit"
                    style={{
                      width: "20px",
                      height: "20px",
                      marginRight: "8px",
                    }}
                  />
                )}
                {isAllocateLoading
                  ? "Allocating..."
                  : `Allocate Components to ${panelId.panelId}`}
              </div>
            </button>
          </div>
        )}

        <ComponentImageModal
          open={componentImageModalState}
          onClose={() => handleCloseImageModal()}
          type={componentImageModalType}
        />
      </div>
    </div>
  );
};

export default PanelComponentForm;
