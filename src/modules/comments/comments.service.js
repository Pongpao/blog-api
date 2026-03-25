const db = require("../../config/db");

exports.create = async ({ content, postId, userId, parent_id }) => {
    const result = await db.query(
        `
    INSERT INTO comments (content, post_id, user_id, parent_id)
    VALUES ($1, $2, $3, $4)
    RETURNING *
    `,
        [content, postId, userId, parent_id || null]
    );

    return result.rows[0];
};
exports.getByPostId = async (postId) => {
    const result = await db.query(
        `
        SELECT c.*, u.username, COUNT(likes.id) AS likes_count
        FROM comments c
        JOIN users u ON c.user_id = u.id
        LEFT JOIN likes ON c.id = likes.comment_id
        WHERE c.post_id = $1
        AND c.deleted_at IS NULL
        GROUP BY c.id, u.username
        ORDER BY c.created_at ASC
        `,
        [postId]
    );

    return buildTree(result.rows);
};


exports.delete = async ({ commentId, userId }) => {
    const comment = await db.query(
        `SELECT * FROM comments WHERE id = $1`,
        [commentId]
    );
    if (!comment.rows.length) throw new Error("Not found");

    const data = comment.rows[0];

    if (data.user_id !== userId && userId !== "admin") {
        throw new Error("Forbidden");
    }

    await db.query(
        `
    UPDATE comments
    SET deleted_at = CURRENT_TIMESTAMP
    WHERE id = $1
    `,
        [commentId]
    );
};
exports.update = async ({ content, commentId, userId }) => {
    // 1️⃣ ดึง comment ปัจจุบัน
    const existing = await db.query(
        `SELECT * FROM comments WHERE id = $1 AND deleted_at IS NULL`,
        [commentId]
    );

    if (!existing.rows.length) return null;

    const oldComment = existing.rows[0];

    // 2️⃣ เก็บ version เก่า
    await db.query(
        `
    INSERT INTO comment_versions (comment_id, content, edited_by)
    VALUES ($1, $2, $3)
    `,
        [commentId, oldComment.content, userId]
    );

    // 3️⃣ update version ล่าสุด
    const updated = await db.query(
        `
    UPDATE comments
    SET content = $1,
    updated_at = CURRENT_TIMESTAMP
    WHERE id = $2
    RETURNING *
    `,
        [content, commentId]
    );

    return updated.rows[0];
};
exports.getHistory = async ({ commentId }) => {
    const result = await db.query(
        `
    SELECT cv.*, u.username
    FROM comment_versions cv
    JOIN users u ON cv.edited_by = u.id
    WHERE cv.comment_id = $1
    ORDER BY cv.edited_at DESC
    `,
        [commentId]
    );
    return result.rows;
};

exports.toggleCommentLike = async (commentId, userId) => {
    const result = await db.query(
        `
    INSERT INTO likes (user_id, comment_id)
    VALUES ($1, $2)
    ON CONFLICT (user_id, comment_id)
    DO NOTHING
    RETURNING id
    `,
        [userId, commentId]
    );

    if (result.rows.length) {
        const comment = await db.query(
            `SELECT user_id FROM comments WHERE id = $1`,
            [commentId]
        );
        const ownerId = comment.rows[0].user_id;
        if (ownerId !== userId) {
            await db.query(
                `
                INSERT INTO notifications
                (recipient_id, actor_id, type, comment_id)
                VALUES ($1, $2, 'like', $3)
                `,
                [ownerId, userId, commentId]
            );
        }
        return { liked: true };
    }

    await db.query(
        `
    DELETE FROM likes
    WHERE user_id = $1 AND comment_id = $2
    `,
        [userId, commentId]
    );

    return { liked: false };
};

function buildTree(comments) {
    const map = {};
    const roots = [];

    comments.forEach(c => {
        c.replies = [];
        map[c.id] = c;
    });

    comments.forEach(c => {
        if (c.parent_id) {
            map[c.parent_id]?.replies.push(c);
        } else {
            roots.push(c);
        }
    });

    return roots;
};


