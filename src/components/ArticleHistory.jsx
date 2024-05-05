import React, { useState, useEffect } from "react";
import { getContract, getProvider } from "../utils/Web3Utils.js";
import ContractABI from "../utils/NewsPlatform.json";

const ArticleHistory = ({ articleId }) => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      const provider = await getProvider();
      const signer = await provider.getSigner();
      const contract = getContract(
        ContractABI.abi,
        "0xd552AE9F2FF6C671BCdC4f855a0913FC57788307",
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
    <div>
      {history.map((version, index) => (
        <div key={index}>
          <h2>Version {version.versionNumber}</h2>
          <p>Editor: {version.editorID}</p>
          <p>
            Timestamp:{" "}
            {new Date(Number(version.editTimestamp) * 1000).toLocaleString()}
          </p>
          <p>Article Hash: {version.articleHash}</p>
        </div>
      ))}
    </div>
  );
};

export default ArticleHistory;
