import React from 'react';

import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ReactMarkdown from 'react-markdown';

import { Post } from '../components/Post';

import { Index } from '../components/AddComment';
import { CommentsBlock } from '../components/CommentsBlock';
import axios from '../axios';

export const FullPost = () => {
  const userData = useSelector((state) => state.auth.data);
  const [singlePost, setSinglePost] = React.useState('');
  const [singlePostComments, setSinglePostComments] = React.useState();
  const [isLoading, setIsLoading] = React.useState(true);
  const isAuth = !!userData;
  const mountFullPost = async () => {
    await axios
      .get(`/posts/${id}`)
      .then((res) => {
        setSinglePost(res.data[0]);
      })
      .catch((err) => {
        console.warn(err);
        alert('load article error!');
      });
    await axios
      .get(`/comtofullpost/${id}`)
      .then((res) => {
        setSinglePostComments(res.data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.warn(err);
        alert('load article error!');
      });
  };
  const { id } = useParams();
  React.useEffect(() => {
    mountFullPost();
  }, []);

  if (isLoading) {
    return <Post isLoading={isLoading} isFullPost />;
  }

  return (
    <>
      <Post
        id={singlePost._id}
        title={singlePost.title}
        imageUrl={singlePost.illustrationUrl ? `http://localhost:3001/uploads/${singlePost.illustrationUrl}` : ''}
        user={singlePost.user_author[0]}
        createdAt={singlePost.createdAt}
        viewsCount={singlePost.viewsCount}
        commentsCount={singlePost.comments.length}
        tags={singlePost.tags}
        isFullPost
      >
        <ReactMarkdown children={singlePost.text} />
        {/* <p>{singlePost.text}</p> */}
      </Post>
      <CommentsBlock items={singlePostComments} isLoading={isLoading}>
        <Index
          isAuth={isAuth}
          ArticleID={singlePost._id}
          ArticleTitle={singlePost.title}
          userData={userData ? userData : ''}
        />
      </CommentsBlock>
    </>
  );
};
