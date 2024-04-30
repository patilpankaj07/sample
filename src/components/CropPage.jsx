import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import "../css/crop.css";

const CropPage = () => {
  const [originalImage, setOriginalImage] = useState(null);
  const [showDownloadButton, setShowDownloadButton] = useState(false);
  const [isCropping, setIsCropping] = useState(false);
  const canvasRef = useRef(null);
  const startXRef = useRef(null);
  const startYRef = useRef(null);
  const endXRef = useRef(null);
  const endYRef = useRef(null);

  const cropImage = (inputImage) => {
    const reader = new FileReader();
    reader.onload = function (e) {
      const img = new Image();
      img.onload = function () {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        const width = img.width;
        const height = img.height;

        // Set canvas size to match the image size
        canvas.width = width;
        canvas.height = height;

        // Draw the image on the canvas
        ctx.drawImage(img, 0, 0);

        // Save original image
        setOriginalImage(img);

        // Start cropping
        setIsCropping(true);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(inputImage);
  };

  const handleCropStart = (e) => {
    if (!isCropping) return;
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    startXRef.current = e.clientX - rect.left;
    startYRef.current = e.clientY - rect.top;
  };

  const handleCropMove = (e) => {
    if (!isCropping) return;
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    endXRef.current = e.clientX - rect.left;
    endYRef.current = e.clientY - rect.top;

    drawSelectionRect();
  };

  const handleCropEnd = () => {
    if (!isCropping) return;
    setIsCropping(false);
    setShowDownloadButton(true);
  };

  const drawSelectionRect = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const startX = startXRef.current;
    const startY = startYRef.current;
    const width = endXRef.current - startX;
    const height = endYRef.current - startY;

    // Clear previous selection
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Redraw original image
    ctx.drawImage(originalImage, 0, 0);

    // Draw new selection rectangle
    ctx.strokeStyle = "red";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.rect(startX, startY, width, height);
    ctx.stroke();
  };

  const downloadCroppedImage = () => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (canvasRef.current) {
      const startX = Math.min(startXRef.current, endXRef.current);
      const startY = Math.min(startYRef.current, endYRef.current);
      const width = Math.abs(endXRef.current - startXRef.current);
      const height = Math.abs(endYRef.current - startYRef.current);

      canvas.width = width;
      canvas.height = height;

      ctx.drawImage(
        canvasRef.current,
        startX,
        startY,
        width,
        height,
        0,
        0,
        width,
        height
      );

      // Convert canvas to data URL
      const dataURL = canvas.toDataURL("image/png");

      // Create temporary link element and trigger download
      const link = document.createElement("a");
      link.download = "cropped_image.png";
      link.href = dataURL;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="center">
      <div className="container">
        <h1 className="button" style={{ fontSize: 40 }}>
          Crop Image
        </h1>
        <input
          type="file"
          id="inputImage"
          accept="image/*"
          onChange={(e) => cropImage(e.target.files[0])}
          style={{ fontSize: 15 }}
        />
        <canvas
          ref={canvasRef}
          id="outputCanvas"
          onMouseDown={handleCropStart}
          onMouseMove={handleCropMove}
          onMouseUp={handleCropEnd}
        ></canvas>
        {showDownloadButton && (
          <button className="button" onClick={downloadCroppedImage}>
            Download Cropped Image
          </button>
        )}
        <br />
        <Link className="button" to="/" style={{ fontSize: 20 }}>
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default CropPage;
