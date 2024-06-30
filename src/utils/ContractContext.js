import React, { createContext, useContext, useState } from "react";

const ContractContext = createContext();

export const ContractProvider = ({ children }) => {
  const [contractAddress] = useState(
    "0xDa1d59f5A4F7878162aaAc07A2CaF5Da0202D2E1"
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
