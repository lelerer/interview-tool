import React from "react";
import { useLocation } from "react-router-dom";

function AfterInterview() {
  const location = useLocation();
  const { results } = location.state;

  return (
    <div className="p-5">
      <pre>{JSON.stringify(results.text, null, 2)}</pre>
	  
    </div>
  );
}

export default AfterInterview;

