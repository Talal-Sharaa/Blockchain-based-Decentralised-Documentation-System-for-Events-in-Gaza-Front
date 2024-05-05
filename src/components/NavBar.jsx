import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getProvider, getContract, getUserRole } from "../utils/Web3Utils";
import ContractABI from "../utils/NewsPlatform.json";

const NavBar = () => {
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
  }, [userRole]);

  return (
    <nav>
      <ul>
        {/* Admin Dashboard tab */}
        {userRole === "ADMIN" && (
          <li>
            <Link to="/">Admin Dashboard</Link>
          </li>
        )}

        {/* Article List tab */}
        <li>
          <Link to="/articles">Article List</Link>
        </li>

        {/* Submit Article tab */}
        {(userRole === "ADMIN" || userRole === "PUBLISHER") && (
          <li>
            <Link to="/submit-article">Submit Article</Link>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default NavBar;
