import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import moment from "moment-timezone";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import QrCodeIcon from "@mui/icons-material/QrCode";
import LaunchIcon from "@mui/icons-material/Launch";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import logo from "../../../Images/FE-logo.png";
import ReactQRCode from "qrcode.react";
import html2canvas from "html2canvas";
import SubAssemblyQRGenerator from "../../../components/SubAssemblyQRGenerator/SubAssemblyQRGenerator";
import SubAssemblyCustomQRGenerator from "../../../components/SubAssemblyQRGenerator/SubAssemblyCustomQRGenerator";
import EditLoadbank from "./EditLoadbank";
import JSZip from "jszip";

import {
  Divider,
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
  Pagination,
} from "@mui/material";

const LoadBank = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const [qrCodeData, setQrCodeData] = useState(null);
  const [openQRModal, setOpenQRModal] = useState(false);

  const [modalLoadbankID, setModalLoadbankID] = useState(null);

  const [selectedRows, setSelectedRows] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedRowsCount, setSelectedRowsCount] = useState("");
  const [selectedRowsQRCodes, setSelectedRowsQRCodes] = useState([]);
  const [openSelectedQRModal, setOpenSelectedQRModal] = useState(false);

  const [loadbankData, setLoadbankData] = useState([]);

  const [filteredLoadbanks, setFilteredLoadbanks] = useState([]);

  const [openAddLoadbankModal, setOpenLoadbankModal] = useState(false);

  const [showLoadbankCustomQRGenerator, setShowLoadbankCustomQRGenerator] =
    useState(false);

  const [deleteLoadbankModalState, setDeleteLoadbankModalState] =
    useState(false);

  const [editLoadbankModalState, setEditLoadbankModalState] = useState(false);
  const [loadbankIdToEdit, setLoadbankIdToEdit] = useState("");

  // Pagination
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    fetchLoadbankData();
  }, [page, rowsPerPage]);

  const indexOfLastRow = page * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredLoadbanks.slice(indexOfFirstRow, indexOfLastRow);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(event.target.value);
    setPage(1);
  };

  useEffect(() => {
    setPage(1);
  }, [rowsPerPage, searchQuery]);

  // Ref
  const captureRef = useRef(null);

  const fetchLoadbankData_API =
    "http://localhost:3001/SubAssembly/Loadbank/getAllLoadbank";

  const deleteLoadbank_API =
    "http://localhost:3001/SubAssembly/Loadbank/deleteLoadbank/";

  useEffect(() => {
    fetchLoadbankData();
  }, []);

  useEffect(() => {
    // Update filteredPDCs whenever loadbankData or searchQuery changes
    const searchQueryWithoutSpaces = searchQuery
      .replace(/\s/g, "")
      .toLowerCase();

    const words = searchQueryWithoutSpaces.split(/\s+/);

    const filteredData = loadbankData.filter((row) => {
      const loadbankIdWithoutSpaces = row.loadbankId
        .replace(/\s/g, "")
        .toLowerCase();
      const generatedDateWithoutSpaces = moment(row.generatedDate)
        .tz("Australia/Sydney")
        .format("DD MMMM YYYY")
        .replace(/\s/g, "")
        .toLowerCase();

      const matchLoadbankId = words.every((word) =>
        loadbankIdWithoutSpaces.includes(word)
      );

      const matchGeneratedDate = words.every((word) =>
        generatedDateWithoutSpaces.includes(word)
      );

      return matchLoadbankId || matchGeneratedDate;
    });

    setFilteredLoadbanks(filteredData);
  }, [loadbankData, searchQuery]);

  const fetchLoadbankData = () => {
    axios.get(`${fetchLoadbankData_API}`).then((response) => {
      setLoadbankData(response.data);
    });
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleAddLoadbankCloseModal = () => {
    setOpenLoadbankModal(false);
    fetchLoadbankData();
  };

  const handleChangeComponent = () => {
    setShowLoadbankCustomQRGenerator(!showLoadbankCustomQRGenerator);
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedRows([]);
    } else {
      const allRowIds = loadbankData.map((row) => row._id);
      setSelectedRows(allRowIds);
    }
    setSelectAll(!selectAll);

    // Update the selectedRowsCount state
    setSelectedRowsCount(selectAll ? "" : loadbankData.length);
  };
  const showQRCodes = (data, row) => {
    setQrCodeData(
      JSON.stringify({
        link: data.link,
        loadbankId: data.loadbankId,
      })
    );
    setModalLoadbankID(data.loadbankId);
    setOpenQRModal(true);
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

  const handleCloseQRModal = () => {
    setOpenQRModal(false);
  };

  const handleDownload = (loadbankID) => {
    const captureOptions = {
      width: 512,
      height: 565,
    };

    html2canvas(captureRef.current, captureOptions)
      .then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        const fileName = `${loadbankID}.png`;
        const a = document.createElement("a");
        a.href = imgData;
        a.download = fileName;
        a.click();
      })
      .catch((error) => {
        console.error("Error capturing image:", error);
      });
  };

  const handleAddLoadbankModal = () => {
    setOpenLoadbankModal(true);
    setShowLoadbankCustomQRGenerator(false);
  };

  const handleLoadbankDashboard = (loadbankId) => {
    window.open(
      `http://localhost:3000/Dashboard/Loadbank/${loadbankId}`,
      "_blank"
    );
  };

  const handleCloseDeleteLoadbankModal = () => {
    setDeleteLoadbankModalState(false);
  };

  const handleOpenDeleteConfirmationModal = (loadbankId) => {
    setDeleteLoadbankModalState(true);
    setModalLoadbankID(loadbankId);
  };

  const handleDeleteLoadbank = async (loadbankId) => {
    console.log(loadbankId);
    try {
      const response = await axios.delete(`${deleteLoadbank_API}${loadbankId}`);

      if (response.status === 200) {
        console.log("Loadbank Deleted Successfully");
        fetchLoadbankData();
        setDeleteLoadbankModalState(false);
      } else {
        console.log("Error deleting loadbank:", response.data.message);
      }
    } catch (error) {
      console.error("Error deleting loadbank", error);
    }
  };

  const handleOpenEditModal = (loadbankId) => {
    setEditLoadbankModalState(true);
    setLoadbankIdToEdit(loadbankId);
    console.log(editLoadbankModalState);
  };

  const handleDownloadSelectedRowQR = () => {
    const qrCodes = selectedRows
      .map((rowId) => {
        const selectedRow = loadbankData.find((row) => row._id === rowId);
        if (selectedRow) {
          return {
            loadbankId: selectedRow.loadbankId,
            qrCodeData: JSON.stringify({
              link: selectedRow.link,
              workOrderId: selectedRow.workOrderId,
            }),
          };
        }
        return null;
      })
      .filter(Boolean);
    setSelectedRowsQRCodes(qrCodes);
    setOpenSelectedQRModal(true);
  };

  const handleDownloadAllSelectedQR = async () => {
    const zip = new JSZip();

    const promises = selectedRowsQRCodes.map(async (code) => {
      const qrCodeElement = document.getElementById(
        `selectedQRCode-${code.loadbankId}`
      );
      const qrCodeCanvas = await html2canvas(qrCodeElement, {
        width: 512,
        height: 565,
      });

      return {
        name: `${code.loadbankId}.png`,
        data: qrCodeCanvas
          .toDataURL("image/png")
          .replace(/^data:image\/(png|jpg);base64,/, ""),
      };
    });

    const files = await Promise.all(promises);

    files.forEach((file) => {
      zip.file(file.name, file.data, { base64: true });
    });

    zip.generateAsync({ type: "blob" }).then((content) => {
      const a = document.createElement("a");
      const url = URL.createObjectURL(content);
      a.href = url;
      a.download = `Selected-Loadbank`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });
  };

  return (
    <div>
      <div className="flex justify-center bg-background border-none">
        <div className="w-3/4 p-6 shadow-lg bg-white rounded-md my-5">
          <p className="text-4xl text-signature font-black mb-5 mt-3">
            Loadbank
          </p>
          <div className="flex items-center">
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
                  placeholder="Search Loadbank"
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
            <div className="flex justify-around items-center p-3 m-1 bg-black text-white font-black rounded-xl">
              <p className=""> Selected Rows: {selectedRowsCount}</p>
              <button
                className="bg-signature rounded-md ml-16 p-1 pl-2 pr-2"
                onClick={handleDownloadSelectedRowQR}
              >
                Download Selected Row QR
              </button>
            </div>
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
                    Loadbank ID
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
                  {currentRows
                    .sort((a, b) => b.loadbankId.localeCompare(a.loadbankId))
                    .map((row) => (
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
                          {row.loadbankId}
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
                              onClick={() => {
                                handleOpenDeleteConfirmationModal(
                                  row.loadbankId
                                );
                              }}
                            />
                          </IconButton>
                          <IconButton
                            aria-label="icon"
                            size="small"
                            style={{ color: "black" }}
                          >
                            <EditIcon
                              fontSize="small"
                              onClick={() =>
                                handleOpenEditModal(row.loadbankId)
                              }
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
                                handleLoadbankDashboard(row.loadbankId)
                              }
                            />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
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
                      Loadbank ID: {modalLoadbankID}
                    </p>
                  </div>
                </DialogContent>
                <DialogActions>
                  <button
                    className="bg-signature hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded "
                    onClick={() => handleDownload(modalLoadbankID)}
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
              count={Math.ceil(filteredLoadbanks.length / rowsPerPage)}
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
          onClick={handleAddLoadbankModal}
        >
          <AddIcon sx={{ mr: 1 }} />
          Generate Loadbank
        </Fab>
      </div>
      <Dialog
        open={openAddLoadbankModal}
        onClose={handleAddLoadbankCloseModal}
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
              {showLoadbankCustomQRGenerator === true
                ? "Increment"
                : "Customise"}
            </button>
            <button
              className="bg-red-600 hover:bg-red-500 text-white font-semibold py-1 pl-2 pr-2 rounded generate-button"
              onClick={handleAddLoadbankCloseModal}
            >
              <CloseIcon style={{ fontSize: "small" }} />
            </button>
          </div>
          {showLoadbankCustomQRGenerator ? (
            <SubAssemblyCustomQRGenerator />
          ) : (
            <SubAssemblyQRGenerator />
          )}
        </DialogContent>
      </Dialog>
      <div>
        <Dialog
          open={deleteLoadbankModalState}
          onClose={handleCloseDeleteLoadbankModal}
        >
          <DialogContent sx={{ padding: 0, minWidth: "500px" }}>
            <Divider className="h-1 bg-red-500" />
            <div className="flex justify-between items-center">
              <p className=" font-black text-xl px-5 py-3">
                Delete Confirmation
              </p>
              <CloseIcon
                className="m-2 hover:cursor-pointer hover:bg-gray-100 hover:rounded"
                onClick={handleCloseDeleteLoadbankModal}
              />
            </div>
            <Divider />
            <p className="px-5 py-10">
              Are you sure you want to delete <strong>{modalLoadbankID}</strong>
              ?
            </p>
            <Divider />
            <DialogActions>
              <div className="flex justify-end">
                <button
                  className="bg-secondary text-white rounded font-semibold py-1 px-2 m-1 focus:outline-none hover:bg-gray-600"
                  onClick={handleCloseDeleteLoadbankModal}
                >
                  Close
                </button>
                <button
                  className="bg-red-500 text-white rounded font-semibold py-1 px-2 m-1 focus:outline-none hover:bg-red-600"
                  onClick={() => {
                    handleDeleteLoadbank(modalLoadbankID);
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
        <EditLoadbank
          open={editLoadbankModalState}
          onClose={() => {
            fetchLoadbankData();
            setEditLoadbankModalState(false);
          }}
          loadbankId={loadbankIdToEdit}
        />
      </div>
      <Dialog
        open={openSelectedQRModal}
        onClose={() => setOpenSelectedQRModal(false)}
        PaperProps={{
          sx: {
            borderRadius: "12px",
            outline: "none",
            minWidth: "70vw",
          },
        }}
      >
        <DialogContent className="bg-blue-900">
          <div className="flex flex-wrap justify-center items-center">
            {selectedRowsQRCodes.map((qrCode, index) => (
              <div
                className="p-5 m-5 bg-white rounded-lg shadow-md"
                key={index}
              >
                <div className="flex flex-col justify-center items-center">
                  <div
                    ref={captureRef}
                    id={`selectedQRCode-${qrCode.loadbankId}`}
                  >
                    <ReactQRCode
                      value={qrCode.qrCodeData}
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
                        fontFamily: "Avenir, sans-serif",
                        fontSize: "20px",
                        fontWeight: "bold",
                      }}
                      className="text-signature text-center"
                    >
                      Loadbank ID: {qrCode.loadbankId}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
        <DialogActions>
          <button
            className="bg-signature text-white font-semibold rounded ml-16 py-2 px-4"
            onClick={handleDownloadAllSelectedQR}
          >
            Download
          </button>
          <button
            className="bg-red-600 hover:bg-red-500 text-white font-semibold py-2 px-4 rounded"
            onClick={() => setOpenSelectedQRModal(false)}
          >
            Close
          </button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default LoadBank;
