// src/Autocomplete.js
import React, { useEffect, useRef, useState } from "react";
import "./style.scss";
import { debounce } from "../../../utils/common";

const Autocomplete = ({ suggestions, setSelectedCard }) => {
  const autocompleteRef = useRef(null);
  const [query, setQuery] = useState("");
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const debouncedFunction = debounce((newQuery) => {
    setFilteredSuggestions(newQuery);
  }, 500);

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
    debouncedFunction(filtered);
  };

  useEffect(() => {
    if (filteredSuggestions.length > 0) setShowSuggestions(true);
  }, [filteredSuggestions]);

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
    const [page, setPage] = useState(1);
    const [isScrollLoading, setLoadingScrollData] = useState("");
    const listRef = useRef(null);
    const totalPages = Math.ceil(filteredSuggestions?.length / 10);

    useEffect(() => {
      const handleScroll = () => {
        const list = listRef.current;
        if (list && list.scrollTop + list.clientHeight >= list.scrollHeight) {
          loadMoreSuggestions();
        }
      };

      const list = listRef.current;
      if (list) {
        list.addEventListener("scroll", handleScroll);
      }
      return () => {
        if (list) {
          list.removeEventListener("scroll", handleScroll);
        }
      };
    }, [page]);

    const loadMoreSuggestions = async () => {
      if (page <= totalPages) {
        setLoadingScrollData("Loading...");
        setTimeout(() => {
          setPage(page + 1);
          setLoadingScrollData("");
        }, 2000);
      }
    };

    return filteredSuggestions.length ? (
      <ul className="suggestions" ref={listRef}>
        {filteredSuggestions.slice(0, page * 10).map((suggestion, index) => {
          let className = "select_list";

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
        {isScrollLoading && (
          <li className="scroll_loading">{isScrollLoading}</li>
        )}
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
