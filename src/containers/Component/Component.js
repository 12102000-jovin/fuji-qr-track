import React, { useState, useEffect, useRef } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogContent,
  DialogActions,
  Fab,
  Checkbox,
} from "@mui/material";

import axios from "axios";

import moment from "moment-timezone";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import QrCodeIcon from "@mui/icons-material/QrCode";
import LaunchIcon from "@mui/icons-material/Launch";
import CloseIcon from "@mui/icons-material/Close";

const Component = () => {
  const [componentData, setComponentData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredComponent, setFilteredComponent] = useState([]);

  const fetchComponentData_API =
    "http://localhost:3001/Component/getAllComponents";

  useEffect(() => {
    fetchComponentData();
  }, []);

  const fetchComponentData = () => {
    axios
      .get(`${fetchComponentData_API}`)
      .then((response) => {
        setComponentData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  useEffect(() => {
    // Update filteredComponentData whenever WorkOrderData or searchQuery changes
    const searchQueryWithoutSpaces = searchQuery
      .replace(/\s/g, "")
      .toLowerCase();

    const words = searchQueryWithoutSpaces.split(/\s+/);

    const filteredData = componentData.filter((row) => {
      const componentSerialNumberWithoutSpaces = row.componentSerialNumber
        .replace(/\s/g, "")
        .toLowerCase();
      const componentTypeWithoutSpaces = row.componentType
        .replace(/\s/g, "")
        .toLowerCase();

      const matchComponentSerialNumber = words.every((word) =>
        componentSerialNumberWithoutSpaces.includes(word)
      );

      const matchComponentType = words.every((word) =>
        componentTypeWithoutSpaces.includes(word)
      );

      return matchComponentSerialNumber || matchComponentType;
    });

    setFilteredComponent(filteredData);
  }, [componentData, searchQuery]);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  // To prevent submission when search query
  const handleFormSubmit = (event) => {
    event.preventDefault();
  };

  return (
    <div>
      <div className="flex justify-center bg-background border-none">
        <div className="w-3/4 p-6 shadow-lg bg-white rounded-md my-5">
          <p className="text-4xl text-signature font-black mb-5 mt-3">
            Component
          </p>
          <div className="flex items-center">
            {/* Search Function */}
            <form className="p-1 flex-grow" onSubmit={handleFormSubmit}>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <svg
                    className="w-4 h-4 text-gray-500 dark:text-gray-400"
                    aria-hidden="true"
                    fill="none"
                    viewBox="0 0 20 20"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                    />
                  </svg>
                </div>
                <input
                  type="search"
                  id="default-search"
                  className="block h-12 p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 w-1/3"
                  placeholder="Search Component"
                  required
                  onChange={handleSearchChange}
                  value={searchQuery}
                />
              </div>
            </form>
            <form className="max-w-sm mx-auto mr-1">
              <select className="bg-gray-50 h-12 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                <option value="10" defaultValue>
                  {" "}
                  10
                </option>
                <option value="15">15</option>
                <option value="20">20</option>
              </select>
            </form>
          </div>
          <hr className="h-px m-1 my-2 bg-gray-200 border-0 dark:bg-gray-700" />
          <div className="flex justify-center">
            <TableContainer className="w-full m-1 border border-blue-500 rounded-md">
              <Table className="border-collapse w-full">
                <TableHead className="bg-signature m-4">
                  <TableCell
                    align="center"
                    style={{
                      width: "20%",
                      color: "white",
                      fontWeight: "bold",
                      fontSize: "1.10rem",
                    }}
                  >
                    Serial Number
                  </TableCell>
                  <TableCell
                    align="center"
                    style={{
                      width: "20%",
                      color: "white",
                      fontWeight: "bold",
                      fontSize: "1.10rem",
                    }}
                  >
                    Component Type
                  </TableCell>
                  <TableCell
                    align="center"
                    style={{
                      width: "20%",
                      color: "white",
                      fontWeight: "bold",
                      fontSize: "1.10rem",
                    }}
                  >
                    Action
                  </TableCell>
                </TableHead>

                <TableBody>
                  {filteredComponent.map((row) => (
                    <TableRow key={row.id} className="hover:bg-gray-100">
                      <TableCell
                        align="center"
                        style={{
                          fontWeight: "bold",
                        }}
                      >
                        {row.componentSerialNumber}
                      </TableCell>
                      <TableCell align="center">{row.componentType}</TableCell>
                      <TableCell align="center">
                        <IconButton
                          aria-label="delete"
                          size="small"
                          style={{ color: "red" }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          aria-label="icon"
                          size="small"
                          style={{ color: "black" }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          aria-label="QR"
                          size="small"
                          style={{ color: "navy" }}
                          //   onClick={() => showQRCodes(row)}
                        >
                          <QrCodeIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          aria-label="links"
                          size="small"
                          style={{ color: "smokewhite" }}
                        >
                          <LaunchIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Component;
