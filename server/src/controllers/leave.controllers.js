import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import Leave from "../models/leave.model.js";
import { User } from "../models/user.model.js";


// -----------------------------------------
// Leave limits
// -----------------------------------------

const LEAVE_LIMITS = {
  casual: 12,
  sick: 10,
  earned: 15,
};


// -----------------------------------------
// Calculate number of leave days
// -----------------------------------------

const calculateDays = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);

  return (
    Math.floor(
      (end - start) / (1000 * 60 * 60 * 24)
    ) + 1
  );
};


// -----------------------------------------
// Get approved leave usage
// -----------------------------------------

const getLeaveUsage = async (employeeId) => {
  const leaves = await Leave.find({
    employee: employeeId,
    status: "approved",
  });

  const usage = {
    casual: 0,
    sick: 0,
    earned: 0,
  };

  leaves.forEach((leave) => {
    const days = calculateDays(
      leave.startDate,
      leave.endDate
    );

    usage[leave.leaveType] += days;
  });

  return usage;
};


// =========================================
// EMPLOYEE
// =========================================


// -----------------------------------------
// Apply Leave
// POST /api/leave/applyLeave
// -----------------------------------------

const applyLeave = asyncHandler(async (req, res) => {
  const {
    leaveType,
    startDate,
    endDate,
    reason,
  } = req.body;

  const employeeId = req.user._id;


  // Validate fields

  if (
    !leaveType ||
    !startDate ||
    !endDate ||
    !reason ||
    !reason.trim()
  ) {
    throw new ApiError(
      400,
      "All leave fields are required"
    );
  }


  // Validate leave type

  if (!["casual", "sick", "earned"].includes(leaveType)) {
    throw new ApiError(
      400,
      "Invalid leave type"
    );
  }


  // Validate dates

  const start = new Date(startDate);
  const end = new Date(endDate);

  if (
    Number.isNaN(start.getTime()) ||
    Number.isNaN(end.getTime())
  ) {
    throw new ApiError(
      400,
      "Invalid leave dates"
    );
  }

  if (end < start) {
    throw new ApiError(
      400,
      "End date cannot be before start date"
    );
  }


  // Calculate requested days

  const requestedDays = calculateDays(
    start,
    end
  );


  // Check leave balance

  const usage = await getLeaveUsage(
    employeeId
  );

  const remaining =
    LEAVE_LIMITS[leaveType] -
    usage[leaveType];

  if (requestedDays > remaining) {
    throw new ApiError(
      400,
      `Only ${remaining} ${leaveType} leave days remaining`
    );
  }


  // Check overlapping leaves

  const overlappingLeave = await Leave.findOne({
    employee: employeeId,
    status: {
      $in: ["pending", "approved"],
    },
    startDate: {
      $lte: end,
    },
    endDate: {
      $gte: start,
    },
  });

  if (overlappingLeave) {
    throw new ApiError(
      400,
      "You already have a leave request for these dates"
    );
  }


  // Create leave

  const leave = await Leave.create({
    employee: employeeId,
    leaveType,
    startDate: start,
    endDate: end,
    reason: reason.trim(),
    status: "pending",
  });


  const createdLeave = await Leave.findById(
    leave._id
  ).populate(
    "employee",
    "name email"
  );


  return res.status(201).json({
    success: true,
    data: createdLeave,
    message: "Leave request submitted successfully",
  });
});


// -----------------------------------------
// Employee Dashboard
// GET /api/leave/dashboard
// -----------------------------------------

const getEmployeeDashboard = asyncHandler(
  async (req, res) => {

    const employeeId = req.user._id;

    const usage = await getLeaveUsage(
      employeeId
    );


    const pendingRequests =
      await Leave.countDocuments({
        employee: employeeId,
        status: "pending",
      });


    return res.status(200).json({
      success: true,
      data: {
        casualLeave: {
          used: usage.casual,
          total: LEAVE_LIMITS.casual,
          remaining:
            LEAVE_LIMITS.casual -
            usage.casual,
        },

        sickLeave: {
          used: usage.sick,
          total: LEAVE_LIMITS.sick,
          remaining:
            LEAVE_LIMITS.sick -
            usage.sick,
        },

        earnedLeave: {
          used: usage.earned,
          total: LEAVE_LIMITS.earned,
          remaining:
            LEAVE_LIMITS.earned -
            usage.earned,
        },

        pendingRequests,
      },
    });
  }
);


// -----------------------------------------
// Recent Leaves
// GET /api/leave/recent
// -----------------------------------------

const getRecentLeaves = asyncHandler(
  async (req, res) => {

    const leaves = await Leave.find({
      employee: req.user._id,
    })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate(
        "employee",
        "name email"
      );


    return res.status(200).json({
      success: true,
      data: leaves,
    });
  }
);


// -----------------------------------------
// Leave History
// GET /api/leave/history
// -----------------------------------------

const getLeaveHistory = asyncHandler(
  async (req, res) => {

    const leaves = await Leave.find({
      employee: req.user._id,
    })
      .sort({ createdAt: -1 });


    return res.status(200).json({
      success: true,
      data: leaves,
    });
  }
);


// =========================================
// ADMIN
// =========================================


// -----------------------------------------
// Admin Dashboard
// GET /api/admin/dashboard
// -----------------------------------------

const getAdminDashboard = asyncHandler(
  async (req, res) => {

    // Only admin

    if (req.user.role !== "admin") {
      throw new ApiError(
        403,
        "Admin access required"
      );
    }


    const totalEmployees =
      await User.countDocuments({
        role: "employee",
      });


    const pendingRequests =
      await Leave.countDocuments({
        status: "pending",
      });


    // Current month

    const now = new Date();

    const startOfMonth = new Date(
      now.getFullYear(),
      now.getMonth(),
      1
    );

    const startOfNextMonth = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      1
    );


    const approvedThisMonth =
      await Leave.countDocuments({
        status: "approved",
        createdAt: {
          $gte: startOfMonth,
          $lt: startOfNextMonth,
        },
      });


    const rejectedThisMonth =
      await Leave.countDocuments({
        status: "rejected",
        createdAt: {
          $gte: startOfMonth,
          $lt: startOfNextMonth,
        },
      });


    return res.status(200).json({
      success: true,
      data: {
        totalEmployees,
        pendingRequests,
        approvedThisMonth,
        rejectedThisMonth,
      },
    });
  }
);


// -----------------------------------------
// Admin Leave Requests
// GET /api/admin/leaveRequests
// -----------------------------------------

const getAdminLeaveRequests = asyncHandler(
  async (req, res) => {

    if (req.user.role !== "admin") {
      throw new ApiError(
        403,
        "Admin access required"
      );
    }


    const { status } = req.query;


    const filter = {};

    if (
      status &&
      ["pending", "approved", "rejected"].includes(status)
    ) {
      filter.status = status;
    }


    const leaves = await Leave.find(filter)
      .sort({ createdAt: -1 })
      .populate(
        "employee",
        "name email"
      );


    return res.status(200).json({
      success: true,
      data: leaves,
    });
  }
);


// -----------------------------------------
// Approve / Reject Leave
// PUT /api/admin/leaveRequests/:id/status
// -----------------------------------------

const updateLeaveStatus = asyncHandler(
  async (req, res) => {

    if (req.user.role !== "admin") {
      throw new ApiError(
        403,
        "Admin access required"
      );
    }


    const { id } = req.params;

    const {
      status,
      rejectionReason,
    } = req.body;


    if (
      !["approved", "rejected"].includes(status)
    ) {
      throw new ApiError(
        400,
        "Status must be approved or rejected"
      );
    }


    const leave = await Leave.findById(id);

    if (!leave) {
      throw new ApiError(
        404,
        "Leave request not found"
      );
    }


    if (leave.status !== "pending") {
      throw new ApiError(
        400,
        "Only pending leave requests can be updated"
      );
    }


    // If approving, check balance again

    if (status === "approved") {

      const usage = await getLeaveUsage(
        leave.employee
      );

      const requestedDays = calculateDays(
        leave.startDate,
        leave.endDate
      );

      const remaining =
        LEAVE_LIMITS[leave.leaveType] -
        usage[leave.leaveType];


      if (requestedDays > remaining) {
        throw new ApiError(
          400,
          "Employee does not have enough leave balance"
        );
      }
    }


    leave.status = status;


    if (status === "rejected") {
      leave.rejectionReason =
        rejectionReason?.trim() || "";
    } else {
      leave.rejectionReason = undefined;
    }


    await leave.save();


    const updatedLeave =
      await Leave.findById(leave._id)
        .populate(
          "employee",
          "name email"
        );


    return res.status(200).json({
      success: true,
      data: updatedLeave,
      message:
        status === "approved"
          ? "Leave approved successfully"
          : "Leave rejected successfully",
    });
  }
);


// -----------------------------------------
// Employee Leave Balances
// GET /api/admin/employeeBalances
// -----------------------------------------

const getEmployeeBalances = asyncHandler(
  async (req, res) => {

    if (req.user.role !== "admin") {
      throw new ApiError(
        403,
        "Admin access required"
      );
    }


    const employees =
      await User.find({
        role: "employee",
      }).select(
        "_id name email"
      );


    const result = [];


    for (const employee of employees) {

      const usage =
        await getLeaveUsage(employee._id);


      result.push({
        _id: employee._id,
        name: employee.name,
        email: employee.email,

        casualLeave: {
          used: usage.casual,
          total: LEAVE_LIMITS.casual,
          remaining:
            LEAVE_LIMITS.casual -
            usage.casual,
        },

        sickLeave: {
          used: usage.sick,
          total: LEAVE_LIMITS.sick,
          remaining:
            LEAVE_LIMITS.sick -
            usage.sick,
        },

        earnedLeave: {
          used: usage.earned,
          total: LEAVE_LIMITS.earned,
          remaining:
            LEAVE_LIMITS.earned -
            usage.earned,
        },
      });
    }


    return res.status(200).json({
      success: true,
      data: result,
    });
  }
);


export {
  applyLeave,
  getEmployeeDashboard,
  getRecentLeaves,
  getLeaveHistory,
  getAdminDashboard,
  getAdminLeaveRequests,
  updateLeaveStatus,
  getEmployeeBalances,
};