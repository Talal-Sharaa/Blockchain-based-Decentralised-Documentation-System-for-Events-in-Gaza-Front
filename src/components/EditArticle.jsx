import React, { useState } from "react";
import { getContract, getProvider } from "../utils/Web3Utils.js";
import ContractABI from "../utils/NewsPlatform.json";

const EditArticle = ({ articleId }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const updateArticle = async () => {
    const provider = await getProvider();
    const signer = await provider.getSigner();
    const contract = getContract(
      ContractABI.abi,
      "0xf2A3287c00cA86B368AFa7474B1d30366F726163",
      signer
    );

    await contract.updateArticle(articleId, title, content);
  };

  return (
    <div>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea value={content} onChange={(e) => setContent(e.target.value)} />
      <button onClick={updateArticle}>Update Article</button>
    </div>
  );
};

export default EditArticle;
