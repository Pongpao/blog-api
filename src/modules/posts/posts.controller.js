const postsService = require("./posts.service");

exports.createPost = async (req, res, next) => {
    try {
        const { title, content } = req.body;
        const imageUrl = req.file
            ? `/uploads/${req.file.filename}`
            : null;
        if (!title || !content) {
            return res.status(400).json({ message: "Title and content required" });
        }

        const post = await postsService.createPost(
            req.user.id,
            title,
            content,
            imageUrl
        );

        res.status(201).json(post);
    } catch (err) {
        next(err);
    }
};

exports.getPosts = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const search = req.query.search || "";
        const sort = req.query.sort === "asc" ? "asc" : "desc";

        const posts = await postsService.getPosts(
            page,
            limit,
            search,
            sort
        );

        res.json({
            page,
            limit,
            count: posts.length,
            data: posts
        });
    } catch (err) {
        next(err);
    }
};

exports.updatePost = async (req, res, next) => {
    try {
        const { title, content } = req.body;
        const postId = req.params.id;

        const updated = await postsService.updatePost(
            postId,
            req.user.id,
            title,
            content
        );

        res.json(updated);
    } catch (err) {
        if (err.message === "Forbidden") {
            return res.status(403).json({ message: "Forbidden" });
        }
        if (err.message === "Post not found") {
            return res.status(404).json({ message: "Post not found" });
        }
        next(err);
    }
};

exports.deletePost = async (req, res, next) => {
    try {
        const postId = req.params.id;

        await postsService.deletePost(
            postId,
            req.user.id
        );

        res.json({ message: "Post deleted (soft)" });
    } catch (err) {
        if (err.message === "Forbidden") {
            return res.status(403).json({ message: "Forbidden" });
        }
        next(err);
    }
};
exports.getall = async (req, res, next) => {
    try {
        const posts = await postsService.getall();
        res.json(posts);
    } catch (err) {
        next(err);
    }
};

exports.togglePostLike = async (req, res) => {
    const { postId } = req.body;
    const userId = req.user.id;

    const result = await postsService.togglePostLike(postId, userId);

    res.status(200).json(result);
};