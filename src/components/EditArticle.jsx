import React, { useState, useEffect } from "react";
import { getContract, getProvider } from "../utils/Web3Utils.js";
import ContractABI from "../utils/NewsPlatform.json";

// Material UI imports
import TextField from "@mui/material/TextField";
import TextareaAutosize from "@mui/material/TextareaAutosize";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";

const EditArticle = ({ articleId }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isPublisher, setIsPublisher] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    checkPublisher();
  }, []);

  const checkPublisher = async () => {
    const provider = await getProvider();
    const signer = await provider.getSigner();
    const contract = getContract(
      ContractABI.abi,
      "0xa7b99EF16A5da14aaa98888cdda3228BE329CA07",
      signer
    );

    const article = await contract.getArticle(articleId);
    const currentAccount = await signer.getAddress();
    setIsPublisher(
      currentAccount.toLowerCase() === article.publisherID.toLowerCase()
    );
    setIsLoading(false);
  };

  const updateArticle = async () => {
    const provider = await getProvider();
    const signer = await provider.getSigner();
    const contract = getContract(
      ContractABI.abi,
      "0xa7b99EF16A5da14aaa98888cdda3228BE329CA07",
      signer
    );

    await contract.updateArticle(articleId, title, content);
    setIsEditing(false);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Grid container spacing={2} alignItems="center" justifyContent="center">
      {isPublisher ? (
        isEditing ? (
          <>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextareaAutosize
                minRows={4}
                style={{ width: "100%" }}
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <Button variant="contained" onClick={updateArticle}>
                Update Article
              </Button>
            </Grid>
          </>
        ) : (
          <Grid item xs={12}>
            <Button variant="outlined" onClick={() => setIsEditing(true)}>
              Edit Article
            </Button>
          </Grid>
        )
      ) : (
        <div>You are not the publisher of this article.</div>
      )}
    </Grid>
  );
};

export default EditArticle;
