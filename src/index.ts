import express, { Request, Response } from "express";
import client from "prom-client";
const app = express();
const PORT = process.env.PORT || 3000;

// Create a Registry to register the metrics
const register = new client.Registry();
// Default metrics like CPU, memory, event loop lag, etc.
client.collectDefaultMetrics({ register });



// Custom counter metric
const httpRequests = new client.Counter({
  name: "http_requests_total",
  help: "Total number of HTTP requests",
  labelNames: ["method", "route", "status"],
});

register.registerMetric(httpRequests);

// custom middleware to count HTTP requests
app.use((req: Request, res: Response, next) => {
  httpRequests.inc({ method: req.method, route: req.path, status: res.statusCode });
  next();
});

// GET /hello
app.get("/", (req: Request, res: Response) => {
  res.send("Hello from nodeApp infront of sakib");

});

// GET /health
app.get("/health", (req: Request, res: Response) => {
  res.json({ status: "OK" });
});

app.listen(PORT , () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
