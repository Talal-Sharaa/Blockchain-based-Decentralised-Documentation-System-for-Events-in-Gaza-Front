import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import AdminDashboard from "./components/AdminDashboard";
import ArticleList from "./components/ArticleList";
import SubmitArticle from "./components/SubmitArticle";
import ProtectedRoute from "./components/ProtectedRoute"; // Import your ProtectedRoute component
import { getProvider, getContract, getUserRole } from "./utils/Web3Utils";
import ContractABI from "./utils/NewsPlatform.json";

const App = () => {
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const provider = await getProvider();
        const signer = await provider.getSigner();
        const contract = getContract(
          ContractABI.abi,
          "0xf2A3287c00cA86B368AFa7474B1d30366F726163",
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
  }, []);

  return (
    <Router>
      <NavBar />
      <Routes>
        {/* Home/Default/Guest route */}
        <Route path="/articles" element={<ArticleList />} />

        {/* Protected Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute userRole={userRole} allowedRoles={["ADMIN"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/submit-article"
          element={
            <ProtectedRoute
              userRole={userRole}
              allowedRoles={["ADMIN", "PUBLISHER"]}
            >
              <SubmitArticle />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
