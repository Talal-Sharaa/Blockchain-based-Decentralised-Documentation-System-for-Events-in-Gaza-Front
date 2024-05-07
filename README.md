

## Blockchain-based Decentralised Documentation System for Events in Gaza

This project is a decentralized news platform built with React and Ethereum. It allows users to submit articles which are then stored on the Ethereum blockchain. The project uses the Material UI library for the user interface and the ethers.js library to interact with the Ethereum blockchain.

## Features

 - Admin Dashboard to add admins and publishers
 - Submit articles to the Ethereum blockchain
 - View submitted articles
 - View Edited Articles Versions and History
 - Add articles to favorites
 - Role-Based navigation and protection 
 - Responsive design

## Installation

To install the project, follow these steps:

 - Clone the repository: 
 `git clone https://github.com/Talal-Sharaa/Blockchain-based-Decentralised-Documentation-System-for-Events-in-Gaza-Front.git`
 
 - Install the dependencies:
  `cd Blockchain-based-Decentralised-Documentation-System-for-Events-in-Gaza-Front
  npm  install`

Usage
To start the project, run:

    npm start

The application will start on http://localhost:3000.

## Components

This project leverages several key React components to provide a decentralized article publishing platform built on the Ethereum blockchain. Here's a breakdown:

-   **SubmitArticle.jsx:** Enables users to submit new articles with title and content fields. Submissions are securely stored on the Ethereum blockchain.
-   **AdminDashboard.jsx:** Provides administrative controls, including:
    
    -   **Admin Role Assignment:** Grants admin privileges to other users.
    -   **Publisher Registration:** Registers new article publishers.
    -   **UI:** Built with Material UI components for a polished look.
    -   **State Management** Streamlined with React's `useState` and `useEffect` hooks.
    
-   **Article.jsx:** Renders individual articles with the following features:
    
    -   Title and content display
    -   Editing capability
    -   Version history access (retrieved directly from the blockchain)
    -   "Favorite" functionality
    -   Polished UI using Material UI
    -   Efficient state management with `useState` and `useEffect`
    
-   **ArticleHistory.jsx:** Displays a comprehensive edit history for each article, including:
    
    -   Version number
    -   Editor ID
    -   Timestamp
    -   Article hash (for content integrity verification)
    -   Data sourced from the Ethereum blockchain
    -   User-friendly UI powered by Material UI
    -   Streamlined state management with `useState` and `useEffect`
    
-   **ArticleList.jsx:** Presents a grid-based list of articles, dynamically fetched from the Ethereum blockchain. Employs `useState`,  `useEffect`, and `useCallback` hooks for optimized state management and rendering. Material UI ensures a consistent visual experience.
-   **EditArticle.jsx:** Facilitates article updates by their publishers (title and content). Seamlessly updates the blockchain and uses Material UI for a clean interface. Relies on `useState` and `useEffect` for state.
-   **FavoriteArticles.jsx:** Shows a grid of articles marked as favorites by the user, retrieved directly from the blockchain. Leverages Material UI and React's state management hooks.
-   **MyArticles.jsx:** Displays a filtered grid of articles authored by the current user. Filtering is based on publisher ID, and the data originates from the blockchain. Material UI and state management hooks are used.

**SubmitArticle.jsx:** This component allows users to submit articles. It includes form fields for the article title and content. When the form is submitted, the article is sent to the Ethereum blockchain.

License
This project is licensed under the MIT License.
