import React, { useState, useEffect, useRef } from "react";
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
import JSZip from "jszip";

//Components
import PDCQRGenerator from "../../components/PDCQRGenerator/PDCQRGenerator";
import PDCCustomQRGenerator from "../../components/PDCQRGenerator/PDCCustomQRGenerator";
import EditPDC from "./EditPDC";

const PDC = () => {
  // State variables
  const [PDCData, setPDCData] = useState([]);
  const [openQRModal, setOpenQRModal] = useState(false);
  const [qrCodeData, setQrCodeData] = useState(null);
  const [modalPdcID, setModalPdcID] = useState(null);
  const [openAddPDCModal, setOpenPDCModal] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedRowsCount, setSelectedRowsCount] = useState("");
  const [selectedRowsQRCodes, setSelectedRowsQRCodes] = useState([]);
  const [openSelectedQRModal, setOpenSelectedQRModal] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [filteredPDCs, setFilteredPDCs] = useState([]);

  const [showPDCCustomQRGenerator, setShowPDCCustomQRGenerator] =
    useState(false);

  const [deletePDCModalState, setDeletePDCModalState] = useState(false);

  const [editPDCModalState, setEditPDCModalState] = useState(false);

  const [pdcIdToEdit, setPDCIdToEdit] = useState("");

  // Pagination
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    fetchPDCData();
  }, [page, rowsPerPage]);

  const indexOfLastRow = page * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredPDCs.slice(indexOfFirstRow, indexOfLastRow);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(event.target.value);
    setPage(1); // Reset page to 1 when changing rows per page
  };

  useEffect(() => {
    setPage(1);
  }, [rowsPerPage, searchQuery]);

  // Ref
  const captureRef = useRef(null);

  // Constants
  const fetchPDCData_API = "http://localhost:3001/PDC/getAllPDC";

  const deletePDC_API = "http://localhost:3001/PDC/deletePDC/";

  // Effects
  useEffect(() => {
    fetchPDCData();
  }, []);

  useEffect(() => {
    // Update filteredPDCs whenever PDCData or searchQuery changes
    const searchQueryWithoutSpaces = searchQuery
      .replace(/\s/g, "")
      .toLowerCase();

    const words = searchQueryWithoutSpaces.split(/\s+/);

    const filteredData = PDCData.filter((row) => {
      const pdcIdWithoutSpaces = row.pdcId.replace(/\s/g, "").toLowerCase();
      const generatedDateWithoutSpaces = moment(row.generatedDate)
        .tz("Australia/Sydney")
        .format("DD MMMM YYYY")
        .replace(/\s/g, "")
        .toLowerCase();

      const matchPdcId = words.every((word) =>
        pdcIdWithoutSpaces.includes(word)
      );
      const matchGeneratedDate = words.every((word) =>
        generatedDateWithoutSpaces.includes(word)
      );

      return matchPdcId || matchGeneratedDate;
    });

    setFilteredPDCs(filteredData);
  }, [PDCData, searchQuery]);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  // Functions
  const fetchPDCData = () => {
    axios
      .get(`${fetchPDCData_API}`)
      .then((response) => {
        setPDCData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  const handleCloseQRModal = () => {
    setOpenQRModal(false);
  };

  const handleAddPDCModal = () => {
    setOpenPDCModal(true);
    setShowPDCCustomQRGenerator(false);
  };

  const handleAddPDCCloseModal = () => {
    setOpenPDCModal(false);
    fetchPDCData();
  };

  const showQRCodes = (data, row) => {
    setQrCodeData(
      JSON.stringify({
        link: data.link,
        pdcId: data.pdcId,
      })
    );
    setModalPdcID(data.pdcId);
    setOpenQRModal(true);
  };

  const handleDownload = (pdcID) => {
    const captureOptions = {
      width: 512,
      height: 565,
    };

    html2canvas(captureRef.current, captureOptions)
      .then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        const fileName = `${pdcID}.png`;
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
      const allRowIds = PDCData.map((row) => row._id);
      setSelectedRows(allRowIds);
    }
    setSelectAll(!selectAll);

    // Update the selectedRowsCount state
    setSelectedRowsCount(selectAll ? "" : PDCData.length);
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
    setShowPDCCustomQRGenerator(!showPDCCustomQRGenerator);
  };

  const handlePDCDashboard = (pdcId) => {
    window.open(`http://localhost:3000/Dashboard/PDC/${pdcId}`, "_blank");
  };

  // To prevent submission when search query
  const handleFormSubmit = (event) => {
    event.preventDefault();
  };

  const handleCloseDeletePDCModal = () => {
    setDeletePDCModalState(false);
  };

  const handleOpenDeleteConfirmationModal = (workOrderId) => {
    setDeletePDCModalState(true);
    setModalPdcID(workOrderId);
  };

  const handleDeletePDC = async (pdcId) => {
    try {
      const response = await axios.delete(`${deletePDC_API}${pdcId}`);

      if (response.status === 200) {
        console.log("PDC Deleted Successfully");
        fetchPDCData();
        setDeletePDCModalState(false);
      } else {
        console.log("Error deleting pdc:", response.data.message);
      }
    } catch (error) {
      console.error("Error deleting pdc:", error);
    }
  };

  const handleOpenEditModal = (pdcId) => {
    setEditPDCModalState(true);
    setPDCIdToEdit(pdcId);
  };

  const handleDownloadSelectedRowQR = () => {
    const qrCodes = selectedRows
      .map((rowId) => {
        const selectedRow = PDCData.find((row) => row._id === rowId);
        if (selectedRow) {
          return {
            pdcId: selectedRow.pdcId,
            qrCodeData: JSON.stringify({
              link: selectedRow.link,
              pdcId: selectedRow.pdcId,
            }),
          };
        }
        return null;
      })
      .filter(Boolean);
    setSelectedRowsQRCodes(qrCodes);
    setOpenSelectedQRModal(true); // Open the modal to display QR codes
  };

  const handleDownloadAllSelectedQR = async () => {
    const zip = new JSZip();

    const promises = selectedRowsQRCodes.map(async (code) => {
      const qrCodeElement = document.getElementById(
        `selectedQRCode-${code.pdcId}`
      );
      const qrCodeCanvas = await html2canvas(qrCodeElement, {
        width: 512,
        height: 565,
      });

      return {
        name: `${code.pdcId}.png`,
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
      a.download = `Selected-PDC`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });
  };

  return (
    <div>
      {/* PDC Table */}
      <div className="flex justify-center bg-background border-none">
        <div className="w-3/4 p-6 shadow-lg bg-white rounded-md my-5">
          <p className="text-4xl text-signature font-black mb-5 mt-3"> PDC </p>
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
                  placeholder="Search PDC"
                  required
                  onChange={handleSearchChange}
                  value={searchQuery}
                />
              </div>
            </form>
            <form className="max-w-sm mx-auto mr-1 flex items-center">
              <p className="mr-2 font-bold text-xs"> Rows: </p>
              <select
                id="countries"
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
                    PDC ID
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
                        {row.pdcId}
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
                              handleOpenDeleteConfirmationModal(row.pdcId);
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
                            onClick={() => {
                              handleOpenEditModal(row.pdcId);
                            }}
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
                            onClick={() => handlePDCDashboard(row.pdcId)}
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
                      PDC ID: {modalPdcID}
                    </p>
                  </div>
                </DialogContent>
                <DialogActions>
                  <button
                    className="bg-signature hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded "
                    onClick={() => handleDownload(modalPdcID)}
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
              count={Math.ceil(filteredPDCs.length / rowsPerPage)}
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
      {/* Add PDC Button */}
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
          onClick={handleAddPDCModal}
        >
          <AddIcon sx={{ mr: 1 }} />
          Generate PDC
        </Fab>
      </div>
      {/* Add PDC Modal */}
      <Dialog
        open={openAddPDCModal}
        onClose={handleAddPDCCloseModal}
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
              {showPDCCustomQRGenerator === true ? "Increment" : "Customise"}
            </button>
            <button
              className="bg-red-600 hover:bg-red-500 text-white font-semibold py-1 pl-2 pr-2 rounded generate-button"
              onClick={handleAddPDCCloseModal}
            >
              <CloseIcon style={{ fontSize: "small" }} />
            </button>
          </div>
          {showPDCCustomQRGenerator ? (
            <PDCCustomQRGenerator />
          ) : (
            <PDCQRGenerator />
          )}
        </DialogContent>
      </Dialog>
      {/* Delete PDC Modal */}
      <div>
        <Dialog open={deletePDCModalState} onClose={handleCloseDeletePDCModal}>
          <DialogContent sx={{ padding: 0, minWidth: "500px" }}>
            <Divider className="h-1 bg-red-500" />
            <div className="flex justify-between items-center">
              <p className=" font-black text-xl px-5 py-3">
                Delete Confirmation
              </p>
              <CloseIcon
                className="m-2 hover:cursor-pointer hover:bg-gray-100 hover:rounded"
                onClick={handleCloseDeletePDCModal}
              />
            </div>
            <Divider />
            <p className="px-5 py-10">
              Are you sure you want to delete <strong>{modalPdcID}</strong>?
            </p>
            <Divider />
            <DialogActions>
              <div className="flex justify-end">
                <button
                  className="bg-secondary text-white rounded font-semibold py-1 px-2 m-1 focus:outline-none hover:bg-gray-600"
                  onClick={handleCloseDeletePDCModal}
                >
                  Close
                </button>
                <button
                  className="bg-red-500 text-white rounded font-semibold py-1 px-2 m-1 focus:outline-none hover:bg-red-600"
                  onClick={() => {
                    handleDeletePDC(modalPdcID);
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
        <EditPDC
          open={editPDCModalState}
          onClose={() => {
            fetchPDCData();
            setEditPDCModalState(false);
          }}
          pdcId={pdcIdToEdit}
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
                  <div ref={captureRef} id={`selectedQRCode-${qrCode.pdcId}`}>
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
                      PDC ID: {qrCode.pdcId}
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

export default PDC;
