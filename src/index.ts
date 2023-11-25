import express from "express";
import watcherRoutes from "./routes/watcher.routes";
import cors from "cors";

const app = express();
const port = 8000;
// TODO: Change to env variable
const allowedOrigins = ["http://localhost:3000"];
const options: cors.CorsOptions = {
  origin: allowedOrigins,
};
app.use(cors(options));
app.use(watcherRoutes);
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
