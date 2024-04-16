import React, { useState, useEffect } from "react";
import axios from "axios";

const Home = () => {
  const [workOrderData, setWorkOrderData] = useState([]);
  const [pdcData, setPdcData] = useState([]);
  const [componentData, setComponentData] = useState([]);

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
    window.open(
      `http://localhost:3000/Dashboard/Component/${componentSerialNumber}`
    );
  };

  return (
    <div class="">
      <div class="flex justify-center">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 w-11/12">
          <div class="bg-white rounded-lg shadow-md">
            <h2 class="text-2xl font-semibold text-white bg-signature py-4 px-6 border-b rounded-t-md">
              Work Order
            </h2>
            <div class="p-6">
              <p class="font-bold text-start mb-5 px-2">Recent Work Order</p>
              {workOrderData
                // Sort the array by date in descending order
                .sort((a, b) => b.workOrderId.localeCompare(a.workOrderId))
                // Take the first 10 elements
                .slice(0, 10)
                // Map over the sorted and limited array
                .map((row) => (
                  <div className="flex flex-col ">
                    <a
                      href={row.link}
                      className="flex justify-start inline-block text-gray-600 text-center mb-3 text-blue-800 hover:bg-blue-200 hover:underline transition-all duration-300 rounded px-2 py-1"
                    >
                      {row.workOrderId}
                    </a>
                  </div>
                ))}
              <div className="mt-2 flex justify-start px-2">
                <a href="/workOrder" className="text-blue-800 underline ">
                  {" "}
                  See All Work Order
                </a>
              </div>
            </div>
          </div>
          <div class="bg-white rounded-lg shadow-md">
            <h2 class="text-2xl font-semibold text-white bg-signature py-4 px-6 border-b rounded-t-md">
              PDC
            </h2>
            <div class="p-6">
              <div>
                <p class="font-bold text-start mb-5 px-2">Recent PDC</p>
                {pdcData
                  // Sort the array by date in descending order
                  .sort((a, b) => b.pdcId.localeCompare(a.pdcId))
                  // Take the first 10 elements
                  .slice(0, 10)
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
              </div>
              <div className="mt-2 flex justify-start px-2">
                <a href="/pdc" className="text-blue-800 underline ">
                  {" "}
                  See All PDC
                </a>
              </div>
            </div>
          </div>
          <div class="bg-white rounded-lg shadow-md">
            <h2 class="text-2xl font-semibold text-white bg-signature py-4 px-6 border-b rounded-t-md">
              Sub-Assemblies
            </h2>
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-1 gap-4 p-6">
              <a
                href="/ControlPanel"
                class="border p-4 rounded-md shadow-sm bg-gray-100 hover:bg-blue-100 "
              >
                Control Panel
              </a>
              <a
                href="/LoadbankPrimary"
                class="border p-4 rounded-md shadow-sm bg-gray-100 hover:bg-blue-100 "
              >
                Loadbank (Primary)
              </a>
              <a
                href="/LoadbankCatcher"
                class="border p-4 rounded-md shadow-sm bg-gray-100 hover:bg-blue-100 "
              >
                Loadbank (Catcher)
              </a>
              <a
                href="/MCCBPrimary"
                class="border p-4 rounded-md shadow-sm bg-gray-100 hover:bg-blue-100 "
              >
                MCCB Panel (Primary)
              </a>
              <a
                href="/MCCBCatcher"
                class="border p-4 rounded-md shadow-sm bg-gray-100 hover:bg-blue-100 "
              >
                MCCB Panel (Catcher)
              </a>
              <a
                href="/CTInterfaceLeft"
                class="border p-4 rounded-md shadow-sm bg-gray-100 hover:bg-blue-100 "
              >
                CT Interface (Left)
              </a>{" "}
              <a
                href="/CTInterfaceRight"
                class="border p-4 rounded-md shadow-sm bg-gray-100 hover:bg-blue-100 "
              >
                CT Interface (Right)
              </a>
              <a
                href="/ChassisRailLeftPrimary"
                class="border p-4 rounded-md shadow-sm bg-gray-100 hover:bg-blue-100 "
              >
                Chassis Rail (Left) (Primary)
              </a>
              <a
                href="/ChassisRailRightPrimary"
                class="border p-4 rounded-md shadow-sm bg-gray-100 hover:bg-blue-100 "
              >
                Chassis Rail (Right) (Primary)
              </a>
              <a
                href="/ChassisRailLeftCatcher"
                class="border p-4 rounded-md shadow-sm bg-gray-100 hover:bg-blue-100 "
              >
                Chassis Rail (Left) (Catcher)
              </a>
              <a
                href="/ChassisRailRightCatcher"
                class="border p-4 rounded-md shadow-sm bg-gray-100 hover:bg-blue-100 "
              >
                Chassis Rail (Right) (Catcher)
              </a>
            </div>
          </div>
          <div class="bg-white rounded-lg shadow-md">
            <h2 class="text-2xl font-semibold text-white bg-signature py-4 px-6 border-b rounded-t-md">
              Component
            </h2>
            <div class="p-6">
              <div>
                <p class="font-bold text-start mb-5 px-2">Recent Component</p>
                {componentData
                  // Sort the array by date in descending order
                  .sort((a, b) =>
                    b.componentSerialNumber.localeCompare(
                      a.componentSerialNumber
                    )
                  )
                  // Take the first 10 elements
                  .slice(0, 10)
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
              </div>
              <div className="mt-2 flex justify-start px-2">
                <a href="/components" className="text-blue-800 underline ">
                  {" "}
                  See All Components
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
