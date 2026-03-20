import { useContext } from "react";
import { FaFilePdf, FaFileWord, FaFileExcel, FaFileAlt } from "react-icons/fa";
import { ThemeContext } from "../../Context/ThemeContext";

export default function Attachments({ msg }) {
    if (!msg.image_url) return null;
    const { getThemeStyle, theme } = useContext(ThemeContext);


    const files = typeof msg.image_url === "string" ? JSON.parse(msg.image_url) : msg.image_url;

    return (
        <div className={files.length === 1 ? "single-attachment" : "multiple-attachment"}>
            {files.map((file, index) => {
                const isImage = file.match(/\.(jpg|jpeg|png|gif|webp)$/i);
                const isPdf = file.match(/\.pdf$/i);
                const isDoc = file.match(/\.(doc|docx)$/i);
                const isXls = file.match(/\.(xls|xlsx)$/i);
                const getFileIcon = () => {
                    if (isPdf) return <FaFilePdf color="#ff4d4f" size={38} />;
                    if (isDoc) return <FaFileWord color="#2b579a" size={38} />;
                    if (isXls) return <FaFileExcel color="#217346" size={38} />;
                    return <FaFileAlt size={38} />;
                };
                return (
                    <div key={index} className="attachment-item" style={getThemeStyle(theme)}>
                        {isImage ? (
                            <img src={file} alt="chat" className="chat-image" />
                        ) : (
                            <a href={file} target="_blank" rel="noreferrer" className="file-box">
                                <div className="file-icon">{getFileIcon()}</div>
                                <p className="file-name">{file.split("/").pop()}</p>
                            </a>
                        )}
                    </div>
                );
            })}
        </div>
    );
};
