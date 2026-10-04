import { useState } from "react";
import { Link, useNavigate, Navigate } from "react-router-dom";

import {
  Box,
  Button,
  Container,
  Paper,
  TextField,
  Typography,
  Stack,
} from "@mui/material";

import EventNoteRounded from "@mui/icons-material/EventNoteRounded";

import toast from "react-hot-toast";

import callApi from "../../common/scripts";


function Login({ user, setUser }) {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);


  // Already logged in
  if (user) {
    return <Navigate to="/" replace />;
  }


  const handleLogin = async (event) => {
    event.preventDefault();

    if (!email || !password) {
      toast.error("Email and password are required", {
        duration: 3000,
        position: "top-center",
      });

      return;
    }

    try {
      setLoading(true);

      const data = await callApi(
        "/user/login",
        "POST",
        {
          email,
          password,
        }
      );

      console.log("Login response:", data);

      if (data?.success) {
        setUser(data?.user);

        toast.success("Login successful!", {
          duration: 3000,
          position: "top-center",
        });

        navigate("/");
      } else {
        toast.error(
          data?.message || "Invalid email or password",
          {
            duration: 3000,
            position: "top-center",
          }
        );
      }
    } catch (error) {
      console.error("Login error:", error);

      toast.error("Something went wrong", {
        duration: 3000,
        position: "top-center",
      });
    } finally {
      setLoading(false);
    }
  };


  return (
    <Container maxWidth="sm">

      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          py: 4,
        }}
      >

        <Paper
          variant="outlined"
          sx={{
            width: "100%",
            maxWidth: 420,
            p: { xs: 3, sm: 4 },
            borderRadius: 3,
            borderColor: "#eef0f4",
            boxShadow:
              "0 8px 30px rgba(17, 24, 39, 0.06)",
          }}
        >

          {/* Brand */}

          <Stack
            alignItems="center"
            spacing={1.5}
            mb={4}
          >

            <Box
              sx={{
                width: 48,
                height: 48,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: "#eef2ff",
                color: "#4f46e5",
                borderRadius: 2.5,
              }}
            >
              <EventNoteRounded fontSize="medium" />
            </Box>


            <Box textAlign="center">

              <Typography
                sx={{
                  fontSize: 22,
                  fontWeight: 700,
                  color: "#4f46e5",
                  lineHeight: 1.2,
                }}
              >
                LeavePro
              </Typography>

              <Typography
                fontSize={12}
                color="text.secondary"
                mt={0.5}
              >
                Leave Management
              </Typography>

            </Box>

          </Stack>


          {/* Heading */}

          <Typography
            variant="h5"
            fontWeight={600}
            color="#1F2937"
            textAlign="center"
          >
            Welcome back
          </Typography>

          <Typography
            fontSize={14}
            color="text.secondary"
            textAlign="center"
            mt={0.7}
            mb={3.5}
          >
            Sign in to manage your leave requests
          </Typography>


          {/* Form */}

          <Box
            component="form"
            onSubmit={handleLogin}
          >

            <Stack spacing={2.2}>

              <TextField
                label="Email"
                type="email"
                fullWidth
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
                autoComplete="email"
              />


              <TextField
                label="Password"
                type="password"
                fullWidth
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
                autoComplete="current-password"
              />


              <Button
                type="submit"
                variant="contained"
                size="large"
                fullWidth
                disabled={loading}
                sx={{
                  mt: 0.5,
                  py: 1.35,
                  borderRadius: 2,
                  textTransform: "none",
                  fontSize: 15,
                  fontWeight: 600,
                  bgcolor: "#4f46e5",
                  boxShadow:
                    "0 6px 14px rgba(79,70,229,.25)",
                  "&:hover": {
                    bgcolor: "#4338ca",
                    boxShadow:
                      "0 7px 16px rgba(79,70,229,.3)",
                  },
                }}
              >
                {loading ? "Signing in..." : "Sign In"}
              </Button>

            </Stack>

          </Box>


          {/* Signup */}

          <Typography
            textAlign="center"
            mt={4}
            fontSize={14}
            color="text.secondary"
          >
            Don't have an account?{" "}

            <Link
              to="/signup"
              style={{
                color: "#4f46e5",
                fontWeight: 600,
                textDecoration: "none",
              }}
            >
              Sign up
            </Link>

          </Typography>

        </Paper>

      </Box>

    </Container>
  );
}


export default Login;