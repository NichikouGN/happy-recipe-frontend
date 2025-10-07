import React from "react";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();
  return (
    <div>
      NotFound!!! Go back to home page{" "}
      <button
        onClick={() => {
          navigate("/");
        }}
      >
        here
      </button>
    </div>
  );
};

export default NotFound;
