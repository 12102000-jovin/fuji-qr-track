import React, { useState, useEffect, useRef } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import {
  styled,
  useTheme,
  Box,
  Drawer as MuiDrawer,
  AppBar as MuiAppBar,
  Toolbar,
  List,
  CssBaseline,
  Dialog,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import {
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  QrCodeScannerRounded as QrCodeScannerRoundedIcon,
  Home as HomeIcon,
  Queue as QueueIcon,
  DynamicForm as DynamicFormIcon,
} from "@mui/icons-material";
import logo from "../../Images/FE-logo.png";
import Home from "../Home";
import PDCQRGenerator from "../PDCQRGenerator/PDCQRGenerator";
import SubAssemblyQRGenerator from "../SubAssemblyQRGenerator/SubAssemblyQRGenerator";
import PDC from "../../containers/PDC/PDC";
import Panel from "../../containers/SubAssembly/Panel";
import Allocate from "../../containers/Allocate/Allocate";
import WorkOrder from "../../containers/WorkOrder/WorkOrder";
import WorkOrderGenerator from "../WorkOrderQRGenerator/WorkOrderQRGenerator";
import WorkOrderCustomGenerator from "../WorkOrderQRGenerator/WorkOrderCustomQRGenerator";
import DashboardWorkOrder from "../../containers/Dashboard/DashboardWorkOrder";
import DashboardPDC from "../../containers/Dashboard/DashboardPDC";
import DashboardPanel from "../../containers/Dashboard/DashboardPanel";

const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

const NavBar = () => {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);

  const [QRScannerModal, setQRScannerModal] = useState(false);
  const [QRScanner, setQRScanner] = useState(false);
  const [scannedURL, setScannedURL] = useState("");
  const inputRef = useRef();

  const openScanQRModal = useRef(null);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleQRScanner = () => {
    setQRScanner(true);
    setQRScannerModal(true);
    console.log("QR Scanner State", QRScanner);
  };
  const handleScannerModal = () => {
    setQRScannerModal(false);
    setScannedURL("");
  };

  const handleInput = (event) => {
    const scannedInput = event.target.value;
    setScannedURL(scannedInput);
    // Implement your logic to extract URL from scanned input if needed
    console.log("Scanned URL:", scannedInput);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      try {
        const parsedInput = JSON.parse(scannedURL);
        if (parsedInput.link) {
          setScannedURL(parsedInput.link);
          // Open the scanned URL in a new window
          window.open(parsedInput.link, "_blank");
        } else {
          console.log("You scan invalid QR");
        }
      } catch (error) {
        console.log("error");
      }
    }
  };

  let blurTimeout;

  const handleBlur = () => {
    // Delay the modal closing to allow user interaction with the close button
    blurTimeout = setTimeout(() => {
      handleScannerModal();
    }, 200); // Adjust the delay time as needed
  };

  const handleFocus = () => {
    // Clear the blurTimeout to prevent the modal from closing
    clearTimeout(blurTimeout);
  };

  const handleKeyPress = (event) => {
    if (event.key === "`") {
      event.preventDefault();
      // Focus on the scan button when "]"
      openScanQRModal.current.focus();
    }
  };

  useEffect(() => {
    // Focus the input field after a short delay when the component mounts or modal opens
    const timeoutId = setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 100); // Adjust the delay as needed

    return () => clearTimeout(timeoutId); // Cleanup function to clear the timeout
  }, [QRScannerModal]);

  useEffect(() => {
    const handleKeyPress = (event) => {
      // Check if the pressed key is `
      if (event.key === "~") {
        event.preventDefault();
        setQRScannerModal(true);
        setScannedURL("");
      } else if (event.key === "[" || event.key === " ") {
        event.preventDefault();
        setQRScannerModal(false);
        setScannedURL("");
      }
    };

    // Attach the event listener
    document.addEventListener("keypress", handleKeyPress);

    // Clean up the event listener on component unmount
    return () => {
      document.removeEventListener("keypress", handleKeyPress);
    };
  }, []);

  return (
    <div onKeyDown={handleKeyPress} tabIndex={0}>
      <Router>
        <Box sx={{ display: "flex" }}>
          <CssBaseline />
          <AppBar
            position="fixed"
            open={open}
            className="h-16 bg-gradient-to-br from-gray-700 via-gray-800 to-gray-700 text-white"
          >
            <Toolbar>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                onClick={handleDrawerOpen}
                edge="start"
                sx={{
                  marginRight: 5,
                  ...(open && { display: "none" }),
                }}
              >
                <MenuIcon />
              </IconButton>
              <img src={logo} alt="Logo" height="40" width="40" />
              <p className="ml-2 text-2xl font-black">Dashboard</p>

              <div className="flex items-center ml-auto">
                {" "}
                {/* Use ml-auto for floating right */}
                <button
                  className="flex items-center bg-white p-2 px-3 rounded-md text-black hover:bg-secondary hover:text-white"
                  ref={openScanQRModal}
                  onClick={handleQRScanner}
                >
                  <span className="font-black">Scan QR Code </span>
                  <QrCodeScannerRoundedIcon
                    style={{ fontSize: 28, marginLeft: 8 }}
                  />
                </button>
              </div>
            </Toolbar>
          </AppBar>
          <Drawer variant="permanent" open={open}>
            <DrawerHeader>
              <div className="flex justify-content-start">
                <p className="text-start font-black text-2xl mr-28">Menu</p>
              </div>
              <IconButton onClick={handleDrawerClose}>
                {theme.direction === "rtl" ? (
                  <ChevronRightIcon />
                ) : (
                  <ChevronLeftIcon />
                )}
              </IconButton>
            </DrawerHeader>
            <Divider />
            <List>
              <ListItem disablePadding sx={{ display: "block" }}>
                <ListItemButton component={Link} to="/">
                  {open ? (
                    <ListItemText primary="Home" />
                  ) : (
                    <ListItemIcon>
                      <HomeIcon />
                    </ListItemIcon>
                  )}
                </ListItemButton>
              </ListItem>

              <ListItem disablePadding sx={{ display: "block" }}>
                <ListItemButton component={Link} to="/WorkOrder">
                  {open ? (
                    <ListItemText primary="Work Order" />
                  ) : (
                    <ListItemIcon>WO</ListItemIcon>
                  )}
                </ListItemButton>
              </ListItem>
              {/* <ListItem disablePadding sx={{ display: "block" }}>
              <ListItemButton component={Link} to="/PDCQRGenerator">
                {open ? (
                  <ListItemText primary="PDC Generator" />
                ) : (
                  <ListItemIcon>
                    <InboxIcon />
                  </ListItemIcon>
                )}
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding sx={{ display: "block" }}>
              <ListItemButton component={Link} to="/SubAssemblyQRGenerator">
                {open ? (
                  <ListItemText primary="Sub-Assembly Generator" />
                ) : (
                  <ListItemIcon>
                    <InboxIcon />
                  </ListItemIcon>
                )}
              </ListItemButton>
            </ListItem> */}

              <ListItem disablePadding sx={{ display: "block" }}>
                <ListItemButton component={Link} to="/PDC">
                  {open ? (
                    <ListItemText primary="PDC" />
                  ) : (
                    // <ListItemIcon>
                    //   <InboxIcon />
                    // </ListItemIcon>
                    <ListItemText primary="PDC" />
                  )}
                </ListItemButton>
              </ListItem>

              <ListItem disablePadding sx={{ display: "block" }}>
                <ListItemButton component={Link} to="/Panel">
                  {open ? (
                    <ListItemText primary="Panel" />
                  ) : (
                    <ListItemIcon>
                      <DynamicFormIcon />
                    </ListItemIcon>
                    // <ListItemText primary="Panel" />
                  )}
                </ListItemButton>
              </ListItem>

              <ListItem disablePadding sx={{ display: "block" }}>
                <ListItemButton component={Link} to="/Allocate">
                  {open ? (
                    <ListItemText primary="Allocate" />
                  ) : (
                    <ListItemIcon>
                      <QueueIcon />
                    </ListItemIcon>
                    // <ListItemText primary="Allocate" />
                  )}
                </ListItemButton>
              </ListItem>

              {/* <ListItem disablePadding sx={{ display: "block" }}>
              <ListItemButton component={Link} to="/Dashboard">
                {open ? (
                  <ListItemText primary="Dashboard" />
                ) : (
                  <ListItemIcon>
                    <InboxIcon />
                  </ListItemIcon>
                )}
              </ListItemButton>
            </ListItem> */}
              {/* 
              <ListItem disablePadding sx={{ display: "block" }}>
                <ListItemButton component={Link} to="/WorkOrderQRGenerator">
                  {open ? (
                    <ListItemText primary="Work Order Generator" />
                  ) : (
                    <ListItemIcon>WO</ListItemIcon>
                  )}
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding sx={{ display: "block" }}>
                <ListItemButton
                  component={Link}
                  to="/WorkOrderCustomQRGenerator"
                >
                  {open ? (
                    <ListItemText primary="Work Order Generator" />
                  ) : (
                    <ListItemIcon>WO Custom</ListItemIcon>
                  )}
                </ListItemButton>
              </ListItem> */}
            </List>
            <Divider />
          </Drawer>
          <Box
            component="main"
            sx={{
              flexGrow: 1,
              backgroundColor: "#eef3f9",
              minHeight: "95vh",
              marginTop: "5vh",
            }}
          >
            <DrawerHeader />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/PDCQRGenerator" element={<PDCQRGenerator />} />
              <Route
                path="/SubAssemblyQRGenerator"
                element={<SubAssemblyQRGenerator />}
              />
              <Route path="/PDC" element={<PDC />} />
              <Route path="/Panel" element={<Panel />} />
              <Route path="/Allocate" element={<Allocate />} />
              <Route
                path="/Dashboard/WorkOrder/:workOrderId"
                element={<DashboardWorkOrder />}
              />
              <Route path="/Dashboard/PDC/:pdcId" element={<DashboardPDC />} />
              <Route
                path="/Dashboard/PANEL/:panelId"
                element={<DashboardPanel />}
              />
              {/* <Route
                path="/WorkOrderQRGenerator"
                element={<WorkOrderGenerator />}
              />
              <Route
                path="/WorkOrderCustomQRGenerator"
                element={<WorkOrderCustomGenerator />}
              /> */}
              <Route path="/WorkOrder" element={<WorkOrder />} />
            </Routes>
          </Box>
        </Box>
      </Router>

      <Dialog
        open={QRScannerModal}
        onClose={handleScannerModal}
        onClick={handleScannerModal}
        PaperProps={{
          style: {
            backgroundColor: "transparent",
            boxShadow: "none",
            margin: 0,
            padding: 10,
          },
        }}
      >
        <div className="flex justify-center items-center flex-col">
          <h1
            className="text-white text-center font-black text-6xl mb-5"
            style={{ textShadow: "4px 4px #043f9d" }}
          >
            Scan QR Code{" "}
            <QrCodeScannerRoundedIcon
              className="ml-4 mb-3 bg-white rounded-xl animate__animated animate__flipInX"
              style={{
                fontSize: 65,
                color: "#043f9d",
                boxShadow: "4px 4px #043f9d",
              }}
            />
          </h1>
        </div>
        <div className="flex justify-center">
          <button
            onClick={handleScannerModal}
            className="p-2 bg-red-800 text-white font-bold rounded-xl mb-5 hover:bg-secondary"
            style={{ boxShadow: "4px 4px #043f9d" }}
          >
            {" "}
            Cancel
          </button>
        </div>
        <div className="flex justify-center">
          <input
            ref={inputRef}
            type="text"
            value={scannedURL}
            onInput={handleInput}
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
            onFocus={handleFocus}
            autoFocus
            className="bg-transparent text-white text-2xl text-center font-black w-96 border-none focus:outline-none caret-transparent"
          />
        </div>
      </Dialog>
    </div>
  );
};

export default NavBar;
