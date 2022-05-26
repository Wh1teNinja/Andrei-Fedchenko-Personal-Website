import { useEffect, useReducer, useState } from "react";
import "../styles/Loading.css";
import LoadingIcon from "../images/icons/Loading.svg";

function reducer(state) {
  switch(state.length) {
    case 1:
      return "..";
    case 2:
      return "...";
    default:
      return "."; 
  }
}

function Loading() {
  const [ellipsis, updateEllipsis] = useReducer(reducer, ".");
  const [intervalCode, setIntervalCode] = useState(0);

  useEffect(() => {
    if (intervalCode) return;

    setIntervalCode(setInterval(() => {
      updateEllipsis();
    }, 500));

    return clearInterval(intervalCode);
  }, [intervalCode]);

  return (
    <div className="Loading">
      <img src={LoadingIcon} alt="loading" className="Loading-icon"/>
      <span className="Loading-text">Loading{ellipsis}</span>
    </div>
  );
}

export default Loading;
