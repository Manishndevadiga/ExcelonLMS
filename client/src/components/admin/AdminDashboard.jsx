import { useState, useEffect } from "react";

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
import CheckCircleRounded from "@mui/icons-material/CheckCircleRounded";
import CancelRounded from "@mui/icons-material/CancelRounded";
import CalendarTodayOutlined from "@mui/icons-material/CalendarTodayOutlined";
import ArrowForwardRounded from "@mui/icons-material/ArrowForwardRounded";
import PeopleOutlineRounded from "@mui/icons-material/PeopleOutlineRounded";

import { NavLink } from "react-router-dom";
import toast from "react-hot-toast";

import StatCard from "../common/StatCard";

import callApi from "../../common/scripts";


const typeStyle = {
  "Casual Leave": {
    icon: <EventNoteRounded />,
    color: "#4f46e5",
    bg: "#e0e7ff",
  },

  "Sick Leave": {
    icon: <MedicalServicesOutlined />,
    color: "#16a34a",
    bg: "#dcfce7",
  },

  "Earned Leave": {
    icon: <EventNoteRounded />,
    color: "#0891b2",
    bg: "#cffafe",
  },
};


const statusStyle = {
  Pending: {
    bg: "#fef3c7",
    color: "#b45309",
    icon: <AccessTimeRounded />,
  },

  Approved: {
    bg: "#dcfce7",
    color: "#15803d",
    icon: <CheckCircleRounded />,
  },

  Rejected: {
    bg: "#fee2e2",
    color: "#dc2626",
    icon: <CancelRounded />,
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


function AdminDashboard() {
  const [pendingLeaves, setPendingLeaves] = useState([]);
  const [employees, setEmployees] = useState([]);

  const [dashboard, setDashboard] = useState({
    totalEmployees: 0,
    pendingRequests: 0,
    approvedThisMonth: 0,
    rejectedThisMonth: 0,
  });


  useEffect(() => {
    fetchDashboard();
    fetchPendingLeaves();
    fetchEmployeeBalances();
  }, []);


  // Admin dashboard statistics
  const fetchDashboard = async () => {
    try {
      const data = await callApi("/leave/admin/dashboard");

      if (data?.success) {
        setDashboard(data.data);
      } else {
        toast.error(
          data?.message || "Failed to load dashboard"
        );
      }
    } catch (error) {
      console.error("Fetch admin dashboard error:", error);

      toast.error("Failed to load dashboard");
    }
  };


  // Pending leave requests
  const fetchPendingLeaves = async () => {
    try {
      const data = await callApi(
        "/leave/admin/leaveRequests?status=pending"
      );

      if (data?.success) {
        setPendingLeaves(data.data);
      } else {
        toast.error(
          data?.message || "Failed to load leave requests"
        );
      }
    } catch (error) {
      console.error(
        "Fetch pending leaves error:",
        error
      );

      toast.error("Failed to load leave requests");
    }
  };


  // Employee leave balances
  const fetchEmployeeBalances = async () => {
    try {
      const data = await callApi(
        "/leave/admin/employeeBalances"
      );

      if (data?.success) {
        setEmployees(data.data);
      } else {
        toast.error(
          data?.message ||
            "Failed to load employee balances"
        );
      }
    } catch (error) {
      console.error(
        "Fetch employee balances error:",
        error
      );

      toast.error("Failed to load employee balances");
    }
  };


  // Approve / Reject leave
  const updateLeaveStatus = async (id, status) => {
    try {
      const data = await callApi(
        `/leave/admin/leaveRequests/${id}/status`,
        "PUT",
        {
          status,
        }
      );

      if (data?.success) {
        toast.success(
          `Leave request ${status} successfully`
        );

        // Remove the request from pending list
        setPendingLeaves((prev) =>
          prev.filter((leave) => leave._id !== id)
        );

        // Update pending count
        setDashboard((prev) => ({
          ...prev,
          pendingRequests:
            prev.pendingRequests - 1,

          ...(status === "approved" && {
            approvedThisMonth:
              prev.approvedThisMonth + 1,
          }),

          ...(status === "rejected" && {
            rejectedThisMonth:
              prev.rejectedThisMonth + 1,
          }),
        }));
      } else {
        toast.error(
          data?.message ||
            "Failed to update leave request"
        );
      }
    } catch (error) {
      console.error(
        "Update leave status error:",
        error
      );

      toast.error(
        "Failed to update leave request"
      );
    }
  };


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
        {greet}, Admin{" "}
        <span style={{ fontWeight: 400 }}>
          👋
        </span>
      </Typography>


      <Typography
        fontSize={14}
        color="text.secondary"
        mb={3}
      >
        Here's an overview of employee leave activity.
      </Typography>


      {/* Admin statistics */}

      <Box
        sx={{
          display: "grid",
          gap: 2.5,
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            md: "repeat(4, 1fr)",
          },
          mb: 3,
        }}
      >

        <StatCard
          title="Total Employees"
          icon={<PeopleOutlineRounded />}
          color="#4f46e5"
          bg="#e0e7ff"
          cardBg="#eef2ff"
          value={dashboard.totalEmployees}
          unit="employees"
          progress={100}
          bar="#5b5bd6"
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


        <StatCard
          title="Approved This Month"
          icon={<CheckCircleRounded />}
          color="#16a34a"
          bg="#dcfce7"
          cardBg="#ecfdf3"
          value={dashboard.approvedThisMonth}
          unit="approved requests"
          progress={100}
          bar="#22c55e"
        />


        <StatCard
          title="Rejected This Month"
          icon={<CancelRounded />}
          color="#dc2626"
          bg="#fee2e2"
          cardBg="#fef2f2"
          value={dashboard.rejectedThisMonth}
          unit="rejected requests"
          progress={100}
          bar="#ef4444"
        />

      </Box>


      {/* Pending Leave Requests */}

      <Paper
        variant="outlined"
        sx={{
          p: 3,
          borderColor: "#eef0f4",
          boxShadow:
            "0 2px 10px rgba(17,24,39,.04)",
          mb: 3,
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
              Pending Leave Requests
            </Typography>

            <Typography
              fontSize={13}
              color="text.secondary"
            >
              Leave requests waiting for your approval
            </Typography>

          </Box>


          <Button
            variant="text"
            endIcon={<ArrowForwardRounded />}
            component={NavLink}
            to="/leave-approval"
          >
            View All
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
              "Employee",
              "Leave Type",
              "Date Range",
              "Days",
              "Action",
            ]}
          />


          {pendingLeaves
            .slice(0, 5)
            .map((leave) => {

              const t =
                typeStyle[leave.leaveType] ||
                typeStyle["Casual Leave"];

              return (
                <Row
                  key={leave._id}
                  cells={[

                    <Typography
                      fontSize={13}
                      fontWeight={600}
                    >
                      {leave.employee?.name}
                    </Typography>,


                    <Stack
                      direction="row"
                      spacing={1}
                      alignItems="center"
                    >

                      <Box
                        sx={{
                          bgcolor: t.bg,
                          color: t.color,
                          p: 0.8,
                          borderRadius: "50%",
                          display: "flex",
                          "& svg": {
                            fontSize: 18,
                          },
                        }}
                      >
                        {t.icon}
                      </Box>

                      <Typography fontSize={13}>
                        {leave.leaveType}
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
                        {fmt(leave.startDate)} -{" "}
                        {fmt(leave.endDate)}
                      </Typography>

                    </Stack>,


                    <Typography fontSize={13}>
                      {daysBetween(
                        leave.startDate,
                        leave.endDate
                      )}{" "}
                      Days
                    </Typography>,


                    <Stack
                      direction="row"
                      spacing={0.5}
                    >

                      <IconButton
                        size="small"
                        sx={{
                          color: "#15803d",
                          bgcolor: "#dcfce7",
                          "&:hover": {
                            bgcolor: "#bbf7d0",
                          },
                        }}
                        onClick={() =>
                          updateLeaveStatus(
                            leave._id,
                            "approved"
                          )
                        }
                      >
                        <CheckCircleRounded fontSize="small" />
                      </IconButton>


                      <IconButton
                        size="small"
                        sx={{
                          color: "#dc2626",
                          bgcolor: "#fee2e2",
                          "&:hover": {
                            bgcolor: "#fecaca",
                          },
                        }}
                        onClick={() =>
                          updateLeaveStatus(
                            leave._id,
                            "rejected"
                          )
                        }
                      >
                        <CancelRounded fontSize="small" />
                      </IconButton>

                    </Stack>,
                  ]}
                />
              );
            })}


          {pendingLeaves.length === 0 && (
            <Box
              sx={{
                py: 4,
                textAlign: "center",
              }}
            >
              <Typography
                fontSize={14}
                color="text.secondary"
              >
                No pending leave requests
              </Typography>
            </Box>
          )}

        </Box>

      </Paper>


      {/* Employee Leave Balance */}

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
              Employee Leave Balance
            </Typography>

            <Typography
              fontSize={13}
              color="text.secondary"
            >
              Overview of employee leave balances
            </Typography>

          </Box>

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
              "Employee",
              "Casual Leave",
              "Sick Leave",
              "Total Used",
            ]}
          />


          {employees?.slice(0, 5).map((employee) => (
            <Row
              key={employee._id}
              cells={[

                <Typography
                  fontSize={13}
                  fontWeight={600}
                >
                  {employee.name}
                </Typography>,


                <Typography fontSize={13}>
                  {employee.casualLeave?.remaining ?? 0}
                  {" / "}
                  {employee.casualLeave?.total ?? 12}
                </Typography>,


                <Typography fontSize={13}>
                  {employee.sickLeave?.remaining ?? 0}
                  {" / "}
                  {employee.sickLeave?.total ?? 10}
                </Typography>,


                <Typography fontSize={13}>
                  {employee.totalUsed ?? 0} Days
                </Typography>,

              ]}
            />
          ))}


          {employees.length === 0 && (
            <Box
              sx={{
                py: 4,
                textAlign: "center",
              }}
            >
              <Typography
                fontSize={14}
                color="text.secondary"
              >
                No employee balance data
              </Typography>
            </Box>
          )}

        </Box>

      </Paper>

    </Box>
  );
}


function Row({ cells, head }) {
  return (
    <Box
      sx={{
        display: "grid",

        gridTemplateColumns: {
          xs: "1.4fr 1.6fr .6fr 1fr 80px",
          md: "1.2fr 1.5fr 1.8fr .7fr 100px",
        },

        alignItems: "center",
        gap: 1,
        px: 2,
        py: head ? 1.3 : 1.6,

        bgcolor: head
          ? "#f9fafb"
          : "#fff",

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
      {cells.map((cell, index) => (
        <Box key={index}>
          {cell}
        </Box>
      ))}
    </Box>
  );
}


export default AdminDashboard;