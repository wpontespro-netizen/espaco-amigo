import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";
import {
  completeGoogleAuth,
  createGoogleAuthStart,
  createLogoutCookie,
  getSessionUser,
  serializeCookie,
} from "./authApi";
import { handleChatRequest, loadLocalEnv } from "./chatApi";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");

async function startServer() {
  loadLocalEnv(projectRoot);

  const app = express();
  app.set("trust proxy", true);
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

  app.get("/api/auth/google/start", (req, res) => {
    try {
      const result = createGoogleAuthStart(getRequestBaseUrl(req));
      res.setHeader("Set-Cookie", result.cookies.map(serializeCookie));
      res.redirect(result.redirectUrl);
    } catch (error) {
      console.error("Google auth start error:", error);
      res.status(500).send("Login com Google não está configurado.");
    }
  });

  app.get("/api/auth/google/callback", async (req, res) => {
    try {
      const result = await completeGoogleAuth({
        baseUrl: getRequestBaseUrl(req),
        code: typeof req.query.code === "string" ? req.query.code : undefined,
        cookieHeader: req.headers.cookie,
        state: typeof req.query.state === "string" ? req.query.state : undefined,
      });
      res.setHeader("Set-Cookie", result.cookies.map(serializeCookie));
      res.redirect("/espaco");
    } catch (error) {
      console.error("Google auth callback error:", error);
      res.redirect("/?login=erro");
    }
  });

  app.get("/api/auth/session", (req, res) => {
    res.json({ user: getSessionUser(req.headers.cookie) });
  });

  app.post("/api/auth/logout", (req, res) => {
    res.setHeader("Set-Cookie", serializeCookie(createLogoutCookie(getRequestBaseUrl(req))));
    res.json({ ok: true });
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

function getRequestBaseUrl(req: express.Request) {
  const configuredUrl = process.env.APP_URL || process.env.NEXTAUTH_URL || process.env.AUTH_URL;
  if (configuredUrl) return configuredUrl.replace(/\/+$/, "");

  const proto = String(req.headers["x-forwarded-proto"] || req.protocol || "http").split(",")[0];
  const host = String(req.headers["x-forwarded-host"] || req.headers.host || `localhost:${process.env.PORT || 3000}`).split(",")[0];
  return `${proto}://${host}`;
}
