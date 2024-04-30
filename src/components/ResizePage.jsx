import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import "../css/resize.css";

function ResizePage() {
  const [originalImage, setOriginalImage] = useState(null);
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const canvasRef = useRef(null);

  const performResize = () => {
    if (!originalImage) {
      alert("Please select an image.");
      return;
    }

    const newWidth = parseInt(width);
    const newHeight = parseInt(height);

    if (
      newWidth <= 0 ||
      newHeight <= 0 ||
      isNaN(newWidth) ||
      isNaN(newHeight)
    ) {
      alert("Please enter valid width and height.");
      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    canvas.width = newWidth;
    canvas.height = newHeight;
    ctx.drawImage(originalImage, 0, 0, newWidth, newHeight);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = function (event) {
      const img = new Image();
      img.onload = function () {
        setOriginalImage(img);
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const downloadImage = () => {
    const canvas = canvasRef.current;
    const link = document.createElement("a");

    if (canvas) {
      link.download = "edited_image.png";
      link.href = canvas
        .toDataURL("image/png")
        .replace("image/png", "image/octet-stream");
      link.click();
    }
  };

  return (
    <div className="container">
      <h1 style={{ fontSize: 40 }}>Resize Image</h1>
      <input
        type="file"
        id="inputImage"
        accept="image/*"
        onChange={handleImageChange}
        style={{ fontSize: 15 }}
      />
      <br />
      <label htmlFor="width" id="widthLabel" style={{ fontSize: 15 }}>
        Width:
      </label>
      <input
        type="number"
        id="width"
        placeholder="Width in pixels"
        value={width}
        onChange={(e) => setWidth(e.target.value)}
      />
      <br />
      <label htmlFor="height" id="heightLabel" style={{ fontSize: 15 }}>
        Height:
      </label>
      <input
        type="number"
        id="height"
        placeholder="Height in pixels"
        value={height}
        onChange={(e) => setHeight(e.target.value)}
      />
      <br />
      <button onClick={performResize} style={{ fontSize: 15 }}>
        Resize Image
      </button>
      <br />
      <canvas ref={canvasRef} id="outputCanvas"></canvas>
      <br />
      <button id="downloadButton" onClick={downloadImage}>
        Download Image
      </button>
      <br />
      <Link to="/" style={{ fontSize: 20 }}>
        Back to Home
      </Link>
    </div>
  );
}

export default ResizePage;
