import React, { useState, useEffect } from "react";
import {
  getContract,
  getProvider,
} from "../utils/Web3Utils.js";
import ContractABI from "../utils/NewsPlatform.json"; // Import your contract's ABI
import CircularProgress from "@mui/material/CircularProgress";
import 'water.css/out/water.css';

const SubmitArticle = () => {
  const [contract, setContract] = useState(null);
  const [provider, setProvider] = useState(null); // Add this line
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const init = async () => {
      const provider = await getProvider();
      setProvider(provider); // And this line

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

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const tx = await contract.submitArticle(title, content);
      const receipt = await tx.wait();
      const blockNumber = receipt.blockNumber;
      const block = await provider.getBlock(blockNumber);
      console.log(block);

      alert("Article submitted successfully!");
      setTitle("");
      setContent("");
    } catch (error) {
      console.error("Error submitting article:", error);
      alert("Failed to submit article.");
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div>
      <h1>Submit New Article</h1>
      <form onSubmit={handleSubmit}>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter Article Title"
          required
        />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Enter Article Content"
          required
        />
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? <CircularProgress size={24} /> : "Submit Article"}
        </button>
      </form>
    </div>
  );
};

export default SubmitArticle;
