const authService = require("./auth.service");

exports.register = async (req, res, next) => {
    try {
        const { username, password } = req.body;
        const user = await authService.register(username, password);
        res.status(201).json(user);
    } catch (err) {
        next(err);
    }
};

exports.login = async (req, res, next) => {
    try {
        const { username, password } = req.body;
        const token = await authService.login(username, password);
        res.json({ accessToken: token });
    } catch (err) {
        next(err);
    }
};
