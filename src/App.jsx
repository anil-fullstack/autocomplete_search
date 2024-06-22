import React, { useEffect, useState } from "react";
import SEARCH_DATA from "./constants/search.json";
import Autocomplete from "./components/FormInputs/AutoComplete/AutoComplete";
import ResultContainer from "./components/HomePage/ResultContainer";
import "./App.css";

const App = () => {
  const [selectedCard, setSelectedCard] = useState([]);
  const [autoCompleteData, setAutoCompleteData] = useState([]);

  useEffect(() => {
    if (SEARCH_DATA) {
      setAutoCompleteData(
        SEARCH_DATA?.summaries.map((summary) => ({
          ...summary,
          title: SEARCH_DATA?.titles[summary.id],
          author: SEARCH_DATA?.authors[summary.id]?.author,
          query: SEARCH_DATA?.queries[summary.id],
        }))
      );
    }
  }, []);

  return (
    <div className="container">
      <Autocomplete
        suggestions={autoCompleteData}
        setSelectedCard={setSelectedCard}
      />
      <ResultContainer data={selectedCard} />
    </div>
  );
};

export default App;
