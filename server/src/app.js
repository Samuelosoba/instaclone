import express, { json } from "express";
import createHttpError, { isHttpError } from "http-errors";
import morgan from "morgan";
import cors from "cors";

//import routes
import userRoutes from "./routes/user.js";
import postRoutes from "./routes/post.js";
import commentRoutes from "./routes/comment.js";
const app = express();
const corsOptions = {
  origin: ["http://localhost:4600", "https://instaclone-robj.vercel.app"],
  optionsSuccessStatus: 200,
  methods: ["GET", "POST", "PATCH", "DELETE"],
  credentials: true,
};
app.use(cors(corsOptions));
app.use(morgan("dev"));
app.use(json({ limit: "25mb" })); //parses request to client side in json body format
app.use(express.urlencoded({ extended: true, limit: "25mb" }));
app.disable("x-powered-by"); //disable the tech stack

//api
app.use("/api/auth", userRoutes);
app.use("/api/post", postRoutes);
app.use("/api/comments", commentRoutes);
//handle route errors
app.use((req, res, next) => {
  return next(createHttpError(404, `Route $(req.originalUrl) not found`));
});

//handle specific app errors
app.use((error, req, res, next) => {
  console.error(error);
  let errorMessage = "Internal Server Error";
  let statusCode = 500;
  if (isHttpError(error)) {
    statusCode = error.status;
    errorMessage = error.message;
  }
  res.status(statusCode).json({ error: error.message });
});
export default app;
