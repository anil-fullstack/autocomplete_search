import React from "react";
import "./style.scss";

const ResultContainer = ({ data = [] }) => {
  return (
    <div className="result_container">
      {data?.length > 0 &&
        data.map((item) => (
          <div key={item.id} className="card_wrap">
            <div className="title">{item.title}</div>
            <div className="desc">{item.summary}</div>
            <div className="author">Author: {item.author}</div>
          </div>
        ))}
    </div>
  );
};

export default ResultContainer;
