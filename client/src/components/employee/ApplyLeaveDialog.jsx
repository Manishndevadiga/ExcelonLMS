import { useState } from "react";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  TextField,
  MenuItem,
  Button,
} from "@mui/material";

import toast from "react-hot-toast";

function ApplyLeaveDialog({ open, onClose, onSubmit }) {
  const [f, setF] = useState({
    leaveType: "casual",
    startDate: "",
    endDate: "",
    reason: "",
  });

  const set = (key) => (e) => {
    setF({
      ...f,
      [key]: e.target.value,
    });
  };

  const submit = async () => {
    // Validate dates
    if (!f.startDate || !f.endDate) {
      return toast.error("Select both dates");
    }

    // Validate reason
    if (!f.reason.trim()) {
      return toast.error("Please enter a reason");
    }

    // Validate date order
    if (new Date(f.endDate) < new Date(f.startDate)) {
      return toast.error("End date is before start date");
    }

    const success = await onSubmit(f);

    // Only clear the form if backend submission succeeded
    if (success) {
      setF({
        leaveType: "casual",
        startDate: "",
        endDate: "",
        reason: "",
      });

       onClose();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="xs"
    >
      <DialogTitle fontWeight={700}>
        Apply Leave
      </DialogTitle>

      <DialogContent>
        <Stack spacing={2} mt={1}>
          {/* Leave Type */}
          <TextField
            select
            label="Leave type"
            value={f.leaveType}
            onChange={set("leaveType")}
            fullWidth
          >
            <MenuItem value="casual">
              Casual Leave
            </MenuItem>

            <MenuItem value="sick">
              Sick Leave
            </MenuItem>

            <MenuItem value="earned">
              Earned Leave
            </MenuItem>
          </TextField>

          {/* Start Date */}
          <TextField
            type="date"
            label="From"
            value={f.startDate}
            onChange={set("startDate")}
            InputLabelProps={{
              shrink: true,
            }}
            fullWidth
          />

          {/* End Date */}
          <TextField
            type="date"
            label="To"
            value={f.endDate}
            onChange={set("endDate")}
            InputLabelProps={{
              shrink: true,
            }}
            fullWidth
          />

          {/* Reason */}
          <TextField
            label="Reason"
            value={f.reason}
            onChange={set("reason")}
            multiline
            rows={3}
            placeholder="Enter reason for leave"
            fullWidth
          />
        </Stack>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose}>
          Cancel
        </Button>

        <Button
          variant="contained"
          onClick={submit}
        >
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ApplyLeaveDialog;