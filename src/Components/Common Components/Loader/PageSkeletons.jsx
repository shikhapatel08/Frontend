import Skeleton from './Skeleton';

export const ChatListSkeleton = ({ count = 6 }) => (
    <div className="message-skeleton-container">
        {[...Array(count)].map((_, i) => (
            <div key={i} className="chat-list-skeleton">
                <Skeleton variant="circle" width="48px" height="48px" shimmer />
                <div style={{ flex: 1 }}>
                    <Skeleton width="60%" height="16px" margin="0 0 8px 0" shimmer />
                    <Skeleton width="40%" height="12px" shimmer />
                </div>
            </div>
        ))}
    </div>
);

export const    MessageListSkeleton = ({ count = 5 }) => (
    <div className="message-skeleton-container" style={{ padding: '20px' }}>
        {[...Array(count)].map((_, i) => (
            <div key={i} style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: i % 2 === 0 ? 'flex-start' : 'flex-end',
                marginBottom: '16px'
            }}>
                <Skeleton
                    width={i % 2 === 0 ? "70%" : "60%"}
                    height="40px"
                    borderRadius="12px"
                    shimmer
                />
                <Skeleton width="40px" height="10px" margin="4px 0 0 0" shimmer />
            </div>
        ))}
    </div>
);

export const ProfileSkeleton = () => (
    <div className="profile-skeleton">
        <Skeleton width="100%" height="200px" borderRadius="0" shimmer />
        <div style={{ padding: '0 20px', marginTop: '-50px', position: 'relative' }}>
            <Skeleton variant="circle" width="100px" height="100px" margin="0 0 16px 0" shimmer style={{ border: '4px solid white' }} />
            <Skeleton width="200px" height="24px" margin="0 0 8px 0" shimmer />
            <Skeleton width="150px" height="16px" margin="0 0 24px 0" shimmer />

            <div className="settings-skeleton-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
                {[...Array(6)].map((_, i) => (
                    <Skeleton key={i} width="100%" height="80px" borderRadius="8px" shimmer />
                ))}
            </div>
        </div>
    </div>
);

export const SettingsSkeleton = ({ count = 4 }) => (
    <div className="settings-skeleton">
        <div style={{ padding: '20px', borderBottom: '1px solid var(--border-color)' }}>
            <Skeleton width="150px" height="24px" shimmer />
        </div>
        {[...Array(count)].map((_, i) => (
            <div key={i} className="settings-skeleton-row">
                <Skeleton width="100px" height="14px" margin="0 0 8px 0" shimmer />
                <Skeleton width="100%" height="40px" borderRadius="8px" shimmer />
            </div>
        ))}
        <div style={{ padding: '20px' }}>
            <Skeleton width="100%" height="45px" borderRadius="8px" shimmer />
        </div>
    </div>
);

export const SearchSkeleton = ({ count = 5 }) => (
    <div className="message-skeleton-container">
        {[...Array(count)].map((_, i) => (
            <div key={i} className="chat-list-skeleton">
                <Skeleton variant="circle" width="40px" height="40px" shimmer />
                <div style={{ flex: 1 }}>
                    <Skeleton width="150px" height="16px" margin="0 0 4px 0" shimmer />
                    <Skeleton width="100px" height="12px" shimmer />
                </div>
            </div>
        ))}
    </div>
);

export const MediaSkeleton = ({ count = 12 }) => (
    <div className="media-skeleton-grid">
        {[...Array(count)].map((_, i) => (
            <Skeleton key={i} width="100%" height="100px" borderRadius="4px" shimmer />
        ))}
    </div>
);

export const StarredSkeleton = ({ count = 5 }) => (
    <div className="message-skeleton-container" style={{ padding: '20px' }}>
        {[...Array(count)].map((_, i) => (
            <div key={i} className="chat-list-skeleton" style={{
                border: '1px solid var(--border-color)',
                borderRadius: '12px',
                marginBottom: '12px',
                padding: '16px'
            }}>
                <Skeleton variant="circle" width="48px" height="48px" shimmer />
                <div style={{ flex: 1, marginLeft: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <Skeleton width="120px" height="18px" shimmer />
                        <Skeleton width="60px" height="14px" shimmer />
                    </div>
                    <Skeleton width="90%" height="14px" margin="0 0 8px 0" shimmer />
                    <Skeleton width="60%" height="14px" shimmer />
                </div>
            </div>
        ))}
    </div>
);

export const DocsSkeleton = ({ count = 5 }) => (
    <div className="message-skeleton-container" style={{ padding: '0 16px' }}>
        {[...Array(count)].map((_, i) => (
            <div key={i} className="chat-list-skeleton" style={{ borderBottom: '1px solid var(--border-color)', padding: '16px 0' }}>
                <Skeleton width="40px" height="40px" borderRadius="8px" shimmer />
                <div style={{ flex: 1, marginLeft: '12px' }}>
                    <Skeleton width="70%" height="16px" margin="0 0 6px 0" shimmer />
                    <Skeleton width="30%" height="12px" shimmer />
                </div>
            </div>
        ))}
    </div>
);

export const LinksSkeleton = ({ count = 5 }) => (
    <div className="message-skeleton-container" style={{ padding: '0 16px' }}>
        {[...Array(count)].map((_, i) => (
            <div key={i} className="chat-list-skeleton" style={{ borderBottom: '1px solid var(--border-color)', padding: '16px 0' }}>
                <div style={{ width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Skeleton variant="circle" width="32px" height="32px" shimmer />
                </div>
                <div style={{ flex: 1, marginLeft: '12px' }}>
                    <Skeleton width="85%" height="16px" margin="0 0 6px 0" shimmer />
                    <Skeleton width="25%" height="12px" shimmer />
                </div>
            </div>
        ))}
    </div>
);
