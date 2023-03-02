import { mongo } from 'mongoose';
import PostModel from './../models/Post.js';

export const getLastTags = async (req, res) => {
  try {
    const posts = await PostModel.find().limit(5).exec();
    const tags = Array.from(new Set(posts.map((obj) => obj.tags).flat())).slice(
      0,
      5
    );
    res.json(tags);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Posts not found',
    });
  }
};

export const getAll = async (req, res) => {
  try {
    const posts = await PostModel.aggregate([
      { $sort: { createdAt: -1 } },
      {
        $lookup: {
          from: 'comments',
          localField: '_id',
          foreignField: 'post',
          as: 'comments',
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'user',
          foreignField: '_id',
          as: 'user_author',
        },
      },
    ]).exec();

    res.json(posts);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Posts not found',
    });
  }
};
export const getSortedByCreation = async (req, res) => {
  try {
    const posts = await PostModel.aggregate([
      { $sort: { createdAt: -1 } },
      {
        $lookup: {
          from: 'comments',
          localField: '_id',
          foreignField: 'post',
          as: 'comments',
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'user',
          foreignField: '_id',
          as: 'user_author',
        },
      },
    ]).exec();

    res.json(posts);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Posts not found',
    });
  }
};
export const getSortedByViews = async (req, res) => {
  try {
    const posts = await PostModel.aggregate([
      { $sort: { viewsCount: -1 } },
      {
        $lookup: {
          from: 'comments',
          localField: '_id',
          foreignField: 'post',
          as: 'comments',
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'user',
          foreignField: '_id',
          as: 'user_author',
        },
      },
    ]).exec();

    res.json(posts);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Posts not found',
    });
  }
};
export const getPostOnTags = async (req, res) => {
  try {
    if (req.path.includes('tags')) {
      // console.log('req', req.path);
      const posts = await PostModel.aggregate([
        {
          $match: { tags: { $eq: req.params.id } },
        },
        {
          $sort: { viewsCount: 1 },
        },
        {
          $set: {
            viewsCount: {
              $sum: ['$viewsCount', 1],
            },
          },
        },
        {
          $lookup: {
            from: 'comments',
            localField: '_id',
            foreignField: 'post',
            as: 'comments',
          },
        },
        {
          $lookup: {
            from: 'users',
            localField: 'user',
            foreignField: '_id',
            as: 'user_author',
          },
        },
      ]).exec();
      // console.log('posts', posts);
      res.json(posts);
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Posts not found',
    });
  }
};
export const getOne = async (req, res) => {
  try {
    if (req.path.includes('posts')) {
      const postId1 = req.params.id;
      const postId = mongo.ObjectId(req.params.id);
      // console.log('req.params.id', req.params.id);

       PostModel.updateOne(
        {
          _id: postId1,
        },
        {
          $inc: { viewsCount: 1 },
        },
        (err, doc) => {
          if (err) {
            console.log(err);
            return res.status(500).json({
              message: 'Article not returned by the server error',
            });
          }
          if (!doc) {
            return res.status(404).json({
              message: 'Article not found',
            });
          }
        }
      );
      const post = await PostModel.aggregate([
        {
          $match: { _id: { $eq: postId } },
        },
        {
          $set: {
            viewsCount: {
              $sum: ['$viewsCount', 1],
            },
          },
        },
        {
          $lookup: {
            from: 'comments',
            localField: '_id',
            foreignField: 'post',
            as: 'comments',
          },
        },
        {
          $lookup: {
            from: 'users',
            localField: 'user',
            foreignField: '_id',
            as: 'user_author',
          },
        },
      ]).exec();
      res.json(post);
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Articles not found',
    });
  }
};

export const remove = async (req, res) => {
  try {
    const postId = req.params.id;
    PostModel.findOneAndDelete(
      {
        _id: postId,
      },
      (err, doc) => {
        if (err) {
          console.log(err);
          return res.status(500).json({
            message: 'Article not deleted by the server error',
          });
        }
        if (!doc) {
          return res.status(404).json({
            message: 'Article not found',
          });
        }
        res.status(200).json({
          success: true,
          message: 'Article deleted',
        });
      }
    );
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Articles not found',
    });
  }
};
export const create = async (req, res) => {
  try {
    const doc = new PostModel({
      title: req.body.title,
      text: req.body.text,
      tags: req.body.tags.split(/[\s,!?]+/),
      illustrationUrl: req.body.illustrationUrl,
      user: req.userId,
    });
    const post = await doc.save();
    res.json(post);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Post not created',
    });
  }
};
export const update = async (req, res) => {
  try {
    const postId = req.params.id;
    PostModel.updateOne(
      {
        _id: postId,
      },
      {
        title: req.body.title,
        text: req.body.text,
        illustrationUrl: req.body.illustrationUrl,
        user: req.user,
        tags: req.body.tags.split(/[\s,!?]+/),
      },
      {
        returnDocument: 'after',
      },
      (err, doc) => {
        if (err) {
          console.log(err);
          return res.status(500).json({
            message: 'Article not returned by the server error',
          });
        }
        if (!doc) {
          return res.status(404).json({
            message: 'Article not found',
          });
        }
      }
    );
    res.status(200).json({
      success: true,
      message: 'Articles updated',
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Articles update failed',
    });
  }
};
