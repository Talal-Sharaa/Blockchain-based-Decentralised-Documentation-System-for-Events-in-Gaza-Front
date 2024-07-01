import React, { useState, useEffect, useCallback } from "react";
import {
  getContract,
  getProvider,
  getArticlesByName,
} from "../utils/Web3Utils.js";
import { useContract } from "../utils/ContractContext";
import ContractABI from "../utils/NewsPlatform.json";
import "water.css/out/dark.css";
import Article from "./Article"; // Import the Article component

// Import Material-UI components
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CircularProgress from "@mui/material/CircularProgress";

const ArticleList = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [publishers, setPublishers] = useState([]);
  const [publisherNameToAddress, setPublisherNameToAddress] = useState({});
  const [selectedPublisher, setSelectedPublisher] = useState(null);
  const [articles, setArticles] = useState([]);
  const [contract, setContract] = useState(null);
  const contractAddress = useContract();

  const fetchPublishers = async () => {
    try {
      const provider = await getProvider();
      const signer = await provider.getSigner();
      const contract = getContract(ContractABI.abi, contractAddress, signer);

      const fetchedPublishers = await contract.getAllPublishers();
      setIsLoading(true);

      const publishersWithNames = await Promise.all(
        fetchedPublishers.map(async (publisher) => {
          const name = await contract.publisherNames(publisher.publisherID);
          return { ...publisher, name }; // Add the name to the publisher object
        })
      );

      // Create a mapping of publisher names to addresses
      const mapping = {};
      publishersWithNames.forEach((publisher) => {
        mapping[publisher.name] = publisher.publisherID;
      });

      setPublisherNameToAddress(mapping);
      setPublishers(publishersWithNames); // Store the publishers with their names
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching publishers:", error);
    }
  };
  const fetchArticles = useCallback(async () => {
    try {
      if (!selectedPublisher) return; // Handle the case where no publisher is selected

      const provider = await getProvider();
      const signer = await provider.getSigner();
      const contract = getContract(ContractABI.abi, contractAddress, signer);

      const fetchedArticles = await getArticlesByName(
        contract,
        selectedPublisher
      );
      setArticles(fetchedArticles);
    } catch (error) {
      console.error("Error fetching articles:", error);
    }
  }, [selectedPublisher]);
  useEffect(() => {
    fetchPublishers();
  }, []);

  useEffect(() => {
    if (Object.keys(publisherNameToAddress).length > 0 && selectedPublisher) {
      fetchArticles();
    }
  }, [publisherNameToAddress, selectedPublisher, fetchArticles]);

  const handleSubmit = (event) => {
    event.preventDefault();
  };
  useEffect(() => {
    if (publishers.length > 0 && selectedPublisher) {
      fetchArticles();
    }
  }, [publishers, selectedPublisher, fetchArticles]);

  useEffect(() => {
    const init = async () => {
      const provider = await getProvider();
      const contract = getContract(
        ContractABI.abi,
        contractAddress,
        provider // No need for signer here
      );

      // Listen for ArticleUpdated event
      const listener = (articleId) => {
        console.log("ArticleUpdated event received for article:", articleId);
        fetchArticles(); // Refetch articles on update
      };

      contract.on("ArticleUpdated", listener);

      // Cleanup event listener
      return () => {
        contract.off("ArticleUpdated", listener);
      };
    };

    init();
  }, [fetchArticles]);
  return (
    <Box sx={{ p: 2 }}>
      {" "}
      {/* Container with padding */}
      <Typography variant="h4" gutterBottom>
        News Articles
      </Typography>
      <FormControl fullWidth sx={{ mb: 2 }}>
        {" "}
        {/* Form for publisher selection */}
        <InputLabel
          id="publisher-select-label"
          style={{ color: "#F5F5F5", opacity: "0.2" }}
        >
          Select Publisher
        </InputLabel>
        <Select
          labelId="publisher-select-label"
          value={selectedPublisher || ""} // Handle empty value
          onChange={(e) => setSelectedPublisher(e.target.value)}
          label="Select Publisher"
          sx={{ color: "#f5f5f5" }} // off white color
        >
          {publishers.map((publisher) => (
            <MenuItem key={publisher.publisherID} value={publisher.name}>
              {publisher.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      {isLoading ? (
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {" "}
          {/* Grid layout for articles */}
          {articles.map((article) => (
            <Grid item xs={12} sm={12} md={6} key={article.id}>
              <Card>
                <CardContent>
                  <Article article={article} />{" "}
                  {/* Use the Article component */}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default ArticleList;
