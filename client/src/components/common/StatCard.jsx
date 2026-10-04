import {
  Paper,
  Box,
  Stack,
  Typography,
  LinearProgress,
} from "@mui/material";

import ChevronRightRounded from "@mui/icons-material/ChevronRightRounded";

function StatCard({
  title,
  icon,
  color,
  bg,
  cardBg,
  value,
  total,
  unit,
  progress,
  bar,
}) {
  return (
    <Paper
      variant="outlined"
      sx={{
        p: 2.5,
        bgcolor: cardBg,
        borderColor: "transparent",
        boxShadow: "0 2px 10px rgba(17,24,39,.05)",
        cursor: "pointer",
      }}
    >
      <Stack
        direction="row"
        spacing={2}
        alignItems="center"
      >
        {/* Icon */}
        <Box
          sx={{
            bgcolor: bg,
            color,
            p: 1.3,
            borderRadius: 2.5,
            display: "flex",
          }}
        >
          {icon}
        </Box>

        <Box flex={1}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography
              sx={{
                fontSize: 13,
                fontWeight: 500,
                color: "#374151",
              }}
            >
              {title}
            </Typography>

            <ChevronRightRounded fontSize="small" />
          </Stack>

          {/* Value */}
          <Typography
            sx={{
              fontSize: 28,
              fontWeight: 650,
              lineHeight: 1.2,
              color: "#1F2937",
            }}
          >
            {value}

            {total && (
              <Typography
                component="span"
                fontSize={20}
                fontWeight={500}
                color="text.secondary"
              >
                {" "}
                / {total}
              </Typography>
            )}
          </Typography>

          <Typography
            fontSize={12}
            color="text.secondary"
          >
            {unit}
          </Typography>
        </Box>
      </Stack>

      {/* Progress */}
      <LinearProgress
        variant="determinate"
        value={progress}
        sx={{
          mt: 2,
          height: 7,
          borderRadius: 4,
          bgcolor: "rgba(0,0,0,.08)",
          "& .MuiLinearProgress-bar": {
            bgcolor: bar,
            borderRadius: 4,
          },
        }}
      />
    </Paper>
  );
}

export default StatCard;