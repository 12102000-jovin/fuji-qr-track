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
                  <p className="font-semibold">
                    {dashboardData.workOrderId ? (
                      <p> {dashboardData.workOrderId}</p>
                    ) : (
                      <p className="bg-red-500 font-black text-white p-1 pr-2 pl-2 rounded-full text-xs">
                        No Work Order Found
                      </p>
                    )}
                  </p>
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
              {/* ======================= P A N E L ======================= */}
              <div className="text-start mt-4 p-2 w-full md:w-1/2">
                <div className="w-full p-5 bg-white rounded-md min-h-40">
                  <p className="text-black font-black text-2xl mb-2">
                    Control Panel
                  </p>
                  {dashboardType === "PDC" ? (
                    dashboardData &&
                    dashboardData.panels &&
                    dashboardData.panels.length > 0 ? (
                      dashboardData.panels.map((panel) => (
                        <div key={panel._id} className="flex flex-col ">
                          <div className="font-normal">
                            <button
                              onClick={() => window.open(panel.link, "_blank")}
                              className="text-blue-500 font-bold hover:underline focus:outline-none"
                            >
                              {panel.panelId}
                            </button>
                          </div>
                          <p className="text-black flex flex-col mt-5">
                            <p className="text-xs text-start">Allocated Date</p>
                            <p className="text-xs text-start font-bold">
                              {moment(panel.allocatedDate).format(
                                "DD MMM YYYY HH:mm:ss"
                              )}
                            </p>
                          </p>
                        </div>
                      ))
                    ) : (
                      <div className="flex item-center">
                        <p className="text-sm font-black rounded-md text-gray-400">
                          No Panel Found
                        </p>
                      </div>
                    )
                  ) : (
                    <span className="text-white p-1 rounded-full text-xs inline-block ">
                      none
                    </span>
                  )}
                </div>
              </div>
              {/* ======================= L O A D B A N K ( P R I M A R Y )======================= */}
              <div className="text-start mt-4 p-2 w-full md:w-1/2">
                <div className="w-full p-5 bg-white rounded-md min-h-40">
                  <p className="text-black font-black text-2xl mb-2 flex items-center">
                    Loadbank{" "}
                    <span className="text-xs text-white bg-red-500 py-1 px-2.5 font-black rounded-full ml-1">
                      Primary
                    </span>
                  </p>
                  {dashboardType === "PDC" ? (
                    dashboardData &&
                    dashboardData.loadbanks &&
                    dashboardData.loadbanks.length > 0 ? (
                      dashboardData.loadbanks.map((loadbank) => (
                        <div key={loadbank._id} className="flex flex-col">
                          <div className="font-normal">
                            <button
                              onClick={() =>
                                window.open(loadbank.link, "_blank")
                              }
                              className="text-blue-500 font-bold hover:underline focus:outline-none"
                            >
                              {loadbank.loadbankId}
                            </button>
                          </div>
                          <p className="text-black flex flex-col mt-6">
                            <p className="text-xs text-start">Allocated Date</p>
                            <p className="text-xs text-start font-bold">
                              {moment(loadbank.allocatedDate).format(
                                "DD MMM YYYY HH:mm:ss"
                              )}
                            </p>
                          </p>
                        </div>
                      ))
                    ) : (
                      <div className="flex item-center">
                        <p className="text-sm font-black rounded-md text-gray-400">
                          No Loadbank (Primary) Found
                        </p>
                      </div>
                    )
                  ) : (
                    <span className="text-white p-1 rounded-full text-xs inline-block ">
                      none
                    </span>
                  )}
                </div>
              </div>
              {/* ======================= L O A D B A N K ( C A T C H E R ) ======================= */}
              <div className="text-start mt-4 p-2 w-full md:w-1/2">
                <div className="w-full p-5 bg-white rounded-md min-h-40">
                  <p className="text-black font-black text-2xl mb-2 flex items-center">
                    Loadbank{" "}
                    <span className="text-xs text-white bg-red-500 py-1 px-2.5 font-black rounded-full ml-1">
                      Catcher
                    </span>
                  </p>
                  {dashboardType === "PDC" ? (
                    dashboardData &&
                    dashboardData.catcherLoadbanks &&
                    dashboardData.catcherLoadbanks.length > 0 ? (
                      dashboardData.catcherLoadbanks.map((loadbank) => (
                        <div key={loadbank._id} className="flex flex-col">
                          <div className="font-normal">
                            <button
                              onClick={() =>
                                window.open(loadbank.link, "_blank")
                              }
                              className="text-blue-500 font-bold hover:underline focus:outline-none"
                            >
                              {loadbank.loadbankId}
                            </button>
                          </div>
                          <p className="text-black flex flex-col mt-6">
                            <p className="text-xs text-start">Allocated Date</p>
                            <p className="text-xs text-start font-bold">
                              {moment(loadbank.allocatedDate).format(
                                "DD MMM YYYY HH:mm:ss"
                              )}
                            </p>
                          </p>
                        </div>
                      ))
                    ) : (
                      <div className="flex item-center">
                        <p className="text-sm font-black rounded-md text-gray-400">
                          No Loadbank (Catcher) Found
                        </p>
                      </div>
                    )
                  ) : (
                    <span className="text-white p-1 rounded-full text-xs inline-block ">
                      none
                    </span>
                  )}
                </div>
              </div>
              {/* ======================= M C B B ( P R I M A R Y ) ======================= */}
              <div className="text-start mt-4 p-2 w-full md:w-1/2">
                <div className="w-full p-5 bg-white rounded-md min-h-40">
                  <p className="text-black font-black text-2xl mb-2 flex items-center">
                    MCCB{" "}
                    <span className="text-xs text-white bg-red-500 py-1 px-2.5 font-black rounded-full ml-1">
                      Primary
                    </span>
                  </p>
                  {dashboardType === "PDC" ? (
                    dashboardData &&
                    dashboardData.primaryMCCBs &&
                    dashboardData.primaryMCCBs.length > 0 ? (
                      dashboardData.primaryMCCBs.map((MCCB) => (
                        <div key={MCCB._id} className="flex flex-col">
                          <div className="font-normal">
                            <button
                              onClick={() => window.open(MCCB.link, "_blank")}
                              className="text-blue-500 font-bold hover:underline focus:outline-none"
                            >
                              {MCCB.MCCBId}
                            </button>
                          </div>
                          <p className="text-black flex flex-col mt-6">
                            <p className="text-xs text-start">Allocated Date</p>
                            <p className="text-xs text-start font-bold">
                              {moment(MCCB.allocatedDate).format(
                                "DD MMM YYYY HH:mm:ss"
                              )}
                            </p>
                          </p>
                        </div>
                      ))
                    ) : (
                      <div className="flex item-center">
                        <p className="text-sm font-black rounded-md text-gray-400">
                          No MCCB Panel Found
                        </p>
                      </div>
                    )
                  ) : (
                    <span className=" p-1 rounded-full text-xs inline-block text-black">
                      none
                    </span>
                  )}
                </div>
              </div>

              {/* ======================= M C B B ( C A T C H E R  ) ======================= */}
              <div className="text-start mt-4 p-2 w-full md:w-1/2">
                <div className="w-full p-5 bg-white rounded-md min-h-40">
                  <p className="text-black font-black text-2xl mb-2 flex items-center">
                    MCCB{" "}
                    <span className="text-xs text-white bg-red-500 py-1 px-2.5 font-black rounded-full ml-1">
                      Catcher
                    </span>
                  </p>
                  {dashboardType === "PDC" ? (
                    dashboardData &&
                    dashboardData.catcherMCCBs &&
                    dashboardData.catcherMCCBs.length > 0 ? (
                      dashboardData.catcherMCCBs.map((MCCB) => (
                        <div key={MCCB._id} className="flex flex-col">
                          <div className="font-normal">
                            <button
                              onClick={() => window.open(MCCB.link, "_blank")}
                              className="text-blue-500 font-bold hover:underline focus:outline-none"
                            >
                              {MCCB.MCCBId}
                            </button>
                          </div>
                          <p className="text-black flex flex-col mt-6">
                            <p className="text-xs text-start">Allocated Date</p>
                            <p className="text-xs text-start font-bold">
                              {moment(MCCB.allocatedDate).format(
                                "DD MMM YYYY HH:mm:ss"
                              )}
                            </p>
                          </p>
                        </div>
                      ))
                    ) : (
                      <div className="flex item-center">
                        <p className="text-sm font-black rounded-md text-gray-400">
                          No MCCB Panel Found
                        </p>
                      </div>
                    )
                  ) : (
                    <span className=" p-1 rounded-full text-xs inline-block text-black">
                      none
                    </span>
                  )}
                </div>
              </div>

              {/* ======================= C T I N T E R F A C E ( L E F T ) ======================= */}
              <div className="text-start mt-4 p-2 w-full md:w-1/2">
                <div className="w-full p-5 bg-white rounded-md min-h-40">
                  <p className="text-black font-black text-2xl mb-2 flex items-center">
                    CT Interface{" "}
                    <span className="text-xs text-white bg-blue-400 py-1 px-2.5 font-black rounded-full ml-1">
                      Left
                    </span>
                  </p>
                  {dashboardType === "PDC" ? (
                    dashboardData &&
                    dashboardData.leftCTInterfaces &&
                    dashboardData.leftCTInterfaces.length > 0 ? (
                      dashboardData.leftCTInterfaces.map((CTInterface) => (
                        <div key={CTInterface._id} className="flex flex-col">
                          <div className="font-normal">
                            <button
                              onClick={() =>
                                window.open(CTInterface.link, "_blank")
                              }
                              className="text-blue-500 font-bold hover:underline focus:outline-none"
                            >
                              {CTInterface.CTId}
                            </button>
                          </div>
                          <p className="text-black flex flex-col mt-6">
                            <p className="text-xs text-start">Allocated Date</p>
                            <p className="text-xs text-start font-bold">
                              {moment(CTInterface.allocatedDate).format(
                                "DD MMM YYYY HH:mm:ss"
                              )}
                            </p>
                          </p>
                        </div>
                      ))
                    ) : (
                      <div className="flex item-center">
                        <p className="text-sm font-black rounded-md text-gray-400">
                          No CT Interface Found
                        </p>
                      </div>
                    )
                  ) : (
                    <span className=" p-1 rounded-full text-xs inline-block text-black">
                      none
                    </span>
                  )}
                </div>
              </div>

              {/* ======================= C T I N T E R F A C E ( R I G H T ) ======================= */}
              <div className="text-start mt-4 p-2 w-full md:w-1/2">
                <div className="w-full p-5 bg-white rounded-md min-h-40">
                  <p className="text-black font-black text-2xl mb-2 flex items-center">
                    CT Interface{" "}
                    <span className="text-xs text-white bg-blue-400 py-1 px-2.5 font-black rounded-full ml-1">
                      Right
                    </span>
                  </p>
                  {dashboardType === "PDC" ? (
                    dashboardData &&
                    dashboardData.rightCTInterfaces &&
                    dashboardData.rightCTInterfaces.length > 0 ? (
                      dashboardData.rightCTInterfaces.map((CTInterface) => (
                        <div key={CTInterface._id} className="flex flex-col">
                          <div className="font-normal">
                            <button
                              onClick={() =>
                                window.open(CTInterface.link, "_blank")
                              }
                              className="text-blue-500 font-bold hover:underline focus:outline-none"
                            >
                              {CTInterface.CTId}
                            </button>
                          </div>
                          <p className="text-black flex flex-col mt-6">
                            <p className="text-xs text-start">Allocated Date</p>
                            <p className="text-xs text-start font-bold">
                              {moment(CTInterface.allocatedDate).format(
                                "DD MMM YYYY HH:mm:ss"
                              )}
                            </p>
                          </p>
                        </div>
                      ))
                    ) : (
                      <div className="flex item-center">
                        <p className="text-sm font-black rounded-md text-gray-400">
                          No CT Interface Found
                        </p>
                      </div>
                    )
                  ) : (
                    <span className=" p-1 rounded-full text-xs inline-block text-black">
                      none
                    </span>
                  )}
                </div>
              </div>

              {/* ======================= C H A S S I S  R A I L  (L E F T) (P R I M A R Y) ======================= */}
              <div className="text-start mt-4 p-2 w-full md:w-1/2">
                <div className="w-full p-5 bg-white rounded-md min-h-40">
                  <p className="text-black font-black text-2xl mb-2 flex items-center">
                    Chassis Rail{" "}
                    <span className="text-xs text-white bg-blue-400 py-1 px-2.5 font-black rounded-full ml-1">
                      Left
                    </span>
                    <span className="text-xs text-white bg-red-500 py-1 px-2.5 font-black rounded-full ml-1">
                      Primary
                    </span>
                  </p>
                  {dashboardType === "PDC" ? (
                    dashboardData &&
                    dashboardData.leftPrimaryChassisRails &&
                    dashboardData.leftPrimaryChassisRails.length > 0 ? (
                      dashboardData.leftPrimaryChassisRails.map(
                        (ChassisRail) => (
                          <div key={ChassisRail._id} className="flex flex-col">
                            <div className="font-normal">
                              <button
                                onClick={() =>
                                  window.open(ChassisRail.link, "_blank")
                                }
                                className="text-blue-500 font-bold hover:underline focus:outline-none"
                              >
                                {ChassisRail.chassisId}
                              </button>
                            </div>
                            <p className="text-black flex flex-col mt-6">
                              <p className="text-xs text-start">
                                Allocated Date
                              </p>
                              <p className="text-xs text-start font-bold">
                                {moment(ChassisRail.allocatedDate).format(
                                  "DD MMM YYYY HH:mm:ss"
                                )}
                              </p>
                            </p>
                          </div>
                        )
                      )
                    ) : (
                      <div className="flex item-center">
                        <p className="text-sm font-black rounded-md text-gray-400">
                          No Chassis Rail Found
                        </p>
                      </div>
                    )
                  ) : (
                    <span className=" p-1 rounded-full text-xs inline-block text-black">
                      none
                    </span>
                  )}
                </div>
              </div>

              {/* ======================= C H A S S I S  R A I L  (R I G H T) (P R I M A R Y) ======================= */}
              <div className="text-start mt-4 p-2 w-full md:w-1/2">
                <div className="w-full p-5 bg-white rounded-md min-h-40">
                  <p className="text-black font-black text-2xl mb-2 flex items-center">
                    Chassis Rail{" "}
                    <span className="text-xs text-white bg-blue-400 py-1 px-2.5 font-black rounded-full ml-1">
                      Right
                    </span>
                    <span className="text-xs text-white bg-red-500 py-1 px-2.5 font-black rounded-full ml-1">
                      Primary
                    </span>
                  </p>
                  {dashboardType === "PDC" ? (
                    dashboardData &&
                    dashboardData.rightPrimaryChassisRails &&
                    dashboardData.rightPrimaryChassisRails.length > 0 ? (
                      dashboardData.rightPrimaryChassisRails.map(
                        (ChassisRail) => (
                          <div key={ChassisRail._id} className="flex flex-col">
                            <div className="font-normal">
                              <button
                                onClick={() =>
                                  window.open(ChassisRail.link, "_blank")
                                }
                                className="text-blue-500 font-bold hover:underline focus:outline-none"
                              >
                                {ChassisRail.chassisId}
                              </button>
                            </div>
                            <p className="text-black flex flex-col mt-6">
                              <p className="text-xs text-start">
                                Allocated Date
                              </p>
                              <p className="text-xs text-start font-bold">
                                {moment(ChassisRail.allocatedDate).format(
                                  "DD MMM YYYY HH:mm:ss"
                                )}
                              </p>
                            </p>
                          </div>
                        )
                      )
                    ) : (
                      <div className="flex item-center">
                        <p className="text-sm font-black rounded-md text-gray-400">
                          No Chassis Rail Found
                        </p>
                      </div>
                    )
                  ) : (
                    <span className=" p-1 rounded-full text-xs inline-block text-black">
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
