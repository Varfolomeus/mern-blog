import CommentsModel from './../models/Comment.js';

export const getAll = async (req, res) => {
  try {
    if (req.path.includes('comments')) {
      const comments = await CommentsModel.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .populate('user', 'avatarUrl fullName')
        .exec();
      res.json(comments);
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Comment not found',
    });
  }
};
export const commentOnPostWithUserInfo = async (req, res) => {
  try {
    if (req.path.includes('comtofullpost')) {
      const commentId = req.params.id;
      const comments = await CommentsModel.find({ post: commentId })
        .populate('user', 'avatarUrl fullName')
        .exec();
      res.json(comments);
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Comment not found',
    });
  }
};

export const removeCommentsRefToPost = async (req, res) => {
  try {
    const postId = req.params.id;
    CommentsModel.deleteMany(
      {
        post: postId,
      },
      (err, doc) => {
        if (err) {
          console.log(err);
          return res.status(500).json({
            message: 'Comment not deleted by the server error',
          });
        }
        if (!doc) {
          return res.status(404).json({
            message: 'Comment not found',
          });
        }
        res.status(200).json({
          success: true,
          message: 'Comment deleted',
        });
      }
    );
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Comment not found',
    });
  }
};
export const create = async (req, res) => {
  try {
    const doc = new CommentsModel({
      title: req.body.title,
      text: req.body.text,
      post: req.body.post,
      user: req.userId,
    });
    const comment = await doc.save();
    res.json(comment);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Comment not created',
    });
  }
};
