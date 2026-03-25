const db = require("../../config/db");

exports.getProfile = async (userId) => {
    const result = await db.query(
        `
    SELECT
  u.id,
  u.username,
  u.bio,
  u.avatar_url,
  u.created_at,

  (SELECT COUNT(*) FROM follows WHERE following_id = u.id) AS followers_count,

  (SELECT COUNT(*) FROM follows WHERE follower_id = u.id) AS following_count

FROM users u
WHERE u.id = $1;

    `,
        [userId]
    );

    return result.rows[0];
};

exports.updateProfile = async (bio, userId, avatarUrl) => {
  const oldUser = await db.query(
    `SELECT avatar_url FROM users WHERE id = $1`,
    [userId]
  );

  const oldAvatar = oldUser.rows[0]?.avatar_url;

  const result = await db.query(
    `
    UPDATE users
    SET bio = $1,
        avatar_url = COALESCE($2, avatar_url),
        updated_at = CURRENT_TIMESTAMP
    WHERE id = $3
    RETURNING id, username, bio, avatar_url
    `,
    [bio, avatarUrl, userId]
  );

  return {
    user: result.rows[0],
    oldAvatar
  };
};

exports.followUser = async (followerId, followingId) => {
    if (followerId === followingId) {
        throw new Error("Cannot follow yourself");
    }

    await db.query(
        `
    INSERT INTO follows (follower_id, following_id)
    VALUES ($1, $2)
    ON CONFLICT DO NOTHING
    `,
        [followerId, followingId]
    );

    return { message: "Followed successfully" };
};

exports.unfollowUser = async (followerId, followingId) => {
    await db.query(
        `
    DELETE FROM follows
    WHERE follower_id = $1
    AND following_id = $2
    `,
        [followerId, followingId]
    );

    return { message: "Unfollowed successfully" };
};

exports.countFollowers = async (userId) => {
    const result = await db.query(
        `
    SELECT COUNT(*) FROM follows
    WHERE following_id = $1
    `,
        [userId]
    );

    return parseInt(result.rows[0].count);
};

exports.countFollowing = async (userId) => {
    const result = await db.query(
        `
    SELECT COUNT(*) FROM follows
    WHERE follower_id = $1
    `,
        [userId]
    );

    return parseInt(result.rows[0].count);
};
