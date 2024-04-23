import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "animate.css";
import moment from "moment";

import {
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
} from "@mui/material";

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
                {dashboardType === "Panel" && dashboardData.workOrderId ? (
                  <p className="font-semibold">{dashboardData.workOrderId}</p>
                ) : (
                  <p className="bg-red-500 font-black text-white p-1 pr-2 pl-2 rounded-full text-xs">
                    No WorkOrder Found
                  </p>
                )}
              </div>
              <div className="flex flex-col items-start p-2">
                <p className="text-3xl font-bold mb-1">PDC</p>
                {dashboardType === "Panel" && dashboardData.pdcId ? (
                  <p className="font-semibold text-white rounded-full inline-block">
                    {dashboardData.pdcId}
                  </p>
                ) : (
                  <p className="bg-red-500 font-black text-white p-1 pr-2 pl-2 rounded-full text-xs">
                    {" "}
                    No PDC Found
                  </p>
                )}
              </div>
              <div className="flex flex-col items-start p-2">
                <p className="text-3xl font-bold mb-1">Control Panel</p>
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

            <TableContainer component={Paper} className="rounded-md mt-5">
              <Table>
                <TableHead className="bg-black">
                  <TableRow>
                    <TableCell
                      style={{
                        fontWeight: "bold",
                        fontSize: "1.10rem",
                        color: "white",
                      }}
                    >
                      Component Serial Number
                    </TableCell>
                    <TableCell
                      style={{
                        fontWeight: "bold",
                        fontSize: "1.10rem",
                        color: "white",
                      }}
                    >
                      Component Type
                    </TableCell>
                    <TableCell
                      style={{
                        fontWeight: "bold",
                        fontSize: "1.10rem",
                        color: "white",
                      }}
                    >
                      Stock Code
                    </TableCell>
                    <TableCell
                      style={{
                        fontWeight: "bold",
                        fontSize: "1.10rem",
                        color: "white",
                      }}
                    >
                      Allocated Date
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {dashboardData.componentData &&
                  dashboardData.componentData.length > 0 ? (
                    dashboardData.componentData.map((component, index) => (
                      <TableRow
                        key={index}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                        className="hover:bg-gray-100"
                      >
                        <TableCell>{component.componentSerialNumber}</TableCell>
                        <TableCell>{component.componentType}</TableCell>
                        <TableCell>{component.componentDescription}</TableCell>
                        <TableCell>
                          {moment(component.allocatedDate).format(
                            "DD MMMM YYYY HH:mm:ss"
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} align="center">
                        No Component
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            {/* <div className="mt-4">
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
                          {component.componentDescription}
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
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};
export default Dashboard;
