import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "animate.css";
import moment from "moment";

const Dashboard = () => {
  const { workOrderId } = useParams();
  const [dashboardData, setDashboardData] = useState([]);
  const [dashboardType, setDashboardType] = useState("");

  const fetchDashboardWorkOrderData_API = `http://localhost:3001/Dashboard/${workOrderId}/showWorkOrderDashboard`;

  useEffect(() => {
    if (workOrderId) {
      fetchDashboardWorkOrderData();
      setDashboardType("WorkOrder");
    }
  }, []);

  const fetchDashboardWorkOrderData = () => {
    axios
      .get(`${fetchDashboardWorkOrderData_API}`)
      .then((response) => {
        setDashboardData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching Work Order data:", error);
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
            <div className="grid grid-cols-2 gap-x-4 text-white">
              <div className="flex flex-col items-start p-2">
                <p className="text-3xl font-bold mb-1 ">WorkOrder</p>
                {dashboardType === "WorkOrder" ? (
                  <p className="font-semibold">{workOrderId}</p>
                ) : (
                  <p className="font-semibold">{dashboardData.pdcId}</p>
                )}
              </div>
            </div>
          </div>
          <div className="p-5 bg-signature rounded-md mt-2 text-white">
            <div className="text-start">
              <p className="text-3xl font-bold mb-4">PDC</p>
            </div>

            {dashboardType === "WorkOrder" && dashboardData.length > 0 ? (
              <div className="flex flex-wrap justify-center items-center w-full">
                {dashboardData.map((workOrder) => (
                  <div className="bg-white m-3 rounded-md p-8 w-6/7  md:w-8/9 lg:w-96">
                    <div className=" flex text-black font-black ">
                      <button
                        onClick={() => window.open(workOrder.link, "_blank")}
                        className="text-blue-500 text-xl hover:underline focus:outline-none mb-5"
                      >
                        <span className="flex justify-center items-center">
                          {workOrder.pdcId}
                        </span>
                      </button>
                    </div>
                    <p className="text-black flex flex-col">
                      <p className="text-xs text-start">Allocated Date</p>
                      <p className="text-xs text-start font-bold">
                        {moment(workOrder.allocatedDate).format(
                          "DD MMM YYYY HH:mm:ss"
                        )}
                      </p>
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex justify-start">
                <p className="bg-red-500 font-black  p-1 pr-2 pl-2 rounded-full text-xs">
                  No PDC Found
                </p>
              </div>
            )}
          </div>

          {/* <div className="w-full flex flex-col justify-start p-5 bg-signature mt-2 rounded-md">
            <div className="text-2xl text-start font-black text-white">
              Sub-Assembly
            </div>
            <div className="text-start mt-4">
              <div className="w-fit p-5 pl-10 pr-10 bg-white rounded-md ">
                <p className="text-black font-black text-2xl mb-5">Panel</p>
              </div>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
