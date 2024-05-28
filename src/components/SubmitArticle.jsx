import React, { useState, useEffect } from "react";
import { getContract, getProvider } from "../utils/Web3Utils.js";
import ContractABI from "../utils/NewsPlatform.json";
import CircularProgress from "@mui/material/CircularProgress";
import TextField from "@mui/material/TextField";
import TextareaAutosize from "@mui/material/TextareaAutosize";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import "water.css/out/water.css";

const SubmitArticle = () => {
  const [contract, setContract] = useState(null);
  const [provider, setProvider] = useState(null); // Add this line
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    const init = async () => {
      const provider = await getProvider();
      setProvider(provider); // And this line

      // Get the signer
      const signer = await provider.getSigner();

      const newsContract = getContract(
        ContractABI.abi,
        "0x9C49B8001f86Eea9A9C3E94b5236fF8D5141c425",
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
    <Grid container spacing={3} alignItems="center" justifyContent="center">
      {" "}
      {/* Grid for layout */}
      <Grid item xs={12} md={6}>
        {" "}
        {/* Responsive sizing */}
        <h1>Submit New Article</h1>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            {" "}
            {/* Spacing within the form */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                InputLabelProps={{
                  style: {
                    color: isFocused ? "#1976D2" : "#f8f8ff",
                    opacity: isFocused ? "1.0" : "0.2",
                  },
                }}
                inputProps={{
                  style: {
                    color: "#f8f8ff",
                  },
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextareaAutosize
                minRows={4}
                style={{ width: "100%" }}
                placeholder="Enter Article Content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <Button variant="contained" type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <CircularProgress size={24} />
                ) : (
                  "Submit Article"
                )}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Grid>
    </Grid>
  );
};

export default SubmitArticle;
