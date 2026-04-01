import path from "path";
import { createServer } from "./index";
import { closeDatabase } from "./db";
import * as express from "express";

const port = process.env.PORT || 3000;

// Start server
(async () => {
  const app = await createServer();

  // In production, serve the built SPA files
  const __dirname = import.meta.dirname;
  const distPath = path.join(__dirname, "../spa");

  // Serve static files
  app.use(express.static(distPath));

  // Handle React Router - serve index.html for all non-API routes
  app.get("*", (req, res) => {
    // Don't serve index.html for API routes
    if (req.path.startsWith("/api/") || req.path.startsWith("/health")) {
      return res.status(404).json({ error: "API endpoint not found" });
    }

    res.sendFile(path.join(distPath, "index.html"));
  });

  app.listen(port, () => {
    console.log(`🚀 Fusion Starter server running on port ${port}`);
    console.log(`📱 Frontend: http://localhost:${port}`);
    console.log(`🔧 API: http://localhost:${port}/api`);
  });

  // Graceful shutdown
  process.on("SIGTERM", async () => {
    console.log("🛑 Received SIGTERM, shutting down gracefully");
    await closeDatabase();
    process.exit(0);
  });

  process.on("SIGINT", async () => {
    console.log("🛑 Received SIGINT, shutting down gracefully");
    await closeDatabase();
    process.exit(0);
  });
})();
