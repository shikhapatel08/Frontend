import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export const useLayoutStyle = () => {
  const isSidebarOpen = useSelector((state) => state.sidebar.isOpen);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const onResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return {
    marginLeft: windowWidth > 1024
      ? (isSidebarOpen ? 220 : 75)
      : 0,

    width: windowWidth > 1024
      ? `calc(100% - ${isSidebarOpen ? 220 : 75}px)`
      : "100%"
  };
};
