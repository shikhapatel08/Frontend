import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { closePreview } from "../../Redux/Features/ImagePreviewSlice";
import { FaTimes, FaSearchPlus, FaSearchMinus } from "react-icons/fa";
import "./ImagePreviewModal.css";

const ImagePreviewModal = () => {
  const dispatch = useDispatch();
  const { isOpen, imageUrl } = useSelector((state) => state.imagePreview);
  const [scale, setScale] = useState(1);

  if (!isOpen) return null;

  const handleClose = () => {
    dispatch(closePreview());
    setScale(1);
  };

  const zoomIn = (e) => {
    e.stopPropagation();
    setScale((prev) => Math.min(prev + 0.2, 3));
  };

  const zoomOut = (e) => {
    e.stopPropagation();
    setScale((prev) => Math.max(prev - 0.2, 0.5));
  };

  return (
    <div className="image-preview-overlay" onClick={handleClose}>
      <div className="image-preview-header">
        <div className="zoom-controls">
          <button className="zoom-btn" onClick={zoomIn} title="Zoom In">
            <FaSearchPlus />
          </button>
          <button className="zoom-btn" onClick={zoomOut} title="Zoom Out">
            <FaSearchMinus />
          </button>
        </div>
        <button className="close-btn" onClick={handleClose}>
          <FaTimes />
        </button>
      </div>
      <div className="image-preview-content" onClick={(e) => e.stopPropagation()}>
        <img
          src={imageUrl}
          alt="Preview"
          style={{ transform: `scale(${scale})` }}
          className="preview-image"
        />
      </div>
    </div>
  );
};

export default ImagePreviewModal;
