const express = require("express");
const app = express();
const cors = require("cors");
const authRoutes = require("./modules/auth/auth.routes");
const userRoutes = require("./modules/users/users.routes");
const authMiddleware = require("./middlewares/auth.middleware");
const postRoutes = require("./modules/posts/posts.routes");
const commentsRoutes = require("./modules/comments/comments.routes");
const notificationsRoutes = require("./modules/notifications/notifications.routes");

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.json({ message: "Blog API running" });
});
app.use("/auth", authRoutes);
app.use("/users", authMiddleware, userRoutes);
app.use("/posts", authMiddleware, postRoutes);
app.use("/posts/comments", authMiddleware, commentsRoutes);
app.use("/notifications", authMiddleware, notificationsRoutes);
app.use("/uploads", express.static("uploads"));

module.exports = app;