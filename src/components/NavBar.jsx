import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getProvider, getContract, getUserRole } from "../utils/Web3Utils";
import ContractABI from "../utils/NewsPlatform.json";

// Material UI Imports
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import { useLocation } from "react-router-dom"; // Import useLocation
import "./NavBar.css";
const NavBar = () => {
  const [userRole, setUserRole] = useState(null);
  const [value, setValue] = useState(0); // For managing selected tab
  const location = useLocation(); // Get location using hook

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const provider = await getProvider();
        const signer = await provider.getSigner();
        const contract = getContract(
          ContractABI.abi,
          "0xa7b99EF16A5da14aaa98888cdda3228BE329CA07",
          signer
        );

        const address = await signer.getAddress();
        const role = await getUserRole(contract, address);
        setUserRole(role);
      } catch (error) {
        console.error("Error fetching user role:", error);
        // Handle error appropriately (e.g., redirect to login)
      }
    };

    fetchUserRole();
    const currentPath = location.pathname; // Using useLocation data
    const paths = ["/", "/articles", "/submit-article", "/my-articles"];
    const tabIndex = paths.indexOf(currentPath);
    setValue(tabIndex !== -1 ? tabIndex : 0);
  }, [userRole, location.pathname]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            News Platform
          </Typography>
          <Tabs
            value={value}
            onChange={handleChange}
            TabIndicatorProps={{ style: { backgroundColor: "white" } }}
          >
            {userRole === "ADMIN" && (
              <Tab label="Admin Dashboard" to="/" component={Link} />
            )}
            <Tab label="Article List" to="/articles" component={Link} />
            {(userRole === "ADMIN" || userRole === "PUBLISHER") && (
              <Tab
                label="Submit Article"
                to="/submit-article"
                component={Link}
              />
            )}
            {(userRole === "ADMIN" || userRole === "PUBLISHER") && (
              <Tab label="My Articles" to="/my-articles" component={Link} />
            )}
          </Tabs>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default NavBar;
