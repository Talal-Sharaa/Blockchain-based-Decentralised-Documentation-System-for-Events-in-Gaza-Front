import React, { useState} from "react";
import EditArticle from "./EditArticle";
import { getContract, getProvider } from "../utils/Web3Utils.js";
import ContractABI from "../utils/NewsPlatform.json";

const Article = ({ article }) => {
  const [articleHistory, setArticleHistory] = useState(null);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  const fetchArticleHistory = async (articleId) => {
    setIsLoadingHistory(true);
    try {
      const provider = await getProvider();
      const contract = getContract(
        ContractABI.abi,
        "0xa7b99EF16A5da14aaa98888cdda3228BE329CA07",
        provider
      );
      const history = await contract.getArticleHistory(articleId);
      setArticleHistory(history);
    } catch (error) {
      console.error("Error fetching article history:", error);
      // Handle the error appropriately (display an error message)
    } finally {
      setIsLoadingHistory(false);
    }
  };

  return (
    <div>
      <h2>{article.title}</h2>
      <p>{article.content}</p>
      <EditArticle articleId={article.id} />

      <button onClick={() => fetchArticleHistory(article.id)}>
        View Version History
      </button>

      {isLoadingHistory && <div>Loading history...</div>}

      {articleHistory && (
        <div>
          <h2>Version History</h2>
          {articleHistory.map((version) => (
            <div key={version.versionNumber}>
              <h3>Version {version.versionNumber}</h3>
              <h4>{version.title}</h4> {/* Display the title */}
              <p>{version.content}</p> {/* Display the content */}
              <p>Edited by: {version.editorID}</p>
              <p>Timestamp: {version.editTimestamp}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Article;
