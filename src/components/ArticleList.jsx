import React, { useState, useEffect, useCallback } from "react";
import {
  getContract,
  getProvider,
  getArticlesByName,
} from "../utils/Web3Utils.js";
import ContractABI from "../utils/NewsPlatform.json";
import "water.css/out/water.css";
import Article from './Article'; // Import the Article component

const ArticleList = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [publishers, setPublishers] = useState([]);
  const [publisherNameToAddress, setPublisherNameToAddress] = useState({});
  const [selectedPublisher, setSelectedPublisher] = useState(null);
  const [articles, setArticles] = useState([]);

  const fetchPublishers = async () => {
    try {
      const provider = await getProvider();
      const signer = await provider.getSigner();
      const contract = getContract(
        ContractABI.abi,
        "0xf2A3287c00cA86B368AFa7474B1d30366F726163",
        signer
      );

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
      const contract = getContract(
        ContractABI.abi,
        "0xf2A3287c00cA86B368AFa7474B1d30366F726163",
        signer
      );

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

  return (
    <div>
      <h1>News Articles</h1>
      <form onSubmit={handleSubmit}>
        <select
          value={selectedPublisher}
          onChange={(e) => setSelectedPublisher(e.target.value)}
        >
          <option value="">Select Publisher</option>
          {publishers.map((publisher) => (
            <option key={publisher.publisherID} value={publisher.name}>
              {publisher.name}
            </option>
          ))}
        </select>
        <button type="submit">Fetch Articles</button>
      </form>

      {isLoading && <div>Loading Publishers...</div>}
      {articles.map((article) => (
        <Article key={article.id} article={article} /> // Use the Article component
      ))}
    </div>
  );
};

export default ArticleList;