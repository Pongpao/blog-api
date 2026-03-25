const router = require("express").Router();
const controller = require("./notifications.controller");
const authMiddleware = require("../../middlewares/auth.middleware");

router.get("/", authMiddleware, controller.getNotifications);
router.put("/", authMiddleware, controller.markAllAsRead);

module.exports = router;    