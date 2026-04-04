import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { GetDocs, GetDocsByChatId } from "../../Redux/Features/MediaSlice";
import { FaFilePdf, FaFileWord, FaFilePowerpoint, FaFileAlt, FaFileAudio } from "react-icons/fa";
import '../Media/Media.css'
import InfiniteScroll from 'react-infinite-scroll-component';
import { DocsSkeleton } from "../../Components/Common Components/Loader/PageSkeletons";

const getFileIcon = (url) => {
    if (url.endsWith(".pdf")) return <FaFilePdf className="pdf" />;
    if (url.endsWith(".doc") || url.endsWith(".docx")) return <FaFileWord className="word" />;
    if (url.endsWith(".ppt") || url.endsWith(".pptx")) return <FaFilePowerpoint className="ppt" />;
    if (url.endsWith(".mp3")) return <FaFileAudio className="mp3" />
    return <FaFileAlt className="default" />;
};

export default function DocsPage({ type, chatId }) {
    const dispatch = useDispatch();
    const { Docs, loading, hasMore, page } = useSelector(state => state.media);

    const fetchDocs = () => {
        if (!hasMore) return;
        if (type === "all") {
            dispatch(GetDocs({ page: page }));
        } else {
            dispatch(GetDocsByChatId({ chatId, page: page }));
        }
    };

    useEffect(() => {
        if (type === "all") {
            dispatch(GetDocs({ page: 1 }));
        } else {
            dispatch(GetDocsByChatId({ chatId, page: 1 }));
        }
    }, []);

    return (
        <div className="Docs">
            <div className="docs-list">
                <div className="Docs">
                    <div className="docs-list">
                        <InfiniteScroll
                            dataLength={Docs.length}
                            next={fetchDocs}
                            hasMore={hasMore}
                            scrollThreshold={0.8}
                            style={{ display: 'flex', flexDirection: 'column' }}
                        >
                            {loading ? (
                                <DocsSkeleton count={6} />
                            ) : (

                                <>
                                    {Docs.length === 0 ? (
                                        <p className="no-links">No Docs found</p>
                                    ) : (
                                        Docs.map((doc) => {
                                            const fileUrl = JSON.parse(doc.image_url)[0];
                                            const fileName = fileUrl.split("/").pop();

                                            return (
                                                <a
                                                    key={doc.id}
                                                    href={fileUrl}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="doc-item"
                                                >
                                                    <div className="doc-icon">
                                                        {getFileIcon(fileUrl)}
                                                    </div>

                                                    <div className="doc-info">
                                                        <p className="doc-name">{fileName}</p>

                                                        <div className="doc-meta">
                                                            <span>
                                                                {new Date(doc.createdAt).toLocaleDateString()}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </a>
                                            );
                                        }))}
                                </>)}
                        </InfiniteScroll>
                    </div>
                </div>
            </div>
        </div>
    )
}