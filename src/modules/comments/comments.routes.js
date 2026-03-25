const router = require("express").Router({ mergeParams: true });
const controller = require("./comments.controller");
const authMiddleware = require("../../middlewares/auth.middleware");

router.post("/", controller.createComment);
router.get("/:postId", controller.getByPostId);
router.put("/:commentId", authMiddleware, controller.updateComment);
router.delete("/:commentId", authMiddleware, controller.deleteComment);
router.get("/history/:commentId", authMiddleware, controller.getHistory);
router.post("/like", authMiddleware, controller.toggleCommentLike);

module.exports = router;
