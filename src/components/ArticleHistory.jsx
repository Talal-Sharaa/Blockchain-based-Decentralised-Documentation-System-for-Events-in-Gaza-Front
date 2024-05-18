import React, { useState, useEffect } from "react";
import { getContract, getProvider } from "../utils/Web3Utils.js";
import ContractABI from "../utils/NewsPlatform.json";
import {
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Typography,
} from "@mui/material";

const ArticleHistory = ({ articleId }) => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      const provider = await getProvider();
      const signer = await provider.getSigner();
      const contract = getContract(
        ContractABI.abi,
        "0x562aEEb1565bd0d6657104d008fE550CC803B748",
        signer
      );

      const fetchedHistory = await contract.getArticleHistory(articleId);
      setHistory(fetchedHistory);
    };

    fetchHistory();
  }, [articleId]);

  return (
    <List>
      {history.map((version, index) => (
        <ListItem
          key={index}
          secondaryAction={
            <ListItemSecondaryAction>
              <Typography variant="caption" display="block">
              </Typography>
            </ListItemSecondaryAction>
          }
        >
          <ListItemText
            primary={`Version ${version.versionNumber}`}
            secondary={
              <>
                <Typography variant="caption" display="block">
                  Editor: {version.editorID}
                </Typography>
                <Typography variant="caption" display="block">
                  Timestamp:{" "}
                  {new Date(
                    Number(version.editTimestamp) * 1000
                  ).toLocaleString()}
                </Typography>
                <Typography variant="caption" display="block">
                  title: {version.title}
                </Typography>
                <Typography variant="caption" display="block">
                  Content: {version.content}
                </Typography>
              </>
            }
          />
        </ListItem>
      ))}
    </List>
  );
};

export default ArticleHistory;
