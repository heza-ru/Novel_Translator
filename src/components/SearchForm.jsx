import React from "react";

const SearchForm = ({
  sourceText,
  onSourceTextChange,
  onSubmit,
  onKeyDown,
}) => {
  return (
    <form
      className="relative flex justify-center items-center"
      onSubmit={onSubmit}
    >
      <img
        src="/link.svg" // This icon might be less relevant for text, but we'll keep it for now.
        alt="text-input-icon"
        className="absolute left-0 my-2 ml-3 w-5"
      />
      <textarea
        placeholder="Enter Korean text to translate"
        value={sourceText}
        onChange={onSourceTextChange}
        onKeyDown={onKeyDown}
        required
        className="url_input peer" // Re-use existing styling, add rows for height
        rows={3} 
      />
      <button
        type="submit"
        className="submit_btn peer-focus:border-gray-700 peer-focus:text-gray-700"
      >
        <p>↵</p>
      </button>
    </form>
  );
};

export default SearchForm;
