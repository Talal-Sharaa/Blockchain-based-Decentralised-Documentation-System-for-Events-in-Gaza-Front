import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Navigate from "./NavBar";
import { getProvider, getContract, getUserRole } from "../utils/Web3Utils";
import ContractABI from "../utils/NewsPlatform.json"; // Import your contract's ABI

const ProtectedRoute = ({
  userRole: initialUserRole,
  allowedRoles,
  children,
}) => {
  const [isLoadingRole, setIsLoadingRole] = useState(true);
  const [userRole, setUserRole] = useState(initialUserRole);

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
      } finally {
        setIsLoadingRole(false);
      }
    };

    fetchUserRole();
  }, []);

  if (isLoadingRole) {
    return <div>Loading user role...</div>;
  }

  if (!allowedRoles.includes(userRole)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

ProtectedRoute.propTypes = {
  userRole: PropTypes.string.isRequired,
  allowedRoles: PropTypes.arrayOf(PropTypes.string).isRequired,
  children: PropTypes.node.isRequired,
};

export default ProtectedRoute;
