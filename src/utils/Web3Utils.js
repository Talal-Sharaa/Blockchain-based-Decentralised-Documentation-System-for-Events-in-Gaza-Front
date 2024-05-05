const ethers = require("ethers");

const getProvider = async () => {
  if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
    const provider = new ethers.BrowserProvider(window.ethereum);
    return provider;
  } else {
    throw new Error("Please install MetaMask or another Ethereum provider.");
  }
};

const getContract = (abi, address, signer) => {
  return new ethers.Contract(address, abi, signer);
};

const submitArticle = async (contract, title, content) => {
  const signer = contract.signer;
  const tx = await signer.submitArticle(title, content);
  await tx.wait();
};

const grantAdminRole = async (contract, address) => {
  const signer = contract.signer;
  const tx = await signer.grantAdminRole(address);
  await tx.wait();
};

const registerPublisher = async (contract, address) => {
  const signer = contract.signer;
  const tx = await signer.registerPublisher(address); // Updated method name based on contract
  await tx.wait();
};

const getArticlesByPublisher = async (contract, publisherAddress) => {
  const articles = await contract.getArticlesByPublisher(publisherAddress);
  return articles;
};

// Import your contract ABI

// Function to determine user's role
const getUserRole = async (contract, userAddress) => {
  if (await contract.isAdmin(userAddress)) {
    return "ADMIN";
  } else if (await contract.isPublisher(userAddress)) {
    return "PUBLISHER";
  } else {
    return "GUEST";
  }
};
const getArticlesByName = async (contract, publisherName) => {
  const articles = await contract.getArticlesByName(publisherName);
  return articles;
};

export {
  getProvider,
  getContract,
  submitArticle,
  grantAdminRole,
  registerPublisher,
  getArticlesByPublisher,
  getUserRole,
  getArticlesByName,
};
