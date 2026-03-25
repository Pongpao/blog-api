const router = require("express").Router();
const controller = require("./posts.controller");
const auth = require("../../middlewares/auth.middleware");
const { authorize } = require("../../middlewares/role.middleware");
const upload = require("../../middlewares/uploads.middleware");

router.post("/", auth, upload.single("image"), controller.createPost);
router.get("/", controller.getPosts);
router.put("/:id", auth, controller.updatePost);
router.delete(
    "/:id",
    auth,
    controller.deletePost
);

router.get("/all", auth, authorize("admin"), controller.getall);
router.post("/like", auth, controller.togglePostLike);

module.exports = router;
