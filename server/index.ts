import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";
import { handleChatRequest, loadLocalEnv } from "./chatApi";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");

async function startServer() {
  loadLocalEnv(projectRoot);

  const app = express();
  const server = createServer(app);

  app.use(express.json({ limit: "1mb" }));

  app.post("/api/chat", async (req, res) => {
    try {
      const result = await handleChatRequest(req.body);
      res.json(result);
    } catch (error) {
      console.error("Chat endpoint error:", error);
      res.status(500).json({
        reply: "Não consegui responder agora. Tente novamente em instantes.",
        risk: false,
        endReached: false,
        showProfessionals: false,
      });
    }
  });

  // Serve static files from dist/public in production
  const staticPath =
    process.env.NODE_ENV === "production"
      ? path.resolve(__dirname, "public")
      : path.resolve(__dirname, "..", "dist", "public");

  app.use(express.static(staticPath));

  // Handle client-side routing - serve index.html for all routes
  app.get("*", (_req, res) => {
    res.sendFile(path.join(staticPath, "index.html"));
  });

  const port = process.env.PORT || 3000;

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
