import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { AuthContext } from "./AuthProvider";
import * as React from "react";
import Avatar from "@mui/material/Avatar";
import CssBaseline from "@mui/material/CssBaseline";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";

const Login = () => {
  const navigate = useNavigate();
  const { isLoggedIn, user, login, logout } = useContext(AuthContext);

  function handleCallbackResponse(response) {
    var userObject = jwtDecode(response.credential);
    if (userObject && userObject["email_verified"]) {
      console.log("login form authenticated");
      login(userObject);
      if (window.history?.length && window.history.length > 1) {
        navigate(-1);
      } else {
        navigate("/dashboard", { replace: true });
      }
    }
  }

  useEffect(() => {
    /*global google */
    google.accounts.id.initialize({
      client_id:
        "562354301975-kuj4tpvki50h84nhe1odssqdmkt8gbe8.apps.googleusercontent.com",
      callback: handleCallbackResponse,
    });

    google.accounts.id.renderButton(document.getElementById("signInDiv"), {
      theme: "outline",
      size: "large",
    });
  }, []);

  return (
    <Grid container component="main" sx={{ height: "100vh" }}>
      <CssBaseline />
      <Grid
        item
        xs={false}
        sm={4}
        md={7}
        sx={{
          backgroundImage: "url(https://source.unsplash.com/random?wallpapers)",
          backgroundRepeat: "no-repeat",
          backgroundColor: (t) =>
            t.palette.mode === "light"
              ? t.palette.grey[50]
              : t.palette.grey[900],
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <Box
          sx={{
            my: 8,
            mx: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box noValidate sx={{ mt: 5 }}>
            <div id="signInDiv"></div>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
};

export default Login;
