const userService = require("./users.service");
const fs = require("fs");
const path = require("path");


exports.getProfile = async (req, res) => {
    const userId = req.params.id || req.user.id;
    const user = await userService.getProfile(userId);

    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
};

exports.updateProfile = async (req, res) => {
    const { bio } = req.body;
    const userId = req.user.id;

    const avatarUrl = req.file
        ? `/uploads/${req.file.filename}`
        : null;

    const { user, oldAvatar } =
        await userService.updateProfile(bio, userId, avatarUrl);

    if (avatarUrl && oldAvatar) {
        const oldPath = path.join(__dirname, "../../..", oldAvatar);

        fs.unlink(oldPath, (err) => {
            if (err) {
                console.error("Failed to delete old avatar:", err.message);
            }
        });
    }

    res.json(user);
};


exports.followUser = async (req, res) => {
    console.log()
    const { followingId } = req.body;
    const followerId = req.user.id;
    const result = await userService.followUser(followerId, followingId);
    res.json(result);
};

exports.unfollowUser = async (req, res) => {
    const { followingId } = req.body;
    const followerId = req.user.id;
    const result = await userService.unfollowUser(followerId, followingId);
    res.json(result);
};

exports.countFollowers = async (req, res) => {
    const userId = req.params.id;
    const count = await userService.countFollowers(userId);
    res.json(count);
};

exports.countFollowing = async (req, res) => {
    const userId = req.params.id;
    const count = await userService.countFollowing(userId);
    res.json(count);
};

