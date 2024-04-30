import React from "react";
import { Link } from "react-router-dom";
import "../css/home.css";
export default function HomePage() {
  return (
    <div className="home-container">
      <h1 style={{ fontSize: 40 }}>Welcome to Image Editor</h1>
      <div className="button-container">
        <Link
          to="/crop"
          className="action-button crop-button"
          style={{ fontSize: 20 }}
        >
          Crop Image
        </Link>
        <Link
          to="/resize"
          className="action-button resize-button"
          style={{ fontSize: 20 }}
        >
          Resize Image
        </Link>
      </div>
    </div>
  );
}
