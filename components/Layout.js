import React, { useContext } from "react";

import { UsersContext } from "../context";
import Sidebar from "react-sidebar";
import Navbar from "./Navbar";
import Menu from "./Menu";

export default function Layout({ children }) {
  //context data
  const { showMenu, setShowMenu } = useContext(UsersContext);

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
        <Navbar showMenu={showMenu} setShowMenu={setShowMenu} />
        {children}
      </Sidebar>
    </div>
  );
}
