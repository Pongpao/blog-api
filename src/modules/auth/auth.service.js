const db = require("../../config/db");
const bcrypt = require("bcrypt");
const { generateAccessToken } = require("../../utils/jwt");

exports.register = async (username, password) => {
    const hashed = await bcrypt.hash(password, 10);

    const result = await db.query(
        "INSERT INTO users (username, password) VALUES ($1,$2) RETURNING id, username",
        [username, hashed]
    );

    return result.rows[0];
};

exports.login = async (username, password) => {
    const result = await db.query(
        "SELECT * FROM users WHERE username = $1",
        [username]
    );

    const user = result.rows[0];
    if (!user) throw new Error("Invalid credentials");

    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new Error("Invalid credentials");

    const token = generateAccessToken({
        id: user.id,
        username: user.username
    });

    return token;
};
