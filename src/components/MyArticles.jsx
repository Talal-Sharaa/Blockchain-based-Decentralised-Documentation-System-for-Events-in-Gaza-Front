import React, { useState, useEffect } from "react";
import { getContract, getProvider } from "../utils/Web3Utils.js";
import ContractABI from "../utils/NewsPlatform.json";
import EditArticle from "./EditArticle";
import FavoriteArticles from "./FavoriteArticles";
import ArticleHistory from "./ArticleHistory";
import {
  AppBar,
  Tabs,
  Tab,
  Grid,
  Card,
  CardHeader,
  CardContent,
  Typography,
  CircularProgress,
  Box,
  Button,
} from "@mui/material";

const MyArticles = () => {
  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [contract, setContract] = useState(null);
  const [showHistory, setShowHistory] = useState(null);
  const [tabIndex, setTabIndex] = useState(0); // State to track the selected tab
  const [isEditing, setIsEditing] = useState(false);

  const fetchArticles = async () => {
    const provider = await getProvider();
    const signer = await provider.getSigner();
    const contract = getContract(
      ContractABI.abi,
      "0x9d3A330c215936254C5Ac5De78c1e98f6eB1BfF5",
      signer
    );

    const currentAccount = await signer.getAddress();
    const allArticles = await contract.getAllArticles();

    const myArticles = allArticles.filter(
      (article) =>
        article.publisherID.toLowerCase() === currentAccount.toLowerCase()
    );

    setArticles(myArticles);
    setIsLoading(false);
  };

  useEffect(() => {
    let isMounted = true;

    const init = async () => {
      const provider = await getProvider();
      const signer = await provider.getSigner();
      const newsContract = getContract(
        ContractABI.abi,
        "0x9d3A330c215936254C5Ac5De78c1e98f6eB1BfF5",
        signer
      );
      setContract(newsContract);

      await fetchArticles();

      if (isMounted) {
        const currentAccount = await signer.getAddress();

        newsContract.on("ArticleSubmitted", (publisher, articleId) => {
          if (
            isMounted &&
            publisher.toLowerCase() === currentAccount.toLowerCase()
          ) {
            fetchArticles();
          }
        });

        newsContract.on("ArticleUpdated", (articleId) => {
          if (isMounted) {
            fetchArticles();
          }
        });
      }
    };

    init();

    return () => {
      isMounted = false;
      if (contract) {
        contract.removeAllListeners("ArticleSubmitted");
        contract.removeAllListeners("ArticleUpdated");
      }
    };
  }, [contract]);

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
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
    <Box>
      <AppBar position="static">
        <Tabs value={tabIndex} onChange={handleTabChange}>
          <Tab label="My Articles" />
          <Tab label="Favorite Articles" />
        </Tabs>
      </AppBar>
      {tabIndex === 0 && (
        <Grid container spacing={3} style={{ marginTop: "1vh" }}>
          {articles.map((article) => (
            <Grid item xs={12} sm={6} md={4} key={article.id}>
              <Card>
                <CardHeader title={article.title} />
                <CardContent>
                  <Typography variant="body2">{article.content}</Typography>
                  {isEditing ? <EditArticle articleId={article.id} /> : null}
                  <button onClick={() => setIsEditing(!isEditing)}>
                    {isEditing ? "Cancel Editing" : "Edit Article"}
                  </button>{" "}
                  <Button onClick={() => setShowHistory(article.id)}>
                    View History
                  </Button>
                  {showHistory === article.id && (
                    <ArticleHistory articleId={article.id} />
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
      {tabIndex === 1 && <FavoriteArticles />}
    </Box>
  );
};

export default MyArticles;
