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
        "0xEe41A8D2F47A7C950ef20DCe4F1b5AADB1fB535D",
        signer
      );

      const fetchedHistory = await contract.getArticleHistory(articleId);
      const historyArray = [];
      for (let i = 0; i < fetchedHistory[0].length; i++) {
        historyArray.push({
          versionNumber: fetchedHistory[0][i],
          editorID: fetchedHistory[1][i],
          editTimestamp: fetchedHistory[2][i],
          articleHash: fetchedHistory[3][i],
        });
      }
      setHistory(historyArray);
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
                Article Hash: {version.articleHash}
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
              </>
            }
          />
        </ListItem>
      ))}
    </List>
  );
};

export default ArticleHistory;
