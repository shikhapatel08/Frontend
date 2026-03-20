import { useSelector } from "react-redux";

export const useLayoutStyle = () => {
  const isSidebarOpen = useSelector((state) => state.sidebar.isOpen);

  return {
    marginLeft: window.innerWidth > 1024
      ? (isSidebarOpen ? 220 : 75)
      : 0,

    width: window.innerWidth > 1024
      ? `calc(100% - ${isSidebarOpen ? 220 : 75}px)`
      : "100%"
  };
};