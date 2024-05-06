import React, { useState, useEffect } from "react";
import { TextField, Button, Grid, Typography } from "@mui/material";
import { getContract, getProvider } from "../utils/Web3Utils.js";
import ContractABI from "../utils/NewsPlatform.json"; // Import your contract's ABI
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const [contract, setContract] = useState(null);
  const [newAdminAddress, setNewAdminAddress] = useState("");
  const [newPublisherAddress, setNewPublisherAddress] = useState("");
  const [newPublisherName, setNewPublisherName] = useState("");
  const [isFocused1, setIsFocused1] = useState(false);
  const [isFocused2, setIsFocused2] = useState(false);
  const [isFocused3, setIsFocused3] = useState(false);

  useEffect(() => {
    const init = async () => {
      const provider = await getProvider();
      // Get the signer
      const signer = await provider.getSigner();

      const newsContract = getContract(
        ContractABI.abi,
        "0xa7b99EF16A5da14aaa98888cdda3228BE329CA07",
        signer
      );
      setContract(newsContract);
    };
    init();
  }, []);

  const handleAdminSubmit = async (event) => {
    event.preventDefault();
    try {
      await contract.grantAdminRole(newAdminAddress);
      alert("Admin role granted successfully!");
      setNewAdminAddress(""); // Clear input
    } catch (error) {
      console.error("Error granting admin role:", error);
      alert("Failed to grant admin role.");
    }
  };

  const handlePublisherSubmit = async (event) => {
    event.preventDefault();
    try {
      await contract.registerPublisher(newPublisherAddress, newPublisherName);
      alert("Publisher registered successfully!");
      setNewPublisherAddress("");
      setNewPublisherName("");
    } catch (error) {
      console.error("Error registering publisher:", error);
      alert("Failed to register publisher.");
    }
  };

  return (
    <Grid container spacing={2} style={{ marginTop: "1vh" }}>
      <Grid item xs={12}>
        <Typography variant="h5" gutterBottom>
          Admin Dashboard
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="h6" gutterBottom>
          Grant Admin Role
        </Typography>
        <form onSubmit={handleAdminSubmit} style={{ marginTop: "2.3vh" }}>
          <TextField
            label="Enter User's Address"
            value={newAdminAddress}
            onChange={(e) => setNewAdminAddress(e.target.value)}
            fullWidth
            required
            onFocus={() => setIsFocused1(true)}
            onBlur={() => setIsFocused1(false)}
            InputLabelProps={{
              style: {
                color: isFocused1 ? "#1976D2" : "#f8f8ff",
                opacity: isFocused1 ? "1.0" : "0.2",
              },
            }}
          />
          <Button type="submit" variant="contained" sx={{ mt: 1 }}>
            Grant Admin Role
          </Button>
        </form>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="h6" gutterBottom>
          Register Publisher
        </Typography>
        <form onSubmit={handlePublisherSubmit} style={{ marginTop: "1.8vh" }}>
          <TextField
            label="Enter Publisher's Address"
            value={newPublisherAddress}
            onChange={(e) => setNewPublisherAddress(e.target.value)}
            fullWidth
            required
            onFocus={() => setIsFocused2(true)}
            onBlur={() => setIsFocused2(false)}
            InputLabelProps={{
              style: {
                color: isFocused2 ? "#1976D2" : "#f8f8ff",
                opacity: isFocused2 ? "1.0" : "0.2",
              },
            }}
          />
          <TextField
            style={{ marginTop: "2.3vh" }}
            label="Enter Publisher's Name"
            value={newPublisherName}
            onChange={(e) => setNewPublisherName(e.target.value)}
            fullWidth
            required
            onFocus={() => setIsFocused3(true)}
            onBlur={() => setIsFocused3(false)}
            InputLabelProps={{
              style: {
                color: isFocused3 ? "#1976D2" : "#f8f8ff",
                opacity: isFocused3 ? "1.0" : "0.2",
              },
            }}
          />
          <Button
            type="submit"
            variant="contained"
            sx={{ mt: 1 }}
            style={{ marginTop: "2.3vh" }}
          >
            Register Publisher
          </Button>
        </form>
      </Grid>
    </Grid>
  );
};

export default AdminDashboard;
