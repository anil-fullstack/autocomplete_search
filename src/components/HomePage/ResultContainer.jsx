import React from "react";
import "./style.scss";

const ResultContainer = ({ data = [] }) => {
  return (
    <div className="result_container">
      {data?.length > 0 ? (
        data.map((item) => (
          <div key={item.id} className="card_wrap">
            <div className="title">{item.title}</div>
            <div className="desc">{item.summary}</div>
            <div className="author">Author: {item.author}</div>
          </div>
        ))
      ) : (
        <div className="no_result">
          Looks like you haven't searched anything.
          <br />
          Please search to show the data.
        </div>
      )}
    </div>
  );
};

export default ResultContainer;
