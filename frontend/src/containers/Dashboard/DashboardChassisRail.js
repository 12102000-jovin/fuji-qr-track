import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "animate.css";
import moment from "moment";

const DashboardChassisRail = () => {
  const { chassisId } = useParams();
  const [dashboardData, setDashboardData] = useState([]);

  const fetchDashboardLeftPrimaryChassisRailData_API = `http://localhost:3001/Dashboard/${chassisId}/showLeftPrimaryChassisRailDashboard`;
  const fetchDashboardRightPrimaryChassisRailData_API = `http://localhost:3001/Dashboard/${chassisId}/showRightPrimaryChassisRailDashboard`;
  const fetchDashboardLeftCatcherChassisRailData_API = `http://localhost:3001/Dashboard/${chassisId}/showLeftCatcherChassisRailDashboard`;
  const fetchDashboardRightCatcherChassisRailData_API = `http://localhost:3001/Dashboard/${chassisId}/showRightCatcherChassisRailDashboard`;

  useEffect(() => {
    const isLeftPrimaryChassisRailPattern = /^CHR\d{6}L-P$/.test(chassisId);
    const isRightPrimaryChassisRailPattern = /^CHR\d{6}R-P$/.test(chassisId);
    const isLeftCatcherChassisRailPattern = /^CHR\d{6}L-C$/.test(chassisId);
    const isRightCatcherChassisRailPattern = /^CHR\d{6}R-C$/.test(chassisId);

    if (isLeftPrimaryChassisRailPattern) {
      fetchDashboardLeftPrimaryChassisRailData();
    } else if (isRightPrimaryChassisRailPattern) {
      fetchDashboardRightPrimaryChassisRailData();
    } else if (isLeftCatcherChassisRailPattern) {
      fetchDashboardLeftCatcherChassisRailData();
    } else if (isRightCatcherChassisRailPattern) {
      fetchDashboardRightCatcherChassisRailData();
    }
  }, []);

  const fetchDashboardLeftPrimaryChassisRailData = () => {
    axios
      .get(`${fetchDashboardLeftPrimaryChassisRailData_API}`)
      .then((response) => {
        setDashboardData(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.error("Error fetching Chassis Rail data", error);
      });
  };

  const fetchDashboardRightPrimaryChassisRailData = () => {
    axios
      .get(`${fetchDashboardRightPrimaryChassisRailData_API}`)
      .then((response) => {
        setDashboardData(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.error("Error fetching Chassis Rail data", error);
      });
  };

  const fetchDashboardLeftCatcherChassisRailData = () => {
    axios
      .get(`${fetchDashboardLeftCatcherChassisRailData_API}`)
      .then((response) => {
        setDashboardData(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.error("Error fetching Chassis Rail data", error);
      });
  };

  const fetchDashboardRightCatcherChassisRailData = () => {
    axios
      .get(`${fetchDashboardRightCatcherChassisRailData_API}`)
      .then((response) => {
        setDashboardData(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.error("Error fetching Chassis Rail data", error);
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
                <p className="font-semibold">
                  {dashboardData.workOrderId ? (
                    <p>{dashboardData.workOrderId}</p>
                  ) : (
                    <p className="bg-red-500 font-black text-white p-1 pr-2 pl-2 rounded-full text-xs">
                      No Work Order Found
                    </p>
                  )}
                </p>
              </div>
              <div className="flex flex-col items-start p-2">
                <p className="text-3xl font-bold mb-1">PDC</p>
                <p className="font-semibold text-white rounded-full inline-block">
                  {dashboardData.pdcId ? (
                    <p>{dashboardData.pdcId}</p>
                  ) : (
                    <p className="bg-red-500 font-black text-white p-1 pr-2 pl-2 rounded-full text-xs">
                      No PDC Found
                    </p>
                  )}
                </p>
              </div>
              <div className="flex flex-col items-start p-2">
                <p className="text-3xl font-bold mb-1">Chassis Rail</p>
                <p className="font-semibold text-white rounded-full inline-block">
                  {chassisId}
                </p>
              </div>
            </div>
          </div>
          <div className="w-full flex flex-col justify-start p-5 bg-signature mt-2 rounded-md">
            <div className="text-2xl text-start font-black text-white">
              Components
            </div>
            <div className="text-start mt-4">
              {dashboardData.componentData &&
              dashboardData.componentData.length > 0 ? (
                dashboardData.componentData.map((component, index) => (
                  <div
                    key={index}
                    className="p-5 pl-10 pr-10 bg-white rounded-md m-3"
                  >
                    <p className="text-black mb-5">
                      <span className="text-xl font-black m-3">
                        {component.componentType}
                        <br />
                      </span>
                      <div className="flex justify-between">
                        <span className="m-3">
                          {component.componentSerialNumber}
                          <br />
                        </span>
                        <span className="m-3">
                          {moment(component.allocatedDate).format(
                            "DD MMMM YYYY HH:mm:ss"
                          )}
                        </span>
                      </div>
                    </p>
                  </div>
                ))
              ) : (
                <div className="flex justify-start">
                  <p className="bg-red-500 font-black text-white p-1 pr-2 pl-2 rounded-full text-xs">
                    No Component
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardChassisRail;
