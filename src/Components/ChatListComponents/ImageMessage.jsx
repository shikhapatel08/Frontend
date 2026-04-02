import React from "react";
import { useDispatch } from "react-redux";
import { openPreview } from "../../Redux/Features/ImagePreviewSlice";
import "./ImageMessage.css";

const ImageMessage = ({ src, alt = "Image message" }) => {
  const dispatch = useDispatch();

  const handleImageClick = () => {
    dispatch(openPreview(src));
  };

  return (
    <div className="image-message-container" onClick={handleImageClick}>
      <img src={src} alt={alt} className="image-message-content" />
    </div>
  );
};

export default ImageMessage;
