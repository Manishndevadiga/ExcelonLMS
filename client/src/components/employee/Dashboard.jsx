import { useState , useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  Stack,
  Chip,
  IconButton,
} from "@mui/material";

import EventNoteRounded from "@mui/icons-material/EventNoteRounded";
import MedicalServicesOutlined from "@mui/icons-material/MedicalServicesOutlined";
import AccessTimeRounded from "@mui/icons-material/AccessTimeRounded";
import AddRounded from "@mui/icons-material/AddRounded";
import CheckCircleRounded from "@mui/icons-material/CheckCircleRounded";
import MoreHorizRounded from "@mui/icons-material/MoreHorizRounded";
import CalendarTodayOutlined from "@mui/icons-material/CalendarTodayOutlined";
import ArrowForwardRounded from "@mui/icons-material/ArrowForwardRounded";
import CheckCircleOutlineRounded from "@mui/icons-material/CheckCircleOutlineRounded";
import CancelOutlined from "@mui/icons-material/CancelOutlined";

import { NavLink } from "react-router-dom";
import toast from "react-hot-toast";

import StatCard from "../common/StatCard";
import ApplyLeaveDialog from "./ApplyLeaveDialog";

import callApi from "../../common/scripts";

const typeStyle = {
  casual: {
    bg: "#e0e7ff",
    color: "#4f46e5",
    icon: <EventNoteRounded />,
    label: "Casual Leave",
  },

  sick: {
    bg: "#dcfce7",
    color: "#16a34a",
    icon: <MedicalServicesOutlined />,
    label: "Sick Leave",
  },

  earned: {
    bg: "#fef3c7",
    color: "#d97706",
    icon: <EventNoteRounded />,
    label: "Earned Leave",
  },
};


const statusStyle = {
  pending: {
    bg: "#fef3c7",
    color: "#d97706",
    icon: <AccessTimeRounded />,
  },

  approved: {
    bg: "#dcfce7",
    color: "#16a34a",
    icon: <CheckCircleOutlineRounded />,
  },

  rejected: {
    bg: "#fee2e2",
    color: "#dc2626",
    icon: <CancelOutlined />,
  },
};

const fmt = (d) =>
  new Date(d).toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });

const daysBetween = (a, b) =>
  Math.round(
    (new Date(b) - new Date(a)) / 864e5
  ) + 1;


function Dashboard({  }) {


  const [open, setOpen] = useState(false);
  const [leaves, setLeaves] = useState([]);
  const [dashboard, setDashboard] = useState({
    casualLeave: {
      used: 0,
      total: 12,
      remaining: 12,
    },
    sickLeave: {
      used: 0,
      total: 10,
      remaining: 10,
    },
    pendingRequests: 0,
  });


  console.log("leaves data:", leaves);


useEffect(() => {
  fetchDashboard();
  fetchRecentLeaves();
}, []);

console.log("Dashboard data:", dashboard);


const fetchDashboard = async () => {
  try {
    const data = await callApi("/leave/dashboard");

    if (data?.success) {
      setDashboard(data?.data);
    } else {
      toast.error(data?.message || "Failed to load dashboard");
    }
  } catch (error) {
    console.error("Fetch dashboard error:", error);
    toast.error("Failed to load dashboard");
  }
};


const fetchRecentLeaves = async () => {
  try {
    const data = await callApi("/leave/recent");

    if (data?.success) {
      setLeaves(data?.data);
    } else {
      toast.error(data?.message || "Failed to load recent leaves");
    }
  } catch (error) {
    console.error("Fetch recent leaves error:", error);
    toast.error("Failed to load recent leaves");
  }
};




  const pending = leaves?.filter(
    (l) => l.status === "Pending"
  )?.length;

  const today = new Date().toLocaleDateString(
    "en-GB",
    {
      day: "numeric",
      month: "long",
      year: "numeric",
      weekday: "long",
    }
  );

  const hour = new Date().getHours();

  const greet =
    hour < 12
      ? "Good morning"
      : hour < 17
      ? "Good afternoon"
      : "Good evening";


const apply = async (f) => {
  const data = await callApi(
    "/leave/applyLeave",
    "POST",
    {
      leaveType: f.leaveType,
      startDate: f.startDate,
      endDate: f.endDate,
      reason: f.reason,
    }
  );

  if (data?.success) {
    toast.success("Leave request submitted successfully");

    fetchDashboard();
    fetchRecentLeaves();

    return true;
  }

  toast.error(
    data?.message || "Failed to apply for leave"
  );

  return false;
};

  return (
    <Box>
      {/* Header */}
      <Typography
        fontSize={12}
        color="text.secondary"
      >
        {today}
      </Typography>

      <Typography
        sx={{
          fontSize: { xs: 24, md: 28 },
          fontWeight: 600,
          color: "#1F2937",
          letterSpacing: "-0.4px",
          mt: 0.5,
        }}
      >
        {greet}, Manish{" "}
        <span style={{ fontWeight: 400 }}>
          👋
        </span>
      </Typography>

      <Typography
        fontSize={14}
        color="text.secondary"
        mb={3}
      >
        Here's your leave overview for a productive day.
      </Typography>

      {/* Leave statistics */}
        <Box
        sx={{
            display: "grid",
            gap: 2.5,
            gridTemplateColumns: {
            xs: "1fr",
            md: "repeat(3, 1fr)",
            },
            mb: 3,
        }}
        >
        <StatCard
            title="Casual Leave"
            icon={<EventNoteRounded />}
            color="#4f46e5"
            bg="#e0e7ff"
            cardBg="#eef2ff"
            value={dashboard?.casualLeave?.remaining}
            total={dashboard?.casualLeave?.total}
            unit="days remaining"
            progress={
            (dashboard.casualLeave.remaining /
                dashboard.casualLeave.total) *
            100
            }
            bar="#5b5bd6"
        />

        <StatCard
            title="Sick Leave"
            icon={<MedicalServicesOutlined />}
            color="#16a34a"
            bg="#dcfce7"
            cardBg="#ecfdf3"
            value={dashboard.sickLeave.remaining}
            total={dashboard.sickLeave.total}
            unit="days remaining"
            progress={
            (dashboard.sickLeave.remaining /
                dashboard.sickLeave.total) *
            100
            }
            bar="#22c55e"
        />

        <StatCard
            title="Pending Requests"
            icon={<AccessTimeRounded />}
            color="#d97706"
            bg="#fde68a"
            cardBg="#fff7e6"
            value={dashboard.pendingRequests}
            unit="leave requests"
            progress={Math.min(
            dashboard.pendingRequests * 20,
            100
            )}
            bar="#f59e0b"
        />
        </Box>

      {/* Recent requests */}
      <Paper
        variant="outlined"
        sx={{
          p: 3,
          borderColor: "#eef0f4",
          boxShadow:
            "0 2px 10px rgba(17,24,39,.04)",
        }}
      >
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          mb={2.5}
        >
          <Box>
          <Typography
            variant="h6"
            fontWeight={600}
            >
            Recent Leave Requests
          </Typography>

            <Typography
              fontSize={13}
              color="text.secondary"
            >
              Your latest leave applications
            </Typography>
          </Box>

          <Button
            variant="contained"
            startIcon={<AddRounded />}
            onClick={() => setOpen(true)}
            sx={{
              px: 3,
              py: 1.2,
              borderRadius: 2.5,
              boxShadow:
                "0 6px 14px rgba(79,70,229,.3)",
            }}
          >
            Apply Leave
          </Button>
        </Stack>

        <Box
          sx={{
            border: "1px solid #eef0f4",
            borderRadius: 2.5,
            overflow: "hidden",
          }}
        >
          <Row
            head
            cells={[
              "Leave Type",
              "Date Range",
              "Days",
              "Status",
              "",
            ]}
          />


     {leaves?.slice(0, 5).map((l) => {
        const t = typeStyle[l.leaveType];
        const s = statusStyle[l.status];

        return (
            <Row
            key={l._id}
            cells={[
                <Stack
                direction="row"
                spacing={1.5}
                alignItems="center"
                >
                <Box
                    sx={{
                    bgcolor: t.bg,
                    color: t.color,
                    p: 0.9,
                    borderRadius: "50%",
                    display: "flex",
                    "& svg": {
                        fontSize: 20,
                    },
                    }}
                >
                    {t.icon}
                </Box>

                <Typography
                    fontSize={13}
                    fontWeight={700}
                >
                    {t.label}
                </Typography>
                </Stack>,

                <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                >
                <CalendarTodayOutlined
                    sx={{ fontSize: 16 }}
                />

                <Typography fontSize={13}>
                    {fmt(l.startDate)} - {fmt(l.endDate)}
                </Typography>
                </Stack>,

                <Typography fontSize={13}>
                {daysBetween(l.startDate, l.endDate)} Days
                </Typography>,

                <Chip
                icon={s.icon}
                label={
                    l.status.charAt(0).toUpperCase() +
                    l.status.slice(1)
                }
                size="small"
                sx={{
                    bgcolor: s.bg,
                    color: s.color,
                    fontWeight: 700,
                    "& .MuiChip-icon": {
                    color: s.color,
                    fontSize: 16,
                    },
                }}
                />,

                <IconButton
                size="small"
                onClick={() =>
                    toast("Options coming soon")
                }
                >
                <MoreHorizRounded />
                </IconButton>,
            ]}
            />
        );
        })}

          
        </Box>

        <Button
          fullWidth
          endIcon={<ArrowForwardRounded />}
          component={NavLink}
          to="/leaves"
          sx={{
            mt: 2,
            py: 1.4,
            bgcolor: "#eef0ff",
            color: "#3730a3",
            borderRadius: 2.5,
            "&:hover": {
              bgcolor: "#e0e4ff",
            },
          }}
        >
          View Leave History
        </Button>
      </Paper>

      {/* Apply Leave Dialog */}
      <ApplyLeaveDialog
        open={open}
        onClose={() => setOpen(false)}
        onSubmit={apply}
      />
    </Box>
  );
}

function Row({ cells, head }) {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "1.4fr 1.6fr .6fr 1fr 40px",
          md: "1.2fr 1.6fr .6fr 1fr 40px",
        },
        alignItems: "center",
        gap: 1,
        px: 2,
        py: head ? 1.3 : 1.6,
        bgcolor: head ? "#f9fafb" : "#fff",
        borderTop: head
          ? "none"
          : "1px solid #eef0f4",
        color: head
          ? "text.secondary"
          : "inherit",
        fontSize: 13,
        overflowX: "auto",
      }}
    >
      {cells.map((c, i) => (
        <Box key={i}>{c}</Box>
      ))}
    </Box>
  );
}

export default Dashboard;