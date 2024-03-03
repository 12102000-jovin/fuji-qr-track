import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "animate.css";
import moment from "moment";

const Dashboard = () => {
  const { panelId } = useParams();
  const [dashboardData, setDashboardData] = useState([]);
  const [dashboardType, setDashboardType] = useState("");

  const fetchDashboardPanelData_API = `http://localhost:3001/Dashboard/${panelId}/showPanelDashboard`;

  useEffect(() => {
    if (panelId) {
      fetchDashboardPanelData();
      setDashboardType("Panel");
    }
  }, []);

  const fetchDashboardPanelData = () => {
    axios
      .get(`${fetchDashboardPanelData_API}`)
      .then((response) => {
        setDashboardData(response.data);
        // console.log(response.data);
      })
      .catch((error) => {
        console.error("Error fetching Panel data:", error);
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-4 text-white">
              <div className="flex flex-col items-start p-2">
                <p className="text-3xl font-bold mb-1">WorkOrder</p>
                {dashboardType === "Panel" && (
                  <p className="font-semibold">{dashboardData.workOrderId}</p>
                )}
              </div>
              <div className="flex flex-col items-start p-2">
                <p className="text-3xl font-bold mb-1">PDC</p>
                {dashboardType === "Panel" && (
                  <p className="font-semibold text-white rounded-full inline-block">
                    {dashboardData.pdcId}
                  </p>
                )}
              </div>
              <div className="flex flex-col items-start p-2">
                <p className="text-3xl font-bold mb-1">Panel</p>
                {dashboardType === "Panel" && (
                  <p className="font-semibold text-white rounded-full inline-block">
                    {panelId}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="w-full flex flex-col justify-start p-5 bg-signature mt-2 rounded-md">
            <div className="text-2xl text-start font-black text-white">
              Components
            </div>
            <div className="text-start mt-4">
              <div className="w-fit p-5 pl-10 pr-10 bg-white rounded-md ">
                <p className="text-black font-black text-2xl mb-5">
                  Components will be here
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
