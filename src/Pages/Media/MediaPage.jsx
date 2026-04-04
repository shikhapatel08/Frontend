import { useDispatch, useSelector } from "react-redux";
import { GetMedia, GetMediaByChatId, resetMediaState } from "../../Redux/Features/MediaSlice";
import "../Media/Media.css";
import InfiniteScroll from 'react-infinite-scroll-component';
import { useEffect } from "react";
import ImageMessage from "../../Components/ChatListComponents/ImageMessage";
import { MediaSkeleton } from "../../Components/Common Components/Loader/PageSkeletons";

const isVideo = (name) => {
  return name.match(/\.(mp4|webm|ogg|mov)$/i);
};

const isAudio = (name) => {
  return name.match(/\.(mp3|wav|aac|m4a)$/i);
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
    dispatch(resetMediaState());
    if (type === "all") {
      dispatch(GetMedia({ page: 1 }));
    } else {
      dispatch(GetMediaByChatId({ chatId, page: 1 }));
    }
  }, [dispatch, type, chatId]);


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
          <MediaSkeleton count={12} />
        ) : (

          <>
            {Media.length === 0 ? (
              <p className="no-link">No Media found</p>
            ) : (
              <div className="media-grid">

                {Media.map((msg) => {
                  let files = [];
                  if (Array.isArray(msg.image_url)) {
                    files = msg.image_url;
                  } else if (typeof msg.image_url === "string") {
                    try {
                      files = JSON.parse(msg.image_url);
                    } catch {
                      files = [msg.image_url];
                    }
                  }

                  return files.map((file, i) => {
                    const fileUrl = typeof file === "string" ? file : file.url;
                    const fileName = typeof file === "string" ? file : file.name;

                    return (
                      <div key={msg.id + "-" + i} className="media-item">

                        {!isVideo(fileName) && !isAudio(fileName) && (
                          <ImageMessage src={fileUrl} />
                        )}

                        {isVideo(fileName) && (
                          <video controls>
                            <source src={fileUrl} />
                          </video>
                        )}

                        {isAudio(fileName) && (
                          <audio controls>
                            <source src={fileUrl} />
                          </audio>
                        )}

                      </div>
                    );
                  });
                })}
              </div>
            )}
          </>)}
      </InfiniteScroll>
    </div>
  );
}
