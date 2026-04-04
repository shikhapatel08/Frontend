import React from "react";
import { FaFilePdf, FaFileWord, FaFileExcel, FaFileAlt } from "react-icons/fa";

export default function FilePreviewList({ FilePreview, removeSingleFile }) {
    if (!FilePreview || FilePreview.length === 0) return null;

    const getFileIcon = (ext) => {
        if (["pdf"].includes(ext)) return <FaFilePdf color="#ea4335" size={24} />;
        if (["doc", "docx"].includes(ext)) return <FaFileWord color="#4285f4" size={24} />;
        if (["xls", "xlsx"].includes(ext)) return <FaFileExcel color="#34a853" size={24} />;
        return <FaFileAlt color="#70757a" size={24} />;
    };

    return (
        <div className="chat-file-preview-container">
            {FilePreview.map((preview, index) => {

                const previewSrc = preview.url;
                const fileName = preview.name;
                const ext = fileName?.split(".").pop()?.toLowerCase();

                const isImage = preview.type.startsWith("image");

                return (
                    <div key={index} className="preview-wrapper">

                        {isImage ? (
                            <div className="image-card">
                                <img
                                    src={previewSrc}
                                    alt="preview"
                                    style={{
                                        width: "60px",
                                        height: "60px",
                                        objectFit: "cover",
                                        borderRadius: "5px",
                                        border: "1px solid #ddd",
                                    }}
                                />
                                <button
                                    className="remove-file-btn"
                                    onClick={() => removeSingleFile(index)}
                                >
                                    ✕
                                </button>
                            </div>
                        ) : (
                            <div className="file-box-card">
                                <div className="file-icon-box">
                                    {getFileIcon(ext)}
                                </div>
                                <div className="file-info-box">
                                    <p className="file-name-text">{fileName}</p>
                                    <p className="file-ext-text">{ext?.toUpperCase()}</p>
                                </div>
                                <button
                                    className="remove-btn"
                                    onClick={() => removeSingleFile(index)}
                                >
                                    ✕
                                </button>
                            </div>

                        )}
                    </div>
                );
            })}
        </div>
    );
}