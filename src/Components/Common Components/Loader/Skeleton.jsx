import './Loader.css';

const Skeleton = ({
    variant = 'rect',
    width = '100%',
    height = '14px',
    borderRadius = '4px',
    margin = '0',
    className = '',
    shimmer = true
}) => {
    const style = {
        width,
        height,
        borderRadius: variant === 'circle' ? '50%' : borderRadius,
        margin
    };

    return (
        <div
            className={`skeleton-base ${shimmer ? 'skeleton-shimmer' : 'skeleton-pulse'} ${variant} ${className}`}
            style={style}
        ></div>
    );
};

export default Skeleton;
