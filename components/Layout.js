import React, { useState, useEffect, useContext } from "react";

import { UsersContext, DataContext } from "../context";
import Sidebar from "react-sidebar";
import Navbar from "./Navbar";
import Menu from "./Menu";

export default function Layout({ children }) {
  //context data
  const { showMenu, setShowMenu, showFilter } = useContext(UsersContext);

  useEffect(() => {
    console.log("showMenu state:", showMenu);
  }, [showMenu]);

  return (
    <Sidebar
      sidebar={<Menu showMenu={showMenu} setShowMenu={setShowMenu} />}
      open={showMenu}
      onSetOpen={(e) => setShowMenu(true)}
      transitions={true}
      styles={{
        sidebar: {
          transition: "transform 0.75s ease-out",
          WebkitTransition: "-webkit-transform 0.75s ease-out",
        },
      }}
    >
      <Navbar showMenu={showMenu} setShowMenu={setShowMenu} />
      {children}
    </Sidebar>
  );
}
