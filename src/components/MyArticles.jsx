import React, { useState, useEffect } from "react";
import { getContract, getProvider } from "../utils/Web3Utils.js";
import ContractABI from "../utils/NewsPlatform.json";
import EditArticle from "./EditArticle";

const MyArticles = () => {
  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    const provider = await getProvider();
    const signer = await provider.getSigner();
    const contract = getContract(
      ContractABI.abi,
      "0xa7b99EF16A5da14aaa98888cdda3228BE329CA07",
      signer
    );

    const currentAccount = await signer.getAddress();
    const allArticles = await contract.getAllArticles(); // Assuming this function exists in the contract

    const myArticles = allArticles.filter(
      (article) =>
        article.publisherID.toLowerCase() === currentAccount.toLowerCase()
    );

    setArticles(myArticles);
    setIsLoading(false);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {articles.map((article) => (
        <div key={article.id}>
          <h2>{article.title}</h2>
          <p>{article.content}</p>
          <EditArticle articleId={article.id} />
        </div>
      ))}
    </div>
  );
};

export default MyArticles;