const db = require("../../config/db");

exports.createPost = async (userId, title, content, imageUrl) => {
    const result = await db.query(
        `INSERT INTO posts (user_id, title, content, image_url)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
        [userId, title, content, imageUrl]
    );

    return result.rows[0];
};
exports.getPosts = async (page, limit, search, sort) => {
    const offset = (page - 1) * limit;

    const result = await db.query(
        `
    SELECT posts.*, users.username, COUNT(likes.id) AS likes_count
    FROM posts 
    JOIN users ON posts.user_id = users.id
    LEFT JOIN likes ON posts.id = likes.post_id
    WHERE deleted_at IS NULL
    AND title ILIKE $1
    GROUP BY posts.id, users.username
    ORDER BY created_at ${sort === "asc" ? "ASC" : "DESC"}
    LIMIT $2 OFFSET $3
    `,
        [`%${search}%`, limit, offset]
    );

    return result.rows;
};
exports.updatePost = async (postId, userId, title, content) => {
    const post = await db.query(
        "SELECT user_id FROM posts WHERE id = $1",
        [postId]
    );

    if (!post.rows.length) throw new Error("Post not found");

    if (post.rows[0].user_id !== userId)
        throw new Error("Forbidden");

    const updated = await db.query(
        `UPDATE posts
     SET title = $1, content = $2
     WHERE id = $3
     RETURNING *`,
        [title, content, postId]
    );

    return updated.rows[0];
};
exports.deletePost = async (postId, userId) => {
    const post = await db.query(
        "SELECT user_id FROM posts WHERE id = $1",
        [postId]
    );

    if (post.rows[0].user_id !== userId)
        throw new Error("Forbidden");

    await db.query(
        "UPDATE posts SET deleted_at = NOW() WHERE id = $1",
        [postId]
    );
};
exports.getPostById = async (postId) => {
    const result = await db.query(
        "SELECT * FROM posts WHERE id = $1",
        [postId]
    );
    return result.rows[0];
};
exports.getall = async () => {
    const connection = await db.connect();
    try {
        const result = await connection.query(
            "SELECT * FROM posts"
        );
        return result.rows;
    } catch (err) {
        throw err;
    } finally {
        connection.release();
    }
};

exports.togglePostLike = async (postId, userId) => {

    const result = await db.query(
        `
    INSERT INTO likes (user_id, post_id)
    VALUES ($1, $2)
    ON CONFLICT (user_id, post_id)
    DO NOTHING
    RETURNING id
    `,
        [userId, postId]
    );

    // ถ้าเพิ่งไลก์
    if (result.rows.length) {

        // 1️⃣ หาเจ้าของโพสต์
        const post = await db.query(
            `SELECT user_id FROM posts WHERE id = $1`,
            [postId]
        );

        const ownerId = post.rows[0].user_id;

        // 2️⃣ ห้ามแจ้งเตือนตัวเอง
        if (ownerId !== userId) {
            await db.query(
                `
        INSERT INTO notifications
        (recipient_id, actor_id, type, post_id)
        VALUES ($1, $2, 'like', $3)
        `,
                [ownerId, userId, postId]
            );
        }

        return { liked: true };
    }

    // ถ้า unlike
    await db.query(
        `DELETE FROM likes WHERE user_id = $1 AND post_id = $2`,
        [userId, postId]
    );

    return { liked: false };
};
