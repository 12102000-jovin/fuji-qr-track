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
  Divider,
  Fab,
  Checkbox,
  Pagination,
} from "@mui/material";

import moment from "moment-timezone";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import QrCodeIcon from "@mui/icons-material/QrCode";
import LaunchIcon from "@mui/icons-material/Launch";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import ReactQRCode from "qrcode.react";
import html2canvas from "html2canvas";
import AddIcon from "@mui/icons-material/Add";

import logo from "../../Images/FE-logo.png";
import EditWorkOrder from "./EditWorkOrder";

//Components
import WorkOrderQRGenerator from "../../components/WorkOrderQRGenerator/WorkOrderQRGenerator";
import WorkOrderCustomQRGenerator from "../../components/WorkOrderQRGenerator/WorkOrderCustomQRGenerator";

const WorkOrder = () => {
  // State variables
  const [WorkOrderData, setWorkOrderData] = useState([]);
  const [openQRModal, setOpenQRModal] = useState(false);
  const [qrCodeData, setQrCodeData] = useState(null);
  const [modalWorkOrderID, setModalWorkOrderID] = useState(null);
  const [openAddWorkOrderModal, setOpenWorkOrderModal] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedRowsCount, setSelectedRowsCount] = useState("");

  const [searchQuery, setSearchQuery] = useState("");
  const [filteredWorkOrders, setFilteredWorkOrders] = useState([]);

  const [showWorkOrderCustomQRGenerator, setShowWorkOrderCustomQRGenerator] =
    useState(false);

  const [deleteWorkOrderModalState, setDeleteWorkOrderModalState] =
    useState(false);

  const [editWorkOrderModalState, setEditWorkOrderModalState] = useState(false);

  const [workOrderIdToEdit, setWorkOrderIdToEdit] = useState("");

  // Pagination
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    fetchWorkOrderData();
  }, [page, rowsPerPage]);

  const indexOfLastRow = page * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredWorkOrders.slice(indexOfFirstRow, indexOfLastRow);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(event.target.value);
    setPage(1); // Reset page to 1 when changing rows per page
  };

  useEffect(() => {
    setPage(1);
  }, [rowsPerPage]);

  // Ref
  const captureRef = useRef(null);

  // Constants
  const fetchWorkOrderData_API =
    "http://localhost:3001/WorkOrder/getAllWorkOrder";

  const deleteWorkOrder_API =
    "http://localhost:3001/WorkOrder/deleteWorkOrder/";

  // Effects
  useEffect(() => {
    fetchWorkOrderData();
  }, []);

  useEffect(() => {
    // Update filteredWorkOrders whenever WorkOrderData or searchQuery changes
    const searchQueryWithoutSpaces = searchQuery
      .replace(/\s/g, "")
      .toLowerCase();

    const words = searchQueryWithoutSpaces.split(/\s+/);

    const filteredData = WorkOrderData.filter((row) => {
      const workOrderIdWithoutSpaces = row.workOrderId
        .replace(/\s/g, "")
        .toLowerCase();
      const generatedDateWithoutSpaces = moment(row.generatedDate)
        .tz("Australia/Sydney")
        .format("DD MMMM YYYY")
        .replace(/\s/g, "")
        .toLowerCase();

      const matchWorkOrderId = words.every((word) =>
        workOrderIdWithoutSpaces.includes(word)
      );

      const matchGeneratedDate = words.every((word) =>
        generatedDateWithoutSpaces.includes(word)
      );

      return matchWorkOrderId || matchGeneratedDate;
    });

    setFilteredWorkOrders(filteredData);
  }, [WorkOrderData, searchQuery]);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  // Functions
  const fetchWorkOrderData = () => {
    axios
      .get(`${fetchWorkOrderData_API}`)
      .then((response) => {
        setWorkOrderData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  const handleCloseQRModal = () => {
    setOpenQRModal(false);
  };

  const handleAddWorkOrderModal = () => {
    setOpenWorkOrderModal(true);
    setShowWorkOrderCustomQRGenerator(false);
  };

  const handleAddWorkOrderCloseModal = () => {
    setOpenWorkOrderModal(false);
    fetchWorkOrderData();
  };

  const showQRCodes = (data, row) => {
    setQrCodeData(
      JSON.stringify({
        link: data.link,
        workOrderId: data.workOrderId,
      })
    );
    setModalWorkOrderID(data.workOrderId);
    setOpenQRModal(true);
  };

  const handleDownload = (workOrderID) => {
    const captureOptions = {
      width: 512,
      height: 565,
    };

    html2canvas(captureRef.current, captureOptions)
      .then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        const fileName = `${workOrderID}.png`;
        const a = document.createElement("a");
        a.href = imgData;
        a.download = fileName;
        a.click();
      })
      .catch((error) => {
        console.error("Error capturing image:", error);
      });
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedRows([]);
    } else {
      const allRowIds = WorkOrderData.map((row) => row._id);
      setSelectedRows(allRowIds);
    }
    setSelectAll(!selectAll);

    // Update the selectedRowsCount state
    setSelectedRowsCount(selectAll ? "" : WorkOrderData.length);
  };

  const handleSelectRow = (rowId) => {
    const newSelectedRows = selectedRows.includes(rowId)
      ? selectedRows.filter((id) => id !== rowId)
      : [...selectedRows, rowId];
    setSelectedRows(newSelectedRows);

    // Update the selectedRowsCount state
    setSelectedRowsCount(
      newSelectedRows.length > 0 ? newSelectedRows.length : ""
    );
  };

  const handleChangeComponent = () => {
    setShowWorkOrderCustomQRGenerator(!showWorkOrderCustomQRGenerator);
  };

  const handleWorkOrderDashboard = (workOrderId) => {
    window.open(
      `http://localhost:3000/Dashboard/WorkOrder/${workOrderId}`,
      "_blank"
    );
  };
  // To prevent submission when search query
  const handleFormSubmit = (event) => {
    event.preventDefault();
  };

  const handleCloseDeleteWorkOrderModal = () => {
    setDeleteWorkOrderModalState(false);
  };

  const handleOpenDeleteConfirmationModal = (workOrderId) => {
    setDeleteWorkOrderModalState(true);
    setModalWorkOrderID(workOrderId);
  };

  const handleDeleteWorkOrder = async (workOrderId) => {
    try {
      // Delete request tot the API
      const response = await axios.delete(
        `${deleteWorkOrder_API}${workOrderId}`
      );

      if (response.status === 200) {
        console.log("Work Order Deleted Succesfully");
        fetchWorkOrderData();
        setDeleteWorkOrderModalState(false);
      } else {
        console.log("Error deleting work order:", response.data.message);
        // Optionally, handle the case where deletion was not successful
      }
    } catch (error) {
      console.error("Error deleting work order:", error);
    }
  };

  const handleOpenEditModal = (workOrderId) => {
    setEditWorkOrderModalState(true);
    setWorkOrderIdToEdit(workOrderId);
  };

  return (
    <div>
      {/* WorkOrder Table */}
      <div className="flex justify-center bg-background border-none">
        <div className="w-3/4 p-6 shadow-lg bg-white rounded-md my-5">
          <p className="text-4xl text-signature font-black mb-5 mt-3">
            {" "}
            WorkOrder{" "}
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
                  placeholder="Search Work Order"
                  required
                  onChange={handleSearchChange}
                  value={searchQuery}
                />
              </div>
            </form>
            <form className="max-w-sm mx-auto mr-1 flex items-center">
              <p className="mr-2 font-bold text-xs"> Rows: </p>
              <select
                className="bg-gray-50 h-12 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                onChange={(e) => setRowsPerPage(Number(e.target.value))}
              >
                <option value="5" defaultValue>
                  5
                </option>
                <option value="10">10</option>
                <option value="15">15</option>
              </select>
            </form>
          </div>
          <hr className="h-px m-1 my-2 bg-gray-200 border-0 dark:bg-gray-700" />
          {selectedRowsCount && (
            <p className="p-3 m-1 bg-black text-white font-black rounded-xl">
              {" "}
              Selected Rows: {selectedRowsCount}
              <button className="bg-signature rounded-md ml-16 p-1 pl-2 pr-2">
                Download Selected Row QR
              </button>
            </p>
          )}
          <div className="flex justify-center">
            <TableContainer className="w-full m-1 border border-blue-500 rounded-md">
              <Table className="border-collapse w-full">
                <TableHead className="bg-signature m-4">
                  <TableCell
                    align="center"
                    style={{
                      width: "10%",
                      color: "white",
                      fontWeight: "bold",
                      fontSize: "1.10rem",
                    }}
                  >
                    <div className="flex items-center ">
                      Select All
                      <Checkbox
                        type="checkbox"
                        checked={selectAll}
                        onChange={() => handleSelectAll()}
                        style={{ color: "white" }}
                      />
                    </div>
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
                    WorkOrder ID
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
                    Generated Date
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
                  {currentRows.map((row) => (
                    <TableRow key={row.id} className="hover:bg-gray-100">
                      <TableCell align="center">
                        <Checkbox
                          type="checkbox"
                          checked={selectedRows.includes(row._id)}
                          onChange={() => handleSelectRow(row._id)}
                        />
                      </TableCell>
                      <TableCell
                        align="center"
                        style={{
                          fontWeight: "bold",
                        }}
                      >
                        {row.workOrderId}
                      </TableCell>
                      <TableCell align="center">
                        {moment(row.generatedDate)
                          .tz("Australia/Sydney")
                          .format("DD MMMM YYYY")}
                      </TableCell>
                      <TableCell align="center">
                        <IconButton
                          aria-label="delete"
                          size="small"
                          style={{ color: "red" }}
                        >
                          <DeleteIcon
                            fontSize="small"
                            onClick={() =>
                              handleOpenDeleteConfirmationModal(row.workOrderId)
                            }
                          />
                        </IconButton>
                        <IconButton
                          aria-label="icon"
                          size="small"
                          style={{ color: "black" }}
                        >
                          <EditIcon
                            fontSize="small"
                            onClick={() => handleOpenEditModal(row.workOrderId)}
                          />
                        </IconButton>
                        <IconButton
                          aria-label="QR"
                          size="small"
                          style={{ color: "navy" }}
                          onClick={() => showQRCodes(row)}
                        >
                          <QrCodeIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          aria-label="links"
                          size="small"
                          style={{ color: "smokewhite" }}
                        >
                          <LaunchIcon
                            fontSize="small"
                            onClick={() =>
                              handleWorkOrderDashboard(row.workOrderId)
                            }
                          />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {/* QR Code Modal */}
              <Dialog
                open={openQRModal}
                onClose={handleCloseQRModal}
                PaperProps={{
                  sx: {
                    borderRadius: "12px",
                    outline: "none",
                  },
                }}
              >
                <DialogContent>
                  <div ref={captureRef}>
                    <ReactQRCode
                      value={qrCodeData}
                      size={512}
                      imageSettings={{
                        text: "QR Code",
                        src: logo,
                        excavate: true,
                        width: 60,
                        height: 35,
                      }}
                    />
                    <p
                      style={{
                        color: "#043f9d",
                        fontFamily: "Avenir, sans-serif",
                        fontSize: "20px",
                        fontWeight: "bold",
                        textAlign: "center",
                        marginTop: "5px",
                      }}
                    >
                      WorkOrder ID: {modalWorkOrderID}
                    </p>
                  </div>
                </DialogContent>
                <DialogActions>
                  <button
                    className="bg-signature hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded "
                    onClick={() => handleDownload(modalWorkOrderID)}
                  >
                    Download
                  </button>
                  <button
                    className="bg-red-600 hover:bg-red-500 text-white font-semibold py-2 px-4 rounded"
                    onClick={handleCloseQRModal}
                  >
                    Close
                  </button>
                </DialogActions>
              </Dialog>
            </TableContainer>
          </div>
          <div className="flex justify-center mt-5">
            <Pagination
              count={Math.ceil(filteredWorkOrders.length / rowsPerPage)}
              page={page}
              onChange={handleChangePage}
              rowsPerPageOptions={[5, 10, 15]}
              rowsPerPage={rowsPerPage}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </div>
        </div>
      </div>
      {/* Add WorkOrder Button */}
      <div className="fixed bottom-5 right-5">
        <Fab
          variant="extended"
          aria-label="add"
          sx={{
            textTransform: "capitalize",
            fontWeight: "bold",
            backgroundColor: "black",
            color: "white",
            "&:hover": {
              backgroundColor: "#6c757d",
            },
          }}
          onClick={handleAddWorkOrderModal}
        >
          <AddIcon sx={{ mr: 1 }} />
          Generate WorkOrder
        </Fab>
      </div>
      {/* Add WorkOrder Modal */}
      <Dialog
        open={openAddWorkOrderModal}
        onClose={handleAddWorkOrderCloseModal}
        PaperProps={{
          sx: {
            borderRadius: "12px",
            outline: "none",
            minWidth: "70vw",
          },
        }}
      >
        <DialogContent className="bg-blue-900">
          <div className="flex justify-between items-center">
            <button
              className="text-xs text-white font-bold bg-blue-400 p-1 pl-2 pr-2 rounded-md hover:bg-secondary hover:text-white"
              onClick={handleChangeComponent}
            >
              {showWorkOrderCustomQRGenerator === true
                ? "Increment"
                : "Customise"}
            </button>
            <button
              className="bg-red-600 hover:bg-red-500 text-white font-semibold py-1 pl-2 pr-2 rounded generate-button"
              onClick={handleAddWorkOrderCloseModal}
            >
              <CloseIcon style={{ fontSize: "small" }} />
            </button>
          </div>
          {showWorkOrderCustomQRGenerator ? (
            <WorkOrderCustomQRGenerator />
          ) : (
            <WorkOrderQRGenerator />
          )}
        </DialogContent>
      </Dialog>
      {/* Delete WorkOrder Modal */}
      <div>
        <Dialog
          open={deleteWorkOrderModalState}
          onClose={handleCloseDeleteWorkOrderModal}
        >
          <DialogContent sx={{ padding: 0, minWidth: "500px" }}>
            <Divider className="h-1 bg-red-500" />
            <div className="flex justify-between items-center">
              <p className=" font-black text-xl px-5 py-3">
                Delete Confirmation
              </p>
              <CloseIcon
                className="m-2 hover:cursor-pointer hover:bg-gray-100 hover:rounded"
                onClick={handleCloseDeleteWorkOrderModal}
              />
            </div>
            <Divider />
            <p className="px-5 py-10">
              Are you sure you want to delete{" "}
              <strong>{modalWorkOrderID}</strong>?
            </p>
            <Divider />
            <DialogActions>
              <div className="flex justify-end">
                <button
                  className="bg-secondary text-white rounded font-semibold py-1 px-2 m-1 focus:outline-none hover:bg-gray-600"
                  onClick={handleCloseDeleteWorkOrderModal}
                >
                  Close
                </button>
                <button
                  className="bg-red-500 text-white rounded font-semibold py-1 px-2 m-1 focus:outline-none hover:bg-red-600"
                  onClick={() => {
                    handleDeleteWorkOrder(modalWorkOrderID);
                  }}
                >
                  Delete
                </button>
              </div>
            </DialogActions>
          </DialogContent>
        </Dialog>
      </div>
      <div>
        <EditWorkOrder
          open={editWorkOrderModalState}
          onClose={() => {
            fetchWorkOrderData();
            setEditWorkOrderModalState(false);
          }}
          workOrderId={workOrderIdToEdit}
        />
      </div>
    </div>
  );
};

export default WorkOrder;
