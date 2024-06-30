import React, { useState, useEffect } from "react";
import { getContract, getProvider } from "../utils/Web3Utils.js";
import ContractABI from "../utils/NewsPlatform.json";
import { Button, TextField, CircularProgress, Box, Grid } from "@mui/material";
import { useContract } from "../utils/ContractContext";

const EditArticle = ({ articleId, isEditing, setIsEditing }) => {
  const [latestArticle, setLatestArticle] = useState(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isPublisher, setIsPublisher] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const contractAddress = useContract();

  useEffect(() => {
    const fetchLatestArticle = async () => {
      const provider = await getProvider();
      const signer = await provider.getSigner();
      const contract = getContract(ContractABI.abi, contractAddress, signer);

      const articleHistory = await contract.getArticleHistory(articleId);
      const latestVersion = articleHistory[articleHistory.length - 1];
      const article = await contract.getArticle(articleId);
      setLatestArticle(latestVersion);
      setTitle(latestVersion.title);
      setContent(latestVersion.content);
      const currentAccount = await signer.getAddress();
      setIsPublisher(
        currentAccount.toLowerCase() === article.publisherID.toLowerCase()
      );
      setIsLoading(false);
    };

    fetchLatestArticle();
  }, [articleId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const provider = await getProvider();
      const signer = await provider.getSigner();
      const contract = getContract(ContractABI.abi, contractAddress, signer);

      const tx = await contract.updateArticle(articleId, title, content);
      await tx.wait();

      setIsLoading(false);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating article:", error);
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "50vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Grid container spacing={2} alignItems="center" justifyContent="center">
      {isPublisher ? (
        isEditing ? (
          <form onSubmit={handleSubmit}>
            <Grid item xs={12}>
              <TextField
                label="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                multiline
                rows={4}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={isLoading}
              >
                {isLoading ? (
                  <CircularProgress size="small" />
                ) : (
                  "Update Article"
                )}
              </Button>
              <Button onClick={() => setIsEditing(false)}>
                Cancel Editing
              </Button>
            </Grid>
          </form>
        ) : (
          <Grid item xs={12}>
            <Button variant="outlined" onClick={() => setIsEditing(true)}>
              Edit Article
            </Button>
          </Grid>
        )
      ) : null}
    </Grid>
  );
};

export default EditArticle;
