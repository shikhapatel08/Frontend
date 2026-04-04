const Button = ({ variant = "primary", children, onClick }) => {

  const getStyle = () => {
    if (variant === "primary") {
      return {
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        color: "#ffffff",
      };
    }

    if (variant === "danger") {
      return {
        backgroundColor: "#dc2626",
        color: "#ffffff",
      };
    }

    return {
      backgroundColor: "#e5e7eb",
      color: "#111827",
    };
  };

  return (
    <button
      className="px-4 py-2 rounded font-semibold transition-all hover:scale-105"
      style={getStyle()}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;
