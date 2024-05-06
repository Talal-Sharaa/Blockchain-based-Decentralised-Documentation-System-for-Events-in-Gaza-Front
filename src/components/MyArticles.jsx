import React, { useState, useEffect } from "react";
import { getContract, getProvider } from "../utils/Web3Utils.js";
import ContractABI from "../utils/NewsPlatform.json";
import EditArticle from "./EditArticle"; // Assuming you have the revamped EditArticle

// Material-UI Imports
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import { margin } from "@mui/system";

const MyArticles = () => {
  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    const provider = await getProvider();
    const signer = await provider.getSigner();
    const contract = getContract(
      ContractABI.abi,
      "0xa7b99EF16A5da14aaa98888cdda3228BE329CA07",
      signer
    );

    const currentAccount = await signer.getAddress();
    const allArticles = await contract.getAllArticles(); // Assuming this function exists in the contract

    const myArticles = allArticles.filter(
      (article) =>
        article.publisherID.toLowerCase() === currentAccount.toLowerCase()
    );

    setArticles(myArticles);
    setIsLoading(false);
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
    <Grid container spacing={3} style={{ marginTop: "1vh" }}>
      {articles.map((article) => (
        <Grid item xs={12} sm={6} md={4} key={article.id}>
          <Card>
            <CardHeader title={article.title} />
            <CardContent>
              <Typography variant="body2">{article.content}</Typography>
              <EditArticle articleId={article.id} />
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default MyArticles;
