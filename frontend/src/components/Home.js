import React, { useState, useEffect } from "react";
import axios from "axios";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";

const Home = () => {
  const [workOrderData, setWorkOrderData] = useState([]);
  const [pdcData, setPdcData] = useState([]);
  const [componentData, setComponentData] = useState([]);

  const [isWorkOrderOpen, setIsWorkOrderOpen] = useState(false);
  const [isPDCOpen, setIsPDCOpen] = useState(false);
  const [isComponentOpen, setIsComponentOpen] = useState(false);

  const toggleWorkOrder = () => {
    setIsWorkOrderOpen(!isWorkOrderOpen);
  };

  const togglePDC = () => {
    setIsPDCOpen(!isPDCOpen);
  };

  const toggleComponent = () => {
    setIsComponentOpen(!isComponentOpen);
  };

  useEffect(() => {
    fetchLatestWorkOrderData();
    fetchLatestPDCData();
    fetchLatestComponentData();
  }, []);

  const fetchLatestWorkOrderData_API =
    "http://localhost:3001/WorkOrder/getAllWorkOrder";

  const fetchLatestPDCData_API = "http://localhost:3001/PDC/getAllPDC";

  const fetchLatestComponentData_API =
    "http://localhost:3001/Component/getAllComponents";

  const fetchLatestWorkOrderData = () => {
    axios
      .get(`${fetchLatestWorkOrderData_API}`)
      .then((response) => {
        setWorkOrderData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  const fetchLatestPDCData = () => {
    axios
      .get(`${fetchLatestPDCData_API}`)
      .then((response) => {
        setPdcData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  const fetchLatestComponentData = () => {
    axios
      .get(`${fetchLatestComponentData_API}`)
      .then((response) => {
        setComponentData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  const handleComponentDashboard = (componentSerialNumber) => {
    const encodedSerialNumber = encodeURIComponent(componentSerialNumber);
    const decodedSerialNumber = decodeURIComponent(componentSerialNumber);
    console.log(encodedSerialNumber);
    console.log(decodedSerialNumber);

    window.open(
      `http://localhost:3000/Dashboard/Component/${encodedSerialNumber}`,
      "_blank"
    );
  };

  return (
    <div>
      <div className="grid grid-cols-1 lg:grid-cols-5">
        <div className="col-span-full md:col-span-3 px-5 md:px-10">
          <div className="bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold bg-signature text-white py-4 px-6 rounded-t-md">
              Sub-Assemblies
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 p-6">
              <a
                href="/ControlPanel"
                className="card-link border px-4 py-12 text-sm text-signature font-black rounded-md shadow-sm bg-gray-100 hover:bg-blue-100"
              >
                <div className="flex flex-col items-center justify-center flex-wrap overflow-auto">
                  <p>Control</p>
                  <p>Panel</p>
                </div>
              </a>
              <a
                href="/LoadbankPrimary"
                className="card-link border px-4 py-12 text-sm text-signature font-black rounded-md shadow-sm bg-gray-100 hover:bg-blue-100"
              >
                <div className="flex flex-col items-center justify-center flex-wrap">
                  Loadbank{" "}
                  <span className="text-xs text-white bg-red-500 py-1 px-2.5 font-black rounded-full ml-1">
                    Primary
                  </span>
                </div>
              </a>
              <a
                href="/LoadbankCatcher"
                className="card-link border px-4 py-12 text-sm text-signature font-black rounded-md shadow-sm bg-gray-100 hover:bg-blue-100"
              >
                <div className="flex flex-col items-center justify-center flex-wrap">
                  Loadbank{" "}
                  <span className="text-xs text-white bg-red-500 py-1 px-2.5 font-black rounded-full ml-1">
                    Catcher
                  </span>
                </div>
              </a>
              <a
                href="/MCCBPrimary"
                className="card-link border px-4 py-12 text-sm text-signature font-black rounded-md shadow-sm bg-gray-100 hover:bg-blue-100"
              >
                <div className="flex flex-col items-center justify-center flex-wrap">
                  MCCB Panel{" "}
                  <span className="text-xs text-white bg-red-500 py-1 px-2.5 font-black rounded-full ml-1">
                    Primary
                  </span>
                </div>
              </a>
              <a
                href="/MCCBCatcher"
                className="card-link border px-4 py-12 text-sm text-signature font-black rounded-md shadow-sm bg-gray-100 hover:bg-blue-100"
              >
                <div className="flex flex-col items-center justify-center flex-wrap">
                  MCCB Panel{" "}
                  <span className="text-xs text-white bg-red-500 py-1 px-2.5 font-black rounded-full ml-1">
                    Catcher
                  </span>
                </div>
              </a>
              <a
                href="/CTInterfaceLeft"
                className="card-link border px-4 py-12 text-sm text-signature font-black rounded-md shadow-sm bg-gray-100 hover:bg-blue-100"
              >
                <div className="flex flex-col items-center justify-center flex-wrap">
                  CT Interface{" "}
                  <div>
                    <span className="text-xs text-white bg-red-500 py-1 px-2.5 font-black rounded-full ml-1">
                      Primary
                    </span>
                    <span className="text-xs text-white bg-blue-400 py-1 px-2.5 font-black rounded-full ml-1">
                      L
                    </span>
                  </div>
                </div>
              </a>
              <a
                href="/CTInterfaceRight"
                className="card-link border px-4 py-12 text-sm text-signature font-black rounded-md shadow-sm bg-gray-100 hover:bg-blue-100"
              >
                <div className="flex flex-col items-center justify-center flex-wrap">
                  CT Interface{" "}
                  <div>
                    <span className="text-xs text-white bg-red-500 py-1 px-2.5 font-black rounded-full ml-1">
                      Primary
                    </span>
                    <span className="text-xs text-white bg-blue-400 py-1 px-2.5 font-black rounded-full ml-1">
                      R
                    </span>
                  </div>
                </div>
              </a>
              <a
                href="/ChassisRailLeftPrimary"
                className="card-link border px-4 py-12 text-sm text-signature font-black rounded-md shadow-sm bg-gray-100 hover:bg-blue-100"
              >
                <div className="flex flex-col items-center justify-center flex-wrap">
                  Chassis Rail
                  <div>
                    <span className="text-xs text-white bg-red-500 py-1 px-2.5 font-black rounded-full ml-1">
                      Primary
                    </span>
                    <span className="text-xs text-white bg-blue-400 py-1 px-2.5 font-black rounded-full ml-1">
                      L
                    </span>
                  </div>
                </div>
              </a>
              <a
                href="/ChassisRailRightPrimary"
                className="card-link border px-4 py-12 text-sm text-signature font-black rounded-md shadow-sm bg-gray-100 hover:bg-blue-100"
              >
                <div className="flex flex-col items-center justify-center flex-wrap">
                  Chassis Rail
                  <div>
                    <span className="text-xs text-white bg-red-500 py-1 px-2.5 font-black rounded-full ml-1">
                      Primary
                    </span>
                    <span className="text-xs text-white bg-blue-400 py-1 px-2.5 font-black rounded-full ml-1">
                      R
                    </span>
                  </div>
                </div>
              </a>
              <a
                href="/ChassisRailLeftCatcher"
                className="card-link border px-4 py-12 text-sm text-signature font-black rounded-md shadow-sm bg-gray-100 hover:bg-blue-100"
              >
                <div className="flex flex-col items-center justify-center flex-wrap">
                  Chassis Rail
                  <div>
                    <span className="text-xs text-white bg-red-500 py-1 px-2.5 font-black rounded-full ml-1">
                      Catcher
                    </span>
                    <span className="text-xs text-white bg-blue-400 py-1 px-2.5 font-black rounded-full ml-1">
                      L
                    </span>
                  </div>
                </div>
              </a>
              <a
                href="/ChassisRailRightCatcher"
                className="card-link border px-4 py-12 text-sm text-signature font-black rounded-md shadow-sm bg-gray-100 hover:bg-blue-100"
              >
                <div className="flex flex-col items-center justify-center flex-wrap">
                  Chassis Rail
                  <div>
                    <span className="text-xs text-white bg-red-500 py-1 px-2.5 font-black rounded-full ml-1">
                      Catcher
                    </span>
                    <span className="text-xs text-white bg-blue-400 py-1 px-2.5 font-black rounded-full ml-1">
                      R
                    </span>
                  </div>
                </div>
              </a>
              <a
                href="/RoofPrimary"
                className="card-link border px-4 py-12 text-sm text-signature font-black rounded-md shadow-sm bg-gray-100 hover:bg-blue-100"
              >
                <div className="flex flex-col items-center justify-center flex-wrap">
                  Roof{" "}
                  <span className="text-xs text-white bg-red-500 py-1 px-2.5 font-black rounded-full ml-1">
                    Primary
                  </span>
                </div>
              </a>
              <a
                href="/RoofCatcher"
                className="card-link border px-4 py-12 text-sm text-signature font-black rounded-md shadow-sm bg-gray-100 hover:bg-blue-100"
              >
                <div className="flex flex-col items-center justify-center flex-wrap">
                  Roof{" "}
                  <span className="text-xs text-white bg-red-500 py-1 px-2.5 font-black rounded-full ml-1">
                    Catcher
                  </span>
                </div>
              </a>
            </div>
          </div>
        </div>
        <div className="col-span-full md:col-span-2 px-5 md:px-10 mt-5 lg:mt-0">
          <div>
            <div className="p-5 bg-white rounded-md">
              <p className="text-2xl text-signature font-black mb-2">
                {" "}
                Allocate
              </p>
              <div className="flex flex-grow" style={{ overflowY: "auto" }}>
                <a
                  href="/Allocate"
                  className="card-link border px-4 py-4 text-sm text-white font-black rounded-md shadow-sm bg-black flex-grow mr-1 hover:bg-gray-800"
                >
                  <div className="flex items-center justify-center flex-wrap">
                    Allocate Sub-Assembly
                  </div>
                </a>

                <a
                  href="/AllocateComponents"
                  className="card-link border px-4 py-4 text-sm text-white font-black rounded-md shadow-sm bg-black flex-grow ml-1 hover:bg-gray-800"
                >
                  <div className="flex items-center justify-center flex-wrap">
                    Allocate Component
                  </div>
                </a>
              </div>
            </div>
          </div>
          <div
            className="bg-white rounded-lg shadow-md mt-10 hover:cursor-pointer"
            style={{ overflowY: "auto" }}
          >
            <h2
              className="font-semibold text-white bg-signature py-4 px-6 border-b rounded-t-md"
              onClick={() => toggleWorkOrder()}
            >
              Recent Work Order
              {isWorkOrderOpen ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
            </h2>{" "}
            {isWorkOrderOpen && (
              <div className="p-6">
                {workOrderData
                  .sort((a, b) => b.workOrderId.localeCompare(a.workOrderId))
                  .slice(0, 5)
                  .map((row) => (
                    <div className="flex flex-col" key={row.workOrderId}>
                      <a
                        href={row.link}
                        className="flex justify-start inline-block text-gray-600 text-center mb-3 text-blue-800 hover:bg-blue-200 hover:underline transition-all duration-300 rounded px-2 py-1"
                      >
                        {row.workOrderId}
                      </a>
                    </div>
                  ))}
                <div className="mt-2 flex justify-start px-2">
                  <a href="/workOrder" className="text-blue-800 underline">
                    See All Work Order
                  </a>
                </div>
              </div>
            )}
          </div>
          <div
            className="bg-white rounded-lg shadow-md mt-5 hover:cursor-pointer"
            style={{ overflowY: "auto" }}
          >
            <h2
              className="font-semibold text-white bg-signature py-4 px-6 border-b rounded-t-md"
              onClick={() => togglePDC()}
            >
              Recent PDC
              {isPDCOpen ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
            </h2>{" "}
            {isPDCOpen && (
              <div className="p-6">
                {pdcData
                  // Sort the array by date in descending order
                  .sort((a, b) => b.pdcId.localeCompare(a.pdcId))
                  // Take the first 10 elements
                  .slice(0, 5)
                  // Map over the sorted and limited array
                  .map((row) => (
                    <div className="flex flex-col ">
                      <a
                        href={row.link}
                        className="flex justify-start inline-block text-gray-600 text-center mb-3 text-blue-800 hover:bg-blue-200 hover:underline transition-all duration-300 rounded px-2 py-1"
                      >
                        {row.pdcId}
                      </a>
                    </div>
                  ))}
                <div className="mt-2 flex justify-start px-2">
                  <a href="/pdc" className="text-blue-800 underline ">
                    {" "}
                    See All PDC
                  </a>
                </div>
              </div>
            )}
          </div>
          <div
            className="bg-white rounded-lg shadow-md mt-5 mb-10 hover:cursor-pointer"
            style={{ overflowY: "auto" }}
          >
            <h2
              className="font-semibold text-white bg-signature py-4 px-6 border-b rounded-t-md"
              onClick={() => toggleComponent()}
            >
              Recent Component
              {isComponentOpen ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
            </h2>{" "}
            {isComponentOpen && (
              <div className="p-6">
                {componentData
                  // Sort the array by date in descending order
                  .sort((a, b) =>
                    b.componentSerialNumber.localeCompare(
                      a.componentSerialNumber
                    )
                  )
                  // Take the first 10 elements
                  .slice(0, 5)
                  // Map over the sorted and limited array
                  .map((row) => (
                    <div className="flex flex-col ">
                      <a
                        onClick={() => {
                          handleComponentDashboard(row.componentSerialNumber);
                        }}
                        className="flex justify-start inline-block text-gray-600 text-center mb-3 text-blue-800 hover:bg-blue-200 hover:underline transition-all duration-300 rounded px-2 py-1"
                      >
                        {row.componentSerialNumber}
                      </a>
                    </div>
                  ))}
                <div className="mt-2 flex justify-start px-2">
                  <a href="/components" className="text-blue-800 underline ">
                    {" "}
                    See All Components
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
