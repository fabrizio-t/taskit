import { useAuth0 } from "@auth0/auth0-react";
import React from "react";
/* import { NavBar } from "../components/navigation/desktop/nav-bar";
import { MobileNavBar } from "../components/navigation/mobile/mobile-nav-bar";
import { PageLayout } from "../components/page-layout.js"; */

export const CallbackPage = () => {
  const { error } = useAuth0();
  /* const { error } = { error: { message: "hi" } }; */

  if (error) {
    return (
      <>
        <h2>Error</h2>
        {JSON.stringify(error)}
      </>
    );
  }

  return (
    <>
      <h2>Success</h2>
    </>
  );
};
/* test */