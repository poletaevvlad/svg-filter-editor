import FilterEditor from "./root.js";
import React from "react";
import ReactDOM from "react-dom";

document.addEventListener("DOMContentLoaded", () => {
  let rootElement = document.getElementById("app_root");
  ReactDOM.render(<FilterEditor />, rootElement);
});

document.addEventListener("mousedown", (e) => {
  // let element = e.target;
  // while (element != null && !(element instanceof HTMLInputElement)){
  // 	element = element.parentElement;
  // }
  // if (element == null){
  // 	// e.preventDefault();
  // }
});
