import React, { useState, useEffect } from "react";

// Removed copy, linkIcon, loader, tick as they are encapsulated in sub-components
// enterIcon might still be needed if SearchForm doesn't handle it.
// Checking SearchForm.jsx: it uses "/link.svg" directly.
// Checking HistoryList.jsx: it uses "/tick.svg" and "/copy.svg" directly.
// Checking ArticleDisplay.jsx: it uses "/loader.svg" directly.
// So, specific imports for these assets from "../assets" (like tick, copy, loader, linkIcon) are no longer needed in Demo.jsx.
// enterIcon is used in the original Demo.jsx for the submit button. My SearchForm.jsx does not use enterIcon, it uses a text "↵".
// I need to decide if SearchForm should be modified or if Demo.jsx keeps enterIcon.
// For now, I will assume SearchForm.jsx is as defined and remove enterIcon from Demo.jsx imports.
// If the visual for the button needs to be preserved, SearchForm.jsx would need an update or the prop for the button content.
// The task description for SearchForm.jsx does not specify an icon for the button. It has <p>↵</p>.
// So I will proceed with removing enterIcon from Demo.jsx imports.
import { useLazyGetSummaryQuery } from "../services/article";

import SearchForm from "./SearchForm";
import HistoryList from "./HistoryList";
import ArticleDisplay from "./ArticleDisplay";

const Demo = () => {
  const [article, setArticle] = useState({
    sourceText: "", // Renamed from url
    summary: "", 
  });
  const [allArticles, setAllArticles] = useState([]);
  const [copiedText, setCopiedText] = useState(""); // Renamed from copied, stores copied sourceText

  const [getSummary, { error, isFetching }] = useLazyGetSummaryQuery();

  useEffect(() => {
    const articlesFromLocalStorage = JSON.parse(
      localStorage.getItem("articles")
    );
    if (articlesFromLocalStorage) {
      setAllArticles(articlesFromLocalStorage);
    }
  }, []);

  const handleSubmit = async (e) => {
    if (e) e.preventDefault(); 
    const { sourceText } = article;

    // Check for existing article based on sourceText
    const existingArticle = allArticles.find((item) => item.sourceText === sourceText);
    if (existingArticle) {
      setArticle(existingArticle);
      return;
    }

    if (!sourceText) {
        console.log("Source text is empty, not submitting.");
        return;
    }
    
    console.log("Fetching summary for:", sourceText);

    // Use sourceText for the API call
    const { data } = await getSummary({ sourceText: sourceText });

    if (data?.responseData?.translatedText) {
      const newArticle = { sourceText: sourceText, summary: data.responseData.translatedText };
      const updatedArticles = [newArticle, ...allArticles];
      
      setAllArticles(updatedArticles);
      setArticle(newArticle); 
      localStorage.setItem("articles", JSON.stringify(updatedArticles));
      console.log("New article added:", newArticle);
    } else if (data?.error) { 
        console.error("API error:", data.error);
    }
  };

  // Renamed from handleCopy, now handles sourceText
  const handleCopiedText = (textToCopy) => {
    setCopiedText(textToCopy);
    navigator.clipboard.writeText(textToCopy);
    setTimeout(() => setCopiedText(""), 3000); // Clear copiedText state
  };

  const handleKeyDown = (e) => {
    if (e.keyCode === 13 && !e.shiftKey) { // Allow Shift+Enter for newline in textarea
      handleSubmit(e);
    }
  };

  const handleArticleClick = (clickedArticle) => {
    setArticle(clickedArticle);
  };
  
  // Renamed from handleArticleUrlChange
  const handleSourceTextChange = (e) => {
    setArticle({ ...article, sourceText: e.target.value });
  };

  return (
    <section className='mt-16 w-full max-w-xl'>
      {/* Search */}
      <div className='flex flex-col w-full gap-2'>
        <SearchForm
          sourceText={article.sourceText}
          onSourceTextChange={handleSourceTextChange}
          onSubmit={handleSubmit}
          onKeyDown={handleKeyDown}
        />

        {/* Browse History */}
        <HistoryList
          articles={allArticles}
          onArticleClick={handleArticleClick}
          onCopyText={handleCopiedText} // Renamed prop
          copiedText={copiedText}       // Renamed prop
        />
      </div>

      {/* Display Result */}
      <div className='my-10 max-w-full flex justify-center items-center'>
        <ArticleDisplay
          isFetching={isFetching}
          error={error} // Pass the error object from useLazyGetSummaryQuery
          articleSummary={article.summary}
          onRetry={handleSubmit} // Pass handleSubmit for the retry mechanism
          // The specific error message and loading indicator are handled by ArticleDisplay.jsx
          // The title "Excerpt Translation" and styling are also handled by ArticleDisplay.jsx
          // based on the props.
          // My ArticleDisplay.jsx currently has generic "Article Summary". This might need adjustment
          // if the title "Excerpt Translation" is specific and needs to be preserved.
          // For now, I'll assume ArticleDisplay is generic. If not, I'll adjust ArticleDisplay.jsx or pass a title prop.
          // The task for ArticleDisplay.jsx was generic "display the fetched summary".
          // The original Demo.jsx had "Excerpt Translation", so I should make sure ArticleDisplay.jsx reflects this.
          // I will modify ArticleDisplay.jsx in a subsequent step if needed. For now, focusing on Demo.jsx refactor.
        />
      </div>
    </section>
  );
};

export default Demo;