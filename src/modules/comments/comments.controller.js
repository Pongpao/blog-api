const commentService = require("./comments.service");

exports.createComment = async (req, res) => {
    const { postId, content, parent_id } = req.body;
    const comment = await commentService.create({
        content,
        postId,
        userId: req.user.id,
        parent_id
    });

    res.status(201).json(comment);
};
exports.getByPostId = async (req, res) => {
    const { postId } = req.params;

    const comments = await commentService.getByPostId(postId);

    res.status(200).json(comments);
};
exports.updateComment = async (req, res) => {
    const { commentId } = req.params;
    const { content } = req.body;

    const comment = await commentService.update({
        content,
        commentId,
        userId: req.user.id
    });
    // console.log(comment);

    res.status(200).json(comment);
};
exports.deleteComment = async (req, res) => {
    const { commentId } = req.params;

    const comment = await commentService.delete({
        commentId,
        userId: req.user.id
    });

    res.status(200).json(comment);
};
exports.getHistory = async (req, res) => {
    const { commentId } = req.params;
    console.log(commentId);
    const history = await commentService.getHistory({ commentId });
    console.log(history);
    res.status(200).json(history);
};

exports.toggleCommentLike = async (req, res) => {
    const { commentId } = req.body;
    const userId = req.user.id;

    const result = await commentService.toggleCommentLike(commentId, userId);

    res.status(200).json(result);
};

