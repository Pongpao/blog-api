const router = require("express").Router({ mergeParams: true });
const controller = require("./users.controller");
const auth = require("../../middlewares/auth.middleware");
const upload = require("../../middlewares/uploads.middleware");

router.get("/me", auth, controller.getProfile);
router.get("/:id", auth, controller.getProfile);
router.put("/me", auth, upload.single("avatar"), controller.updateProfile);
router.post("/follow", auth, controller.followUser);
router.delete("/follow", auth, controller.unfollowUser);
router.get("/followers/:id", auth, controller.countFollowers);
router.get("/following/:id", auth, controller.countFollowing);

module.exports = router;