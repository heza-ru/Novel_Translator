import React from "react";

const HistoryList = ({ articles, onArticleClick, onCopyText, copiedText }) => {
  return (
    <div className="flex flex-col gap-1 max-h-60 overflow-y-auto">
      {articles.map((item, index) => (
        <div
          key={`history-item-${index}`} // Using index is okay here as list is append-only for key stability
          onClick={() => onArticleClick(item)}
          className="link_card"
        >
          <div 
            className={`copy_btn ${copiedText === item.sourceText ? 'bg-green-200' : ''}`} 
            onClick={(e) => { e.stopPropagation(); onCopyText(item.sourceText); }} // Stop propagation to prevent article click
            title={copiedText === item.sourceText ? "Copied!" : "Copy Text"}
          >
            <img
              src={copiedText === item.sourceText ? "/tick.svg" : "/copy.svg"}
              alt={copiedText === item.sourceText ? "tick_icon" : "copy_icon"}
              className="w-[40%] h-[40%] object-contain"
            />
          </div>
          <p className="flex-1 font-satoshi text-blue-700 font-medium text-sm truncate">
            {item.sourceText}
          </p>
        </div>
      ))}
    </div>
  );
};

export default HistoryList;
