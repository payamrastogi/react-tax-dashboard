import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { jwtDecode } from "jwt-decode";
import * as React from "react";
import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { signIn } from "../../service/authService";
import { AuthContext } from "./AuthProvider";

const Login = () => {
  const navigate = useNavigate();
  const { isLoggedIn, user, login, logout } = useContext(AuthContext);

  function handleCallbackResponse(response) {
    console.log(response);
    console.log(response.credential);
    var userObject = jwtDecode(response.credential);
    var credentials = response.credential;
    signIn(credentials)
      .then((res) => {
        if (res && res.data && res.data["authorised"]) {
          console.log(res);
          console.log("login form authenticated");
          login(userObject, credentials);
          if (window.history?.length && window.history.length > 1) {
            navigate(-1);
          } else {
            navigate("/customers", { replace: true });
          }
        }
      })
      .catch((error) => {
        console.error(error);
        console.error(error.request);
        console.error(error.message);
      });
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
