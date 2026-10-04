import { Box, Typography, Stack } from "@mui/material";

import { NavLink } from "react-router-dom";

import HomeRounded from "@mui/icons-material/HomeRounded";
import DescriptionOutlined from "@mui/icons-material/DescriptionOutlined";
import PersonIcon from "@mui/icons-material/Person";
import LogoutRounded from "@mui/icons-material/LogoutRounded";
import EventNoteRounded from "@mui/icons-material/EventNoteRounded";


function Sidebar({ role, onLogout }) {


 const nav = [
    {
      to: "/",
      label: "Dashboard",
      icon: <HomeRounded />,
    },
  ];

 if (role === "admin") {
    nav.push({
      to: "/leave-approval",
      label: "Leave Approval",
      icon: <DescriptionOutlined />,
    });
  } else {
    nav.push({
      to: "/leaves",
      label: "My Leaves",
      icon: <DescriptionOutlined />,
    });
  }

  nav.push({
    to: "/profile",
    label: "Profile",
    icon: <PersonIcon />,
  });


  const link = (isActive) => ({
    display: "flex",
    alignItems: "center",
    gap: 14,
    padding: "11px 14px",
    borderRadius: 10,
    textDecoration: "none",
    fontSize: 14,
    fontWeight: 500,
    marginBottom: 6,
    color: isActive ? "#4f46e5" : "#374151",
    background: isActive ? "#e0e7ff" : "transparent",
  });

  return (
    <Box
      sx={{
        width: 240,
        bgcolor: "#fff",
        borderRight: "1px solid #eef0f4",
        p: 1.5,
        display: { xs: "none", md: "block" },
      }}
    >
      {/* Brand */}
      <Stack
        direction="row"
        spacing={1.2}
        alignItems="center"
        sx={{
          height: 64,
          px: 1,
          mb: 2,
        }}
      >
        <Box
          sx={{
            bgcolor: "#4f46e5",
            color: "#fff",
            p: 0.8,
            borderRadius: 1.5,
            display: "flex",
          }}
        >
          <EventNoteRounded />
        </Box>

        <Box>
          <Typography
            fontWeight={700}
            color="#4f46e5"
            lineHeight={1.1}
            fontSize={18}
          >
            LeavePro
          </Typography>

          <Typography fontSize={11} color="text.secondary">
            Leave Management
          </Typography>
        </Box>
      </Stack>

      {/* Navigation */}
      {nav.map((n) => (
        <NavLink
          key={n.to}
          to={n.to}
          end
          style={({ isActive }) => link(isActive)}
        >
          {n.icon}
          {n.label}
        </NavLink>
      ))}

      <Box
        sx={{
          borderTop: "1px solid #eef0f4",
          my: 1.5,
        }}
      />

        {/* Logout */}
        <Box
        component="button"
        onClick={onLogout}
        sx={{
            display: "flex",
            alignItems: "center",
            gap: 5,

            width: "100%",
            padding: "11px 14px",
            margin: 0,

            border: "none",
            borderRadius: 10,
            background: "transparent",

            color: "#374151",
            fontSize: 14,
            fontWeight: 500,
            fontFamily: "inherit",
            textAlign: "left",

            cursor: "pointer",

            "&:hover": {
            background: "#f3f4f6",
            },
        }}
        >
        <LogoutRounded fontSize="small" />

        <span>Logout</span>
        </Box>
    </Box>
  );
}

export default Sidebar;