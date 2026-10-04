import "dotenv/config";

import { app } from "./app.js";
import connectDB from "./database/db.js";
import seedAdmin from "./database/seedAdmin.js";

const PORT = process.env.PORT || 4000;

const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();

    // Create admin if one does not exist
    await seedAdmin();

    // Start server
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server is running at port: ${PORT}`);
    });

  } catch (error) {
    console.error("Server startup failed:", error);
    process.exit(1);
  }
};

startServer();