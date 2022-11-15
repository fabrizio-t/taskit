import { useAuth0 } from "@auth0/auth0-react";
import React from "react";
import Button from '@mui/material/Button';
import LoginIcon from '@mui/icons-material/Login';
import HomeRepairServiceIcon from '@mui/icons-material/HomeRepairService';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';

export const Access = () => {
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
    <Button color="primary" size="large" variant="contained" onClick={handleLogin}>
      <LockOpenIcon /> Access workspace
    </Button>
  );
};
