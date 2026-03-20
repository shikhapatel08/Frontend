import React from "react";
import { FaFilePdf, FaFileWord, FaFileExcel, FaFileAlt } from "react-icons/fa";

export default function FilePreviewList({ FilePreview, removeSingleFile }) {
    if (!FilePreview || FilePreview.length === 0) return null;

    const getFileIcon = (ext) => {
        if (["pdf"].includes(ext)) return <FaFilePdf color="#ff4d4f" size={38} />;
        if (["doc", "docx"].includes(ext)) return <FaFileWord color="#2b579a" size={38} />;
        if (["xls", "xlsx"].includes(ext)) return <FaFileExcel color="#217346" size={38} />;
        return <FaFileAlt size={38} />;
    };

    return (

        <div className="chat-file-preview">
            {FilePreview.map((preview, index) => {
                const ext = typeof preview === "string"
                    ? preview.split(".").pop().toLowerCase()
                    : preview.name?.split(".").pop().toLowerCase();
                const isImage = ["jpg", "jpeg", "png", "gif", "webp"].includes(ext);
                const isPdf = ext === "pdf";

                const previewSrc = typeof preview === "string" ? preview : URL.createObjectURL(preview);

                return (
                    <div key={index} className="preview-wrapper">
                        {isImage ? (
                            <img src={previewSrc} alt="preview" />
                        ) : isPdf ? (
                            <embed src={previewSrc} type="application/pdf" width="100%" height="100px" />
                        ) : (
                            <a href={previewSrc} target="_blank" rel="noreferrer" className="file-box">
                                <div className="file-icon">{getFileIcon(ext)}</div>
                                <p className="file-name">{typeof preview === "string" ? preview.split("/").pop() : preview.name}</p>
                            </a>
                        )}
                        <button className="remove-file-btn" onClick={() => removeSingleFile(index)}>✕</button>
                    </div>
                );
            })}
        </div>
    );
}