import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "animate.css";
import moment from "moment";

const Dashboard = () => {
  const { pdcId } = useParams();
  const [dashboardData, setDashboardData] = useState([]);
  const [dashboardType, setDashboardType] = useState("");

  const fetchDashboardPDCData_API = `http://localhost:3001/Dashboard/${pdcId}/showPDCDashboard`;

  useEffect(() => {
    if (pdcId) {
      fetchDashboardPDCData();
      setDashboardType("PDC");
    }
  }, []);

  const fetchDashboardPDCData = () => {
    axios
      .get(`${fetchDashboardPDCData_API}`)
      .then((response) => {
        setDashboardData(response.data);
        // console.log(response.data);
      })
      .catch((error) => {
        console.error("Error fetching PDC data:", error);
      });
  };

  return (
    <div>
      <div className="flex justify-center bg-background border-none">
        <div className="w-3/4 p-6 shadow-lg bg-white rounded-md my-5">
          <p className="text-4xl text-signature font-black mb-5 mt-3">
            Dashboard
          </p>
          <div className="p-5 bg-black rounded-md">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 text-white">
              <div className="flex flex-col items-start p-2">
                <p className="text-3xl font-bold mb-1 ">WorkOrder</p>
                {dashboardType === "PDC" && (
                  <p className="font-semibold">{dashboardData.workOrderId}</p>
                )}
              </div>
              <div className="flex flex-col items-start p-2">
                <p className="text-3xl font-bold mb-1 ">PDC</p>
                {dashboardType === "PDC" ? (
                  <p className="font-semibold text-white rounded-full inline-block">
                    {pdcId}
                  </p>
                ) : (
                  <p className="font-semibold">{pdcId}</p>
                )}
              </div>
            </div>
          </div>
          <div className="w-full flex flex-col justify-start p-5 bg-signature mt-2 rounded-md">
            <div className="text-2xl text-start font-black text-white">
              Sub-Assembly
            </div>
            <div className="flex justify-center flex-wrap">
              <div className="text-start mt-4 p-2">
                <div className="w-fit p-5 pl-10 pr-10 bg-white rounded-md ">
                  <p className="text-black font-black text-2xl mb-2">Panel</p>

                  {dashboardType === "PDC" ? (
                    dashboardData &&
                    dashboardData.panels &&
                    dashboardData.panels.length > 0 ? (
                      dashboardData.panels.map((panel) => (
                        <div
                          key={panel._id}
                          className="flex justify-start items-center space-x-4"
                        >
                          <div className="font-normal">
                            <button
                              onClick={() => window.open(panel.link, "_blank")}
                              className="text-blue-500 hover:underline focus:outline-none"
                            >
                              {panel.panelId}
                            </button>
                          </div>
                          <div className="text-gray-500">
                            {moment(panel.allocatedDate).format("DD MMM YYYY")}
                          </div>
                        </div>
                      ))
                    ) : (
                      <span className="bg-red-500 text-white p-1 pl-2 pr-2 font-black rounded-full text-xs inline-block">
                        No panels found
                      </span>
                    )
                  ) : (
                    <span className="text-white p-1 rounded-full text-xs inline-block ">
                      none
                    </span>
                  )}
                </div>
              </div>
              <div className="text-start mt-4 p-2">
                <div className="w-fit p-5 pl-10 pr-10 bg-white rounded-md ">
                  <p className="text-black font-black text-2xl mb-2">Example</p>

                  {dashboardType === "PDC" ? (
                    dashboardData &&
                    dashboardData.panels &&
                    dashboardData.panels.length > 0 ? (
                      dashboardData.panels.map((panel) => (
                        <div
                          key={panel._id}
                          className="flex justify-start items-center space-x-4"
                        >
                          <div className="font-normal">
                            <button
                              onClick={() => window.open(panel.link, "_blank")}
                              className="text-blue-500 hover:underline focus:outline-none"
                            >
                              {panel.panelId}
                            </button>
                          </div>
                          <div className="text-gray-500">
                            {moment(panel.allocatedDate).format("DD MMM YYYY")}
                          </div>
                        </div>
                      ))
                    ) : (
                      <span className="bg-red-500 text-white p-1 pl-2 pr-2 font-black rounded-full text-xs inline-block">
                        No panels found
                      </span>
                    )
                  ) : (
                    <span className="text-white p-1 rounded-full text-xs inline-block ">
                      none
                    </span>
                  )}
                </div>
              </div>
              <div className="text-start mt-4 p-2">
                <div className="w-fit p-5 pl-10 pr-10 bg-white rounded-md ">
                  <p className="text-black font-black text-2xl mb-2">Example</p>

                  {dashboardType === "PDC" ? (
                    dashboardData &&
                    dashboardData.panels &&
                    dashboardData.panels.length > 0 ? (
                      dashboardData.panels.map((panel) => (
                        <div
                          key={panel._id}
                          className="flex justify-start items-center space-x-4"
                        >
                          <div className="font-normal">
                            <button
                              onClick={() => window.open(panel.link, "_blank")}
                              className="text-blue-500 hover:underline focus:outline-none"
                            >
                              {panel.panelId}
                            </button>
                          </div>
                          <div className="text-gray-500">
                            {moment(panel.allocatedDate).format("DD MMM YYYY")}
                          </div>
                        </div>
                      ))
                    ) : (
                      <span className="bg-red-500 text-white p-1 pl-2 pr-2 font-black rounded-full text-xs inline-block">
                        No panels found
                      </span>
                    )
                  ) : (
                    <span className="text-white p-1 rounded-full text-xs inline-block ">
                      none
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
