import express, { Request, Response } from "express";
import client from "prom-client";

const app = express();
const PORT = process.env.PORT || 3000;

// Create a Registry to register the metrics
const register = new client.Registry();

// Default metrics like CPU, memory, event loop lag, etc.
client.collectDefaultMetrics({ register });

// ----------------------
// Custom counter metric
// ----------------------
let httpRequests = register.getSingleMetric("http_requests_total") as client.Counter<string>;
if (!httpRequests) {
  httpRequests = new client.Counter({
    name: "http_requests_total",
    help: "Total number of HTTP requests",
    labelNames: ["method", "route", "status"],
  });
  register.registerMetric(httpRequests);
}

// ----------------------
// Node.js version info metric
// ----------------------
let nodeVersion = register.getSingleMetric("nodejs_version_info") as client.Gauge<string>;
if (!nodeVersion) {
  nodeVersion = new client.Gauge({
    name: "nodejs_version_info",
    help: "Node.js version info",
    labelNames: ["version"],
  });
  nodeVersion.labels(process.version).set(1);
  register.registerMetric(nodeVersion);
}

// ----------------------
// Middleware to count HTTP requests
// ----------------------
app.use((req: Request, res: Response, next) => {
  httpRequests.inc({ method: req.method, route: req.path, status: res.statusCode });
  next();
});

// ----------------------
// Metrics endpoint
// ----------------------
app.get("/metrics", async (req: Request, res: Response) => {
  res.set("Content-Type", register.contentType);
  res.end(await register.metrics());
});

// ----------------------
// Test endpoints
// ----------------------
app.get("/", (req: Request, res: Response) => {
  res.send("Hello jENKIS");
});

app.get("/health", (req: Request, res: Response) => {
  res.json({ status: "OK" });
});

// ----------------------
// Start server
// ----------------------
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
