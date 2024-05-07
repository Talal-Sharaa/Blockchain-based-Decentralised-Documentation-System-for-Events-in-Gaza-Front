import React, { useState, useEffect } from "react";
import { getContract, getProvider } from "../utils/Web3Utils.js";
import ContractABI from "../utils/NewsPlatform.json";

// Material-UI Imports
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

const FavoriteArticles = () => {
  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [contract, setContract] = useState(null);

  useEffect(() => {
    const init = async () => {
      const provider = await getProvider();
      const signer = await provider.getSigner();
      const newsContract = getContract(
        ContractABI.abi,
        "0xEe41A8D2F47A7C950ef20DCe4F1b5AADB1fB535D",
        signer
      );
      setContract(newsContract);
    };
    init();
  }, []);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setIsLoading(true);

        // Call your contract's getFavorites function
        const favoriteArticles = await contract.getFavorites();
        setArticles(favoriteArticles);
      } catch (error) {
        // ... handle the error ...
      } finally {
        setIsLoading(false);
      }
    };

    if (contract) {
      fetchArticles();
    }
  }, [contract]);

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
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default FavoriteArticles;
