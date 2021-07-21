import React, { useContext, useState, useRef, useEffect } from "react";

import { UsersContext } from "../context";
import Sidebar from "react-sidebar";
import Navbar from "./Navbar";
import Menu from "./Menu";

export default function Layout({ children }) {
  //context data
  const { showMenu, setShowMenu } = useContext(UsersContext);
  const [showNavBackground, setShowNavBackground] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (!scrollRef) return;
    const scrollContainer = scrollRef.current.parentNode;
    console.log("scrollContainer", scrollContainer);
    const updateBackground = () => {
      setShowNavBackground(scrollContainer.scrollTop > 60);
    };

    scrollContainer.addEventListener("scroll", updateBackground);

    return () => {
      scrollContainer.removeEventListener("scroll", updateBackground);
    };
  }, []);

  useEffect(() => {
    console.log(`showNavBackground`, showNavBackground);
  }, [showNavBackground]);

  return (
    <div style={{ overflow: "hidden !important", height: "100%" }}>
      <Sidebar
        sidebar={<Menu showMenu={showMenu} setShowMenu={setShowMenu} />}
        open={showMenu}
        onSetOpen={(e) => setShowMenu(true)}
        transitions={true}
        styles={{
          sidebar: {
            transition: "transform 0.3s ease-out",
            WebkitTransition: "-webkit-transform 0.3s ease-out",
            overflow: "hidden",
            width: "100%;",
            zIndex: "12",
          },
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            overflow: "hidden",
            width: "100%;",
            zIndex: "11",
          },
          content: {
            // overflow: "hidden",
            width: "100%",
          },
        }}
      >
        <Navbar
          showMenu={showMenu}
          setShowMenu={setShowMenu}
          showNavBackground={showNavBackground}
        />
        <div ref={scrollRef}>{children}</div>
      </Sidebar>
    </div>
  );
}
