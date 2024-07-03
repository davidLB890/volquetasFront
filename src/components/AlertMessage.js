// components/AlertMessage.jsx
import React from "react";

const AlertMessage = ({ type, message }) => {
  if (!message) return null;

  const alertClass = type === "error" ? "alert-danger" : "alert-success";

  return (
    <div className={`alert ${alertClass} text-center`} role="alert">
      {message}
    </div>
  );
};

export default AlertMessage;
