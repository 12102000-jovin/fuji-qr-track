import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import moment from "moment";

const Dashboard = () => {
  const { componentSerialNumber } = useParams();
  const [dashboardData, setDashboardData] = useState([]);

  const fetchDashboardComponentData_API = `http://localhost:3001/Dashboard/${componentSerialNumber}/showComponentDashboard`;

  useEffect(() => {
    if (componentSerialNumber) {
      fetchDashboardComponentData();
    }
  }, []);

  const fetchDashboardComponentData = () => {
    axios
      .get(`${fetchDashboardComponentData_API}`)
      .then((response) => {
        setDashboardData(response.data);
        console.log(response.data);
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
                {dashboardData && (
                  <p className="font-semibold">
                    {dashboardData.workOrderId ? (
                      <p>{dashboardData.workOrderId}</p>
                    ) : (
                      <p className="bg-red-500 font-black text-white p-1 pr-2 pl-2 rounded-full text-xs">
                        No Work Order Found
                      </p>
                    )}
                  </p>
                )}
              </div>
              <div className="flex flex-col items-start p-2">
                <p className="text-3xl font-bold mb-1">PDC</p>
                {dashboardData.pdcId ? (
                  <p className="font-semibold"> {dashboardData.pdcId}</p>
                ) : (
                  <p className="bg-red-500 font-black text-white p-1 pr-2 pl-2 rounded-full text-xs">
                    No PDC Found
                  </p>
                )}
              </div>
              <div className="flex flex-col items-start p-2">
                <p className="text-3xl font-bold mb-1">
                  {dashboardData.subAssemblyType}
                </p>
                {dashboardData && dashboardData.panelId && (
                  <p className="font-semibold">{dashboardData.panelId}</p>
                )}

                {dashboardData && dashboardData.loadbankId && (
                  <p className="font-semibold">{dashboardData.loadbankId}</p>
                )}
                {dashboardData && dashboardData.MCCBId && (
                  <p className="font-semibold">{dashboardData.MCCBId}</p>
                )}
              </div>
            </div>
          </div>
          <div>
            <div className="w-full flex flex-col justify-start p-5 bg-signature mt-2 rounded-md">
              <div className="text-2xl text-start font-black text-white">
                Component
              </div>
              <div className="text-start mt-4">
                {dashboardData.component && (
                  <div className="p-5 pl-10 pr-10 bg-white rounded-md m-3">
                    <p className="text-black mb-5">
                      <span className="text-xl font-black m-3">
                        {dashboardData.component.componentType}
                      </span>
                      <div className="flex justify-between items-center">
                        <span className="m-3 bg-green-500 text-white rounded-full pl-2 pr-2">
                          {dashboardData.component.componentSerialNumber}
                          <br />
                        </span>
                        <span className="m-3">
                          {moment(dashboardData.component.allocatedDate).format(
                            "DD MMM YYYY HH:mm:ss"
                          )}
                        </span>
                      </div>
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
