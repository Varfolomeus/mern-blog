import React from 'react';

import styles from './AddComment.module.scss';

import { useNavigate } from 'react-router-dom';
import axios from '../../axios';
import TextField from '@mui/material/TextField';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';

export const Index = ({ isAuth, userData, ArticleTitle, ArticleID }) => {
  const navigate = useNavigate();
  const [text, setText] = React.useState('');
  const [articleID, setArticleID] = React.useState(ArticleID);
  const [fullName, setFullName] = React.useState(userData.fullName);
  
  const onChange = React.useCallback((value) => {
    setText(value);
  }, []);
  if (!isAuth) {
    return (
      <>
        <Avatar classes={{ root: styles.avatar }} src="/noavatar.png" />
        <div className={styles.root}>To add comment authorization needed</div>
      </>
    );
  }
  const addComment = async () => {
    // console.log('Hello from comment creation function');
    try {
      const fields = {
        post: articleID,
        title: ArticleTitle,
        user: fullName,
        text: text.target.value,
      };
      await axios.post('/comments', fields);
      navigate(`/posts/${articleID}`);
      window.location.reload(false);
      console.log('fields add comment', fields);
    } catch (err) {
      console.warn(err);
      alert('Comment creation error on server...');
    }
  };

  return (
    <>
      <div className={styles.root}>
        <Avatar
          classes={{ root: styles.avatar }}
          src={
            userData.avatarUrl
              ? `http://localhost:3001/uploads/avatars/${userData.avatarUrl}`
              : ''
          }
        />
        <div>{userData.fullName}</div>
        <div className={styles.form}>
          <TextField
            label="You may add your comment, to share your opinion..."
            variant="outlined"
            onChange={onChange}
            maxRows={10}
            multiline
            fullWidth
          />
          <Button type="submit" onClick={addComment} variant="contained">
            Add comment
          </Button>
        </div>
      </div>
    </>
  );
};
