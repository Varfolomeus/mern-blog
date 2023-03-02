import React from 'react';
import clsx from 'clsx';
import { Link } from 'react-router-dom';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Clear';
import EditIcon from '@mui/icons-material/Edit';
import EyeIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import CommentIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import { useDispatch } from 'react-redux';

import styles from './Post.module.scss';
import { placeFilter } from '../../redux/slices/filter';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';

import { UserInfo } from '../UserInfo';
import { PostSkeleton } from './Skeleton';
import { fetchRemovePost } from '../../redux/slices/posts';
import { fetchremoveCommentsRefToPost } from '../../redux/slices/comments';

export const Post = ({
  id,
  title,
  createdAt,
  imageUrl,
  user,
  viewsCount,
  commentsCount,
  tags,
  children,
  isFullPost,
  isLoading,
  isEditable,
  setTabsValue,
}) => {
  const dispatch = useDispatch();

  if (isLoading) {
    return <PostSkeleton />;
  }
  const setTagName = (tagName) => {
    dispatch(placeFilter(tagName));
  };

  const onClickRemove = () => {
    if (window.confirm('Are you shure you want to remove article?')) {
      dispatch(fetchRemovePost(id));
      dispatch(fetchremoveCommentsRefToPost(id));
    }
  };
  const getNormalDate = (dateToModify) => {
    const prepDate = new Date(dateToModify);
    const readyDate = `${String(prepDate.getDate()).padStart(2, '0')}.${String(prepDate.getMonth() + 1).padStart(
      2,
      '0'
    )}.${String(prepDate.getFullYear()).padStart(4, '0')} ${String(prepDate.getHours()).padStart(2, '0')}:${String(
      prepDate.getMinutes()
    ).padStart(2, '0')}`;
    return readyDate;
  };
  return (
    <Paper classes={{ root: styles.root }}>
      <Typography variant="h6" classes={{ root: styles.title }}>
        <div className={clsx(styles.root, { [styles.rootFull]: isFullPost })}>
          {isEditable && (
            <div className={styles.editButtons}>
              <Link to={`/posts/${id}/edit`}>
                <IconButton color="primary">
                  <EditIcon />
                </IconButton>
              </Link>
              <IconButton onClick={onClickRemove} color="secondary">
                <DeleteIcon />
              </IconButton>
            </div>
          )}
          {imageUrl && (
            <img className={clsx(styles.image, { [styles.imageFull]: isFullPost })} src={imageUrl} alt={title} />
          )}
          <div className={styles.wrapper}>
            <UserInfo {...user} additionalText={createdAt ? getNormalDate(createdAt) : 'preparing date'} />
            <div className={styles.indention}>
              <h2 className={clsx(styles.title, { [styles.titleFull]: isFullPost })}>
                {isFullPost ? title : <Link to={`/posts/${id}`}>{title}</Link>}
              </h2>
              <ul className={styles.tags}>
                {tags.map((name, i) => (
                  <li
                    onClick={() => {
                      setTagName(name);
                      setTabsValue(null);
                    }}
                    key={'fullpost' + i + name}
                  >
                    <Link to={`/tags/${name}`}>#{name}</Link>
                  </li>
                ))}
              </ul>
              {children && <div className={styles.content}>{children}</div>}
              <ul className={styles.postDetails}>
                <li>
                  <EyeIcon />
                  <span>{viewsCount}</span>
                </li>
                <li>
                  <CommentIcon />
                  <span>{commentsCount}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </Typography>
    </Paper>
  );
};
