import React, { useState, useEffect } from "react";
import { getContract, getProvider } from "../utils/Web3Utils.js";
import ContractABI from "../utils/NewsPlatform.json";

const EditArticle = ({ articleId }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isPublisher, setIsPublisher] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    checkPublisher();
  }, []);

  const checkPublisher = async () => {
    const provider = await getProvider();
    const signer = await provider.getSigner();
    const contract = getContract(
      ContractABI.abi,
      "0xd552AE9F2FF6C671BCdC4f855a0913FC57788307",
      signer
    );

    const article = await contract.getArticle(articleId);
    const currentAccount = await signer.getAddress();
    setIsPublisher(currentAccount.toLowerCase() === article.publisherID.toLowerCase());
    setIsLoading(false);
  };

  const updateArticle = async () => {
    const provider = await getProvider();
    const signer = await provider.getSigner();
    const contract = getContract(
      ContractABI.abi,
      "0xd552AE9F2FF6C671BCdC4f855a0913FC57788307",
      signer
    );

    await contract.updateArticle(articleId, title, content);
    setIsEditing(false);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    isPublisher ? (
      isEditing ? (
        <div>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea value={content} onChange={(e) => setContent(e.target.value)} />
          <button onClick={updateArticle}>Update Article</button>
        </div>
      ) : (
        <button onClick={() => setIsEditing(true)}>Edit Article</button>
      )
    ) : (
      <div>You are not the publisher of this article.</div>
    )
  );
};

export default EditArticle;