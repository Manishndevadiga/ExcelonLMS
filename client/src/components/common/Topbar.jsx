import {
  Box,
  Typography,
  Avatar,
  IconButton,
  Badge,
  Stack,
} from "@mui/material";

import NotificationsNoneRounded from "@mui/icons-material/NotificationsNoneRounded";
import KeyboardArrowDownRounded from "@mui/icons-material/KeyboardArrowDownRounded";

import toast from "react-hot-toast";

function Topbar({ user }) {
  const displayName = user?.name || "User";

  const displayRole =
    user?.role === "admin"
      ? "Admin"
      : "Employee";

  const avatarLetter =
    user?.name?.charAt(0)?.toUpperCase() || "U";

  return (
    <Box
      sx={{
        height: 64,
        bgcolor: "#fff",
        borderBottom: "1px solid #eef0f4",
        display: "flex",
        alignItems: "center",
        px: 3,
        position: "sticky",
        top: 0,
        zIndex: 10,
      }}
    >
      <Box flex={1} />

      {/* Notifications */}
      {/* <IconButton
        onClick={() =>
          toast("No new notifications")
        }
      >
        <Badge variant="dot" color="error">
          <NotificationsNoneRounded />
        </Badge>
      </IconButton> */}

      <Box
        sx={{
          width: "1px",
          height: 36,
          bgcolor: "#eef0f4",
          mx: 2,
        }}
      />

      {/* User */}
      <Stack
        direction="row"
        spacing={1.2}
        alignItems="center"
      >
        <Avatar
          sx={{
            bgcolor: "#4f46e5",
            width: 34,
            height: 34,
            fontSize: 14,
          }}
        >
          {avatarLetter}
        </Avatar>

        <Box
          sx={{
            display: {
              xs: "none",
              sm: "block",
            },
          }}
        >
          <Typography
            fontSize={13}
            fontWeight={700}
            lineHeight={1.2}
          >
            {displayName}
          </Typography>

          <Typography
            fontSize={11}
            color="text.secondary"
          >
            {displayRole}
          </Typography>
        </Box>

        <KeyboardArrowDownRounded fontSize="small" />
      </Stack>
    </Box>
  );
}

export default Topbar;