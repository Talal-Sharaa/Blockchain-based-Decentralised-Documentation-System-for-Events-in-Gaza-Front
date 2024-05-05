import React, { useState, useEffect } from "react";
import { getContract, getProvider } from "../utils/Web3Utils.js";
import ContractABI from "../utils/NewsPlatform.json"; // Import your contract's ABI
import "water.css/out/water.css";
const AdminDashboard = () => {
  const [contract, setContract] = useState(null);
  const [newAdminAddress, setNewAdminAddress] = useState("");
  const [newPublisherAddress, setNewPublisherAddress] = useState("");
  const [newPublisherName, setNewPublisherName] = useState("");

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
    <div>
      <h1>Admin Dashboard</h1>
      {/* ... Form for granting admin role ... */}
      <form onSubmit={handleAdminSubmit}>
        <input
          value={newAdminAddress}
          onChange={(e) => setNewAdminAddress(e.target.value)}
          placeholder="Enter User's Address"
        />
        <button type="submit">Grant Admin Role</button>
      </form>

      {/* Form for registering publisher */}
      <form onSubmit={handlePublisherSubmit}>
        <input
          value={newPublisherAddress}
          onChange={(e) => setNewPublisherAddress(e.target.value)}
          placeholder="Enter Publisher's Address"
        />
        <input
          value={newPublisherName}
          onChange={(e) => setNewPublisherName(e.target.value)}
          placeholder="Enter Publisher's Name"
        />
        <button type="submit">Register Publisher</button>
      </form>
    </div>
  );
};

export default AdminDashboard;
