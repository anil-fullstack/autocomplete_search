// src/Autocomplete.js
import React, { useEffect, useRef, useState } from "react";
import "./style.scss";

const Autocomplete = ({ suggestions, setSelectedCard }) => {
  const autocompleteRef = useRef(null);
  const [query, setQuery] = useState("");
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleChange = (e) => {
    const userInput = e.target.value;
    const filtered = suggestions?.filter((suggestion) =>
      suggestion?.summary?.toLowerCase().includes(userInput.toLowerCase())
    );

    filtered.sort((a, b) => {
      const countA = (a.summary.match(new RegExp(userInput, "gi")) || [])
        .length;
      const countB = (b.summary.match(new RegExp(userInput, "gi")) || [])
        .length;
      return countB - countA;
    });

    setQuery(userInput);
    setFilteredSuggestions(filtered);
    setShowSuggestions(true);
  };

  const handleClick = (val) => {
    setQuery("");
    setFilteredSuggestions([]);
    setShowSuggestions(false);

    setSelectedCard((prev) => {
      const duplicate = prev.some((item) => item.id === val.id);
      if (!duplicate) {
        return [val, ...prev];
      } else {
        return prev;
      }
    });
  };

  const handleClickOutside = (event) => {
    if (
      autocompleteRef.current &&
      !autocompleteRef.current.contains(event.target)
    ) {
      setShowSuggestions(false);
      setQuery("");
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const SuggestionsListComponent = () => {
    return filteredSuggestions.length ? (
      <ul className="suggestions">
        {filteredSuggestions.map((suggestion, index) => {
          let className = "";

          return (
            <li
              className={className}
              key={suggestion.id}
              onClick={() => handleClick(suggestion)}
            >
              {suggestion.title}
            </li>
          );
        })}
      </ul>
    ) : (
      <div className="no-suggestions">
        <em>No suggestions available.</em>
      </div>
    );
  };

  return (
    <div className="autocomplete_wrapper" ref={autocompleteRef}>
      <input
        type="text"
        onChange={handleChange}
        // onKeyDown={handleKeyDown}
        value={query}
        className="input_search"
        placeholder="Search..."
      />
      {showSuggestions && query && <SuggestionsListComponent />}
    </div>
  );
};

export default Autocomplete;
