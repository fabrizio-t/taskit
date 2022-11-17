import { useAuth0 } from "@auth0/auth0-react";
import React from "react";
import Button from '@mui/material/Button';
import LoginIcon from '@mui/icons-material/Login';

export const LoginButton = () => {
  const { loginWithRedirect } = useAuth0();

  const handleLogin = async () => {
    await loginWithRedirect({
      prompt: "login",
      appState: {
        returnTo: "/projects",
      },
    });
  };

  return (
    <Button color="primary" size="small" variant="contained" onClick={handleLogin}>
      <LoginIcon />
    </Button>
  );
};
