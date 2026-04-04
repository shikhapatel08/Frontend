import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux"
import { GetLinks, GetLinksByChatId, resetMediaState } from "../../Redux/Features/MediaSlice";
import { FaLink } from "react-icons/fa";
import '../Media/Media.css'
import InfiniteScroll from 'react-infinite-scroll-component';
import { LinksSkeleton } from "../../Components/Common Components/Loader/PageSkeletons";

export default function LinkPage({ type, chatId }) {
    const dispatch = useDispatch();
    const { Links, loading, page, hasMore } = useSelector(state => state.media);


    const fetchLinks = () => {
        if (!hasMore) return;
        if (type === "all") {
            dispatch(GetLinks({ page: page }));
        } else {
            dispatch(GetLinksByChatId({ chatId, page: page }));
        }
    };

    useEffect(() => {
        dispatch(resetMediaState());
        if (type === "all") {
            dispatch(GetLinks({ page: 1 }));
        } else {
            dispatch(GetLinksByChatId({ chatId, page: 1 }));
        }
    }, [dispatch, type, chatId]);

    return (
        <div className="LinkPage">
            <InfiniteScroll
                dataLength={Links.length}
                next={fetchLinks}
                hasMore={hasMore}
                scrollThreshold={0.8}
                style={{ display: 'flex', flexDirection: 'column' }}
            >
                {loading ? (
                    <LinksSkeleton count={6} />
                ) : (

                    <>
                        {Links.length === 0 ? (
                            <p className="no-links">No links found</p>
                        ) : (
                            Links.map((item) => (
                                <a
                                    key={item.id}
                                    href={item.text}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="link-card"
                                >
                                    <div className="link-icon">
                                        <FaLink />
                                    </div>

                                    <div className="link-info">
                                        <p className="link-url">{item.text}</p>
                                        <span className="link-date">
                                            {new Date(item.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                </a>
                            ))
                        )}
                    </>)}
            </InfiniteScroll>
        </div>
    )
}
