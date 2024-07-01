import React, { createContext, useContext, useState } from "react";

const ContractContext = createContext();

export const ContractProvider = ({ children }) => {
  const [contractAddress] = useState(
    "0xFec085762bDF17BD1A78d5051722Ae76d4F8D9D4"
  );

  return (
    <ContractContext.Provider value={contractAddress}>
      {children}
    </ContractContext.Provider>
  );
};

export const useContract = () => {
  return useContext(ContractContext);
};
