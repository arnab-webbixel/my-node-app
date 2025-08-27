import express, { Request, Response } from "express";

const app = express();
const PORT = process.env.PORT || 3000;

// GET /hello
app.get("/", (req: Request, res: Response) => {
  res.send("Hello from nodeApp");
});

// GET /health
app.get("/health", (req: Request, res: Response) => {
  res.json({ status: "OK" });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
