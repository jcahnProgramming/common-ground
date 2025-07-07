// src/components/ToastBanner.tsx
import React from "react";
import { useNavigate } from "react-router-dom";
import "./ToastBanner.css"; // Style this however you'd like

interface ToastBannerProps {
  message: string;
  actionText: string;
  onClick: () => void;
}

const ToastBanner: React.FC<ToastBannerProps> = ({ message, actionText, onClick }) => {
  return (
    <div className="toast-banner">
      <p>{message}</p>
      <button onClick={onClick}>{actionText}</button>
    </div>
  );
};

export default ToastBanner;
