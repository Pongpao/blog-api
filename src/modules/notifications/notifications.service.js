const db = require("../../config/db");

exports.getNotifications = async (userId) => {
    const result = await db.query(
        `
        SELECT n.*, u.username
        FROM notifications n
        JOIN users u ON n.actor_id = u.id
        WHERE n.recipient_id = $1
        ORDER BY n.created_at DESC
        `,
        [userId]
    );
    return result.rows;
};  

exports.markAllAsRead = async (userId) => {
  await db.query(
    `
    UPDATE notifications
    SET is_read = TRUE
    WHERE recipient_id = $1
    AND is_read = FALSE
    `,
    [userId]
  );
};

    