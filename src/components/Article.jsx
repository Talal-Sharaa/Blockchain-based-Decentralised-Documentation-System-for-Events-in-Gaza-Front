import React, { useState, useEffect } from "react";
import EditArticle from "./EditArticle";
import { getContract, getProvider } from "../utils/Web3Utils.js";
import ContractABI from "../utils/NewsPlatform.json";
import { useContract } from "../utils/ContractContext";
import {
  Button,
  Card,
  CardContent,
  CardActions,
  Typography,
  CircularProgress,
} from "@mui/material";
import FavoriteButton from "./FavoriteButton";

const Article = ({ article }) => {
  const [articleHistory, setArticleHistory] = useState(null);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isPublisher, setIsPublisher] = useState(false);
  const contractAddress = useContract();

  const fetchArticleHistory = async (articleId) => {
    setIsLoadingHistory(true);
    try {
      const provider = await getProvider();
      const contract = getContract(ContractABI.abi, contractAddress, provider);
      const history = await contract.getArticleHistory(articleId);
      setArticleHistory(history);
    } catch (error) {
      console.error("Error fetching article history:", error);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  useEffect(() => {
    const checkPublisher = async () => {
      const provider = await getProvider();
      const signer = await provider.getSigner();
      const currentAccount = await signer.getAddress();

      setIsPublisher(
        currentAccount.toLowerCase() === article.publisherID.toLowerCase()
      );
    };
    checkPublisher();
  }, [article.publisherID]);

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" gutterBottom sx={{ color: "black" }}>
          {article.title}
        </Typography>
        <Typography variant="body2" component="p">
          {article.content}
        </Typography>
      </CardContent>
      <CardActions sx={{ display: "flex", justifyContent: "space-between" }}>
        {isPublisher && (
          <EditArticle
            articleId={article.id}
            isEditing={isEditing}
            setIsEditing={setIsEditing}
          />
        )}
        <div style={{ width: "100%" }}>
          <Button
            variant="contained"
            onClick={() => fetchArticleHistory(article.id)}
            disabled={isLoadingHistory}
          >
            {isLoadingHistory ? (
              <CircularProgress size="small" />
            ) : (
              "View Version History"
            )}
          </Button>
          <FavoriteButton articleId={article.id} />
        </div>
      </CardActions>

      {articleHistory && (
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Version History
          </Typography>
          {articleHistory.map((version) => (
            <div key={version.versionNumber}>
              <Typography variant="subtitle1" gutterBottom>
                Version {version.versionNumber}
              </Typography>
              <Typography variant="body2" gutterBottom>
                {version.title}
              </Typography>
              <Typography variant="body2" component="p">
                {version.content}
              </Typography>
              <Typography variant="caption" display="block">
                Edited by: {version.editorID}
              </Typography>
              <Typography variant="caption" display="block">
                Timestamp: {version.editTimestamp}
              </Typography>
            </div>
          ))}
        </CardContent>
      )}
    </Card>
  );
};

export default Article;
