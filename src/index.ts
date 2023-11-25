import express from "express";
import watcherRoutes from "./routes/watcher.routes";

const app = express();
const port = 8000;

app.use(watcherRoutes);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
