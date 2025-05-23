import React from "react";

const ArticleDisplay = ({ isFetching, error, articleSummary, onRetry }) => {
  if (isFetching) {
    return (
      <img src="/loader.svg" alt="loader" className="w-20 h-20 object-contain" />
    );
  }

  if (error) {
    let errorMessage = "An unexpected error occurred. Please try again.";

    if (error.data?.error) {
      errorMessage = error.data.error;
    } else if (error.status) {
      switch (error.status) {
        case 400:
          errorMessage = "Invalid request (400). Please check the URL or input provided.";
          break;
        case 401:
          errorMessage = "Unauthorized (401). You may need to log in or provide credentials.";
          break;
        case 403:
          errorMessage = "Forbidden (403). You do not have permission to access this resource.";
          break;
        case 404:
          errorMessage = "Not Found (404). The requested resource could not be found.";
          break;
        case 429:
          errorMessage = "Too many requests (429). Please try again later.";
          break;
        case "FETCH_ERROR": // Common status for network errors in RTK Query if not caught as specific HTTP codes
          errorMessage = "Network error. Please check your internet connection and try again.";
          break;
        default:
          if (error.status >= 500) {
            errorMessage = `Failed to fetch summary. Server error (${error.status}). Please try again later.`;
          } else {
            errorMessage = `An error occurred (${error.status}). Please try again.`;
          }
      }
    } else if (typeof error.error === 'string' && error.error.includes("NetworkError")) { // Fallback for some network error patterns
        errorMessage = "Network error. Please check your internet connection and try again.";
    }


    return (
      <div className="font-inter text-center text-black">
        <p className="font-bold">Well, that wasn't supposed to happen...</p>
        <span className="font-satoshi font-normal text-gray-700 block mt-2">
          {errorMessage}
        </span>
        {onRetry && (
          <button
            onClick={onRetry}
            className="mt-4 px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
          >
            Retry
          </button>
        )}
      </div>
    );
  }

  if (articleSummary) {
    return (
      <div className="flex flex-col gap-3">
        <h2 className="font-satoshi font-bold text-gray-100 text-xl text-center">
          Excerpt <span className="blue_gradient">Translation</span>
        </h2>
        <div className="summary_box">
          <p className="font-inter font-medium text-sm text-white">
            {articleSummary}
          </p>
        </div>
      </div>
    );
  }

  return null; 
};

export default ArticleDisplay;
