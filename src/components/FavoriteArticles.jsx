import React, { useState, useEffect } from "react";
import { getContract, getProvider } from "../utils/Web3Utils.js";
import ContractABI from "../utils/NewsPlatform.json";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import ArticleHistory from "./ArticleHistory"; // Import the ArticleHistory component

const FavoriteArticles = () => {
  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [contract, setContract] = useState(null);
  const [selectedArticleId, setSelectedArticleId] = useState(null); // State to track selected article for history

  useEffect(() => {
    const init = async () => {
      const provider = await getProvider();
      const signer = await provider.getSigner();
      const newsContract = getContract(
        ContractABI.abi,
        "0x9d3A330c215936254C5Ac5De78c1e98f6eB1BfF5",
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
        const favoriteArticles = await contract.getFavorites();
        setArticles(favoriteArticles);
      } catch (error) {
        // Handle the error
      } finally {
        setIsLoading(false);
      }
    };

    if (contract) {
      fetchArticles();
    }
  }, [contract]);

  const handleViewHistory = (articleId) => {
    setSelectedArticleId(articleId);
  };

  return (
    <Box>
      {isLoading ? (
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
      ) : (
        <Grid container spacing={3} style={{ marginTop: "1vh" }}>
          {articles.map((article) => (
            <Grid item xs={12} sm={6} md={4} key={article.id}>
              <Card>
                <CardHeader title={article.title} />
                <CardContent>
                  <Typography variant="body2">{article.content}</Typography>
                  <Button
                    variant="outlined"
                    onClick={() => handleViewHistory(article.id)}
                  >
                    See Versions History
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
      {selectedArticleId && (
        <Box mt={4}>
          <Typography variant="h6">Article Versions History</Typography>
          <ArticleHistory articleId={selectedArticleId} />
        </Box>
      )}
    </Box>
  );
};

export default FavoriteArticles;
