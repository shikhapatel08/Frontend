import { useContext } from "react";
import { FaFilePdf, FaFileWord, FaFileExcel, FaFileAlt, FaFileAudio, FaFileVideo } from "react-icons/fa";
import { ThemeContext } from "../../Context/ThemeContext";
import { FaFilePowerpoint } from "react-icons/fa6";
import ImageMessage from "./ImageMessage";
import "./Attachments.css";

export default function Attachments({ msg }) {

    if (!msg.image_url) return null;

    const { getThemeStyle, theme } = useContext(ThemeContext);

    const files = Array.isArray(msg.image_url)
        ? msg.image_url
        : JSON.parse(msg.image_url);

    const normalizedFiles = files.map(f => {
        if (typeof f === "string") {
            const isBlob = f.startsWith("blob:");

            const extension = !isBlob ? f.split(".").pop().toLowerCase() : "";
            const imageExtensions = ["jpg", "jpeg", "png", "gif", "webp", "svg"];

            return {
                url: f,
                type: isBlob || imageExtensions.includes(extension) ? "image/unknown" : "file/unknown",
                name: f.split("/").pop(),
                extension: isBlob ? "image" : extension
            };
        }
        return f;
    });

    const isImageFile = (file) => {
        if (file.type?.startsWith("image")) return true;
        return file.extension?.match(/\.(jpg|jpeg|png|gif|webp)$/i);
    };

    const images = normalizedFiles.filter(isImageFile);
    const nonImages = normalizedFiles.filter(f => !isImageFile(f));

    const renderFileLink = (file, index) => {
        const isPdf = file.name.match(/\.pdf$/i);
        const isDoc = file.name.match(/\.(doc|docx)$/i);
        const isXls = file.name.match(/\.(xls|xlsx)$/i);
        const isPpt = file.name.match(/\.(ppt|pptx)$/i);
        const isAudio = file.name.match(/\.(mp3|wav|aac|m4a)$/i);
        const isVideo = file.name.match(/\.(mp4|webm|ogg|mov)$/i);

        const getFileIcon = () => {
            if (isPdf) return <FaFilePdf color="#ff4d4f" size={38} />;
            if (isDoc) return <FaFileWord color="#2b579a" size={38} />;
            if (isXls) return <FaFileExcel color="#217346" size={38} />;
            if (isPpt) return <FaFilePowerpoint color="#d24726" size={38} />;
            if (isAudio) return <FaFileAudio color="#722ed1" size={38} />;
            if (isVideo) return <FaFileVideo color="#fa8c16" size={38} />;
            return <FaFileAlt size={38} />;
        };

        if (isVideo) {
            return (
                <video key={index} controls className="chat-video">
                    <source src={file} />
                </video>
            );
        }

        if (isAudio) {
            return (
                <audio key={index} controls className="chat-audio">
                    <source src={file.url} />
                </audio>
            );
        }

        return (
            <a key={index} href={file.url} target="_blank" rel="noreferrer" className="file-box">
                <div className="file-icon">{getFileIcon()}</div>
                <p className="file-name">{file.name.split("/").pop()}</p>
            </a>
        );
    };

    return (
        <div className="attachments-container">
            {images.length > 0 && (
                images.length === 1 ? (
                    <div className="single-image-wrapper">
                        <ImageMessage src={images[0].url} />
                    </div>
                ) : (
                    <div className="multiple-images-grid" data-count={images.length}>
                        {images.map((img, idx) => (
                            <div key={idx} className="attachment-item">
                                <ImageMessage src={img.url} />
                            </div>
                        ))}
                    </div>
                )
            )}

            {nonImages.length > 0 && (
                <div className="non-image-attachments">
                    {nonImages.map((file, index) => (
                        <div key={index} className="attachment-item" style={getThemeStyle(theme)}>
                            {renderFileLink(file, index)}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
