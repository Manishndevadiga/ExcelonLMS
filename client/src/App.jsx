import { useEffect, useState } from "react";

import {
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import {
  Box,
  CircularProgress,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";

import Sidebar from "./components/common/Sidebar";
import Topbar from "./components/common/Topbar";

import AdminDashboard from "./components/admin/AdminDashboard";
import Dashboard from "./components/employee/Dashboard";

import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";

import callApi from "./common/scripts";


// -----------------------------------------
// Simple placeholder page
// -----------------------------------------

const Simple = ({ title }) => (
  <Typography
    variant="h5"
    fontWeight={600}
  >
    {title}
  </Typography>
);


// -----------------------------------------
// App
// -----------------------------------------

export default function App() {

  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);


  console.log("App user state:", user);
  // -----------------------------------------
  // Check authentication
  // -----------------------------------------

  const checkAuth = async () => {
    try {

      const data = await callApi(
        "/user/checkAuth",
        "GET"
      );

      console.log("checkAuth response:", data);

      if (data?.success && data?.user) {

        setUser(data?.user);

      } else {

        setUser(null);

      }

    } catch (error) {

      console.error(
        "Check auth error:",
        error
      );

      setUser(null);

    } finally {

      setAuthLoading(false);

    }
  };


  // -----------------------------------------
  // Run authentication check once
  // -----------------------------------------

  useEffect(() => {
    checkAuth();
  }, []);



 //Logout function

  const handleLogoutConfirm = async () => {
  const data = await callApi("/user/logout", "POST");

  if (data?.success) {
    setLogoutDialogOpen(false);
    setUser(null);

    toast.success("Logged out successfully", {
      duration: 1000,
      position: "top-center",
    });

    navigate("/login");
  } else {
    toast.error(data?.message || "Logout failed");
  }
};


  // -----------------------------------------
  // Authentication loading
  // -----------------------------------------

  if (authLoading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "#f8fafc",
        }}
      >
        <CircularProgress
          size={30}
          thickness={4}
        />
      </Box>
    );

  }


  // -----------------------------------------
  // NOT LOGGED IN
  // -----------------------------------------

  if (!user) {

    return (
      <Routes>

        {/* Signup */}

        <Route
          path="/signup"
          element={
            <Signup
              user={user}
              setUser={setUser}
            />
          }
        />


        {/* Login */}

        <Route
          path="/login"
          element={
            <Login
              user={user}
              setUser={setUser}
            />
          }
        />


        {/* Any other route → Signup */}

        <Route
          path="*"
          element={
            <Navigate
              to="/signup"
              replace
            />
          }
        />

      </Routes>
    );

  }


  // -----------------------------------------
  // LOGGED IN
  // -----------------------------------------

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        bgcolor: "background.default",
      }}
    >

      {/* -----------------------------------
          Sidebar
      ----------------------------------- */}

      <Sidebar
        role={user?.role}
        onLogout={() => setLogoutDialogOpen(true)}
      />


      {/* -----------------------------------
          Main content
      ----------------------------------- */}

      <Box
        flex={1}
        minWidth={0}
      >

        {/* ---------------------------------
            Topbar
        --------------------------------- */}

        <Topbar
          user={user}
        />


        {/* ---------------------------------
            Page content
        --------------------------------- */}

        <Box
          sx={{
            p: {
              xs: 2,
              md: 3,
            },
            maxWidth: 1100,
            width: "100%",
            boxSizing: "border-box",
          }}
        >

          <Routes>

            {/* =================================
                EMPLOYEE ROUTES
            ================================= */}

            {user?.role === "employee" && (
              <>

                {/* Employee Dashboard */}

                <Route
                  path="/"
                  element={
                    <Dashboard />
                  }
                />


                {/* My Leaves */}

                <Route
                  path="/leaves"
                  element={
                    <Simple
                      title="My Leaves"
                    />
                  }
                />


                {/* Profile */}

                <Route
                  path="/profile"
                  element={
                    <Simple
                      title="Profile"
                    />
                  }
                />


                {/* ---------------------------------
                    Block employee from admin route
                --------------------------------- */}

                <Route
                  path="/leave-approval"
                  element={
                    <Navigate
                      to="/"
                      replace
                    />
                  }
                />


                {/* Unknown employee route */}

                <Route
                  path="*"
                  element={
                    <Navigate
                      to="/"
                      replace
                    />
                  }
                />

              </>
            )}


            {/* =================================
                ADMIN ROUTES
            ================================= */}

            {user?.role === "admin" && (
              <>

                {/* Admin Dashboard */}

                <Route
                  path="/"
                  element={
                    <AdminDashboard />
                  }
                />


                {/* Leave Approval */}

                <Route
                  path="/leaveApproval"
                  element={
                    <Simple
                      title="Leave Approval"
                    />
                  }
                />


                {/* Profile */}

                <Route
                  path="/profile"
                  element={
                    <Simple
                      title="Profile"
                    />
                  }
                />


                {/* ---------------------------------
                    Block admin from employee route
                --------------------------------- */}

                <Route
                  path="/leaves"
                  element={
                    <Navigate
                      to="/"
                      replace
                    />
                  }
                />


                {/* Unknown admin route */}

                <Route
                  path="*"
                  element={
                    <Navigate
                      to="/"
                      replace
                    />
                  }
                />

              </>
            )}


            {/* =================================
                INVALID ROLE
            ================================= */}

            {user?.role !== "employee" &&
              user?.role !== "admin" && (

                <Route
                  path="*"
                  element={
                    <Navigate
                      to="/login"
                      replace
                    />
                  }
                />

            )}

          </Routes>

            <Dialog
                open={logoutDialogOpen}
                onClose={() => setLogoutDialogOpen(false)}
              >
                <DialogTitle>Logout</DialogTitle>

                <DialogContent>
                  <DialogContentText>
                    Are you sure you want to logout?
                  </DialogContentText>
                </DialogContent>

                <DialogActions>
                  <Button onClick={() => setLogoutDialogOpen(false)}>
                    Cancel
                  </Button>

                  <Button
                    onClick={handleLogoutConfirm}
                    variant="contained"
                    color="error"
                  >
                    Logout
                  </Button>
                </DialogActions>
            </Dialog>

        </Box>

      </Box>

    </Box>
  );
}