import { useDispatch, useSelector } from "react-redux";
import { GetMedia, GetMediaByChatId } from "../../Redux/Features/MediaSlice";
import "../Media/Media.css";
import InfiniteScroll from 'react-infinite-scroll-component';
import { useEffect } from "react";

const isVideo = (url) => {
  return url.match(/\.(mp4|webm|ogg|mov)$/i);
};

const isAudio = (url) => {
  return url.match(/\.(mp3|wav|aac|m4a)$/i);
};

export default function MediaPage({ type, chatId }) {
  const dispatch = useDispatch();
  const { Media, loading, page, hasMore } = useSelector((state) => state.media);

  const fetchMedia = () => {
    if (!hasMore) return;
    if (type === "all") {
      dispatch(GetMedia({ page: page }));
    } else {
      dispatch(GetMediaByChatId({ chatId, page: page }));
    }
  };

  useEffect(() => {
    if (type === "all") {
      dispatch(GetMedia({ page: 1 }));
    } else {
      dispatch(GetMediaByChatId({ chatId, page: 1 }));
    }
  }, []);


  return (
    <div className="MediaPage">
      <InfiniteScroll
        dataLength={Media.length}
        next={fetchMedia}
        hasMore={hasMore}
        scrollThreshold={0.8}
        style={{ display: 'flex', flexDirection: 'column' }}
      >
        {loading ? (
          <div className="loader-conatainer">
            <div className="loader"></div>
          </div>
        ) : (
          <>
            {Media.length === 0 ? (
              <p className="no-link">No Media found</p>
            ) : (
              <div className="media-grid">

                {Media.map((msg) => {
                  const files = msg.image_url ? JSON.parse(msg.image_url) : [];

                  return files.map((file, i) => (
                    <div key={msg.id + "-" + i} className="media-item">

                      {/* IMAGE */}
                      {!isVideo(file) && !isAudio(file) && (
                        <img src={file} alt="media" />
                      )}

                      {/* VIDEO */}
                      {isVideo(file) && (
                        <video controls>
                          <source src={file} />
                        </video>
                      )}

                      {/* AUDIO */}
                      {isAudio(file) && (
                        <audio controls>
                          <source src={file} />
                        </audio>
                      )}

                    </div>
                  ));
                })}
              </div>
            )}
          </>)}
      </InfiniteScroll>
    </div>
  );
}