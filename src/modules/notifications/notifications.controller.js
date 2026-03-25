const service = require("./notifications.service");

exports.getNotifications = async (req, res) => {
    const userId = req.user.id;
    const notifications = await service.getNotifications(userId);
    res.status(200).json(notifications);
};

exports.markAllAsRead = async (req, res) => {
    const userId = req.user.id;
    await service.markAllAsRead(userId);
    res.status(200).json({ message: "All notifications marked as read" });
};
