import { useEffect } from "react";

const RedirectHandler = () => {
  useEffect(() => {
    if (window.location.pathname === "/user") {
      window.location.replace("https://propsmaster.gr");
    }
  }, []);

  return null; // This component does not render anything
};

export default RedirectHandler;
