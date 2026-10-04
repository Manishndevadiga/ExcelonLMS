import { Router } from "express";

import {
  applyLeave,
  getEmployeeDashboard,
  getRecentLeaves,
  getLeaveHistory,
  getAdminDashboard,
  getAdminLeaveRequests,
  updateLeaveStatus,
  getEmployeeBalances,
} from "../controllers/leave.controllers.js";

import { authUser } from "../middlewares/users.middleware.js";

const router = Router();


// =========================================
// EMPLOYEE ROUTES
// =========================================


// Dashboard
router.route("/dashboard").get(authUser,getEmployeeDashboard);

// Recent leaves
router.route("/recent").get(authUser,getRecentLeaves );

// Complete leave history
router.route("/history").get(authUser,getLeaveHistory);

// Apply for leave
router.route("/applyLeave").post(authUser,applyLeave
  );


// =========================================
// ADMIN ROUTES
// =========================================


// Admin dashboard
router.route("/admin/dashboard").get(authUser,getAdminDashboard);

// Admin leave requests
router.route("/admin/leaveRequests").get(authUser,getAdminLeaveRequests);

// Approve / Reject leave
router.route("/admin/leaveRequests/:id/status").put(authUser,updateLeaveStatus);

// Employee balances
router.route("/admin/employeeBalances").get(authUser, getEmployeeBalances );


export default router;