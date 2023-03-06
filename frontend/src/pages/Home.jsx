import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Grid from '@mui/material/Grid';
import styles from './HomeBlock.module.scss';

import { Post } from '../components/Post';
import { TagsBlock } from '../components/TagsBlock';
import { CommentsBlock } from '../components/CommentsBlock';
import { fetchPosts, fetchPostsOnTags, fetchSortByCreation, fetchSortByViews, fetchTags } from '../redux/slices/posts';
import { fetchComments } from '../redux/slices/comments';
import { placeFilter } from '../redux/slices/filter';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import { useNavigate } from 'react-router-dom';

export const Home = ({ filterTagvalue, setFilterTagvalue, tabsValue, setTabsValue }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.auth.data);
  const { posts, tags } = useSelector((state) => state.posts);
  const pageSize = posts.pageSize;
  const { comments } = useSelector((state) => state.comments);
  const filterByTagName = useSelector((state) => state.filter.filter.value);


  React.useEffect(() => {
    if (filterByTagName) {
      dispatch(fetchPostsOnTags(filterByTagName));
      setFilterTagvalue(filterByTagName);
    }else{
      dispatch(fetchPosts());
      dispatch(fetchTags());
      dispatch(fetchComments());
    }
  }, [filterByTagName]);

  const isAuth = posts.status === 'loading';
  const isPostsLoading = posts.status === 'loading';
  const isTagsLoading = tags.status === 'loading';
  const isCommentsLoading = comments.status === 'loading';
  // console.log('filtertagValue', filtertagValue);

  return (
    <>
      {filterTagvalue ? <h1>#{filterTagvalue}</h1> : ''}
      <Paper classes={{ root: styles.root }}>
        <Typography variant="h6" classes={{ root: styles.title }}>
          <Tabs style={{ marginBottom: 15 }} value={tabsValue} aria-label="basic tabs example">
            <Tab
              label="New"
              onClick={() => {
                setTabsValue(0);
                setFilterTagvalue('');
                dispatch(placeFilter(''));
                dispatch(fetchSortByCreation());
                navigate(`/pages?matchto=&page=1&pagesize=${pageSize}`);
              }}
            />
            <Tab
              label="Popular"
              onClick={() => {
                setTabsValue(1);
                setFilterTagvalue('');
                dispatch(fetchSortByViews());
              }}
            />
          </Tabs>
        </Typography>
      </Paper>

      <Grid container spacing={4}>
        <Grid xs={8} item>
          {(isPostsLoading ? [...Array(3)] : posts.items).map((obj, index) =>
            isPostsLoading ? (
              <Post key={index} isLoading={true} />
            ) : (
              <Post
                key={obj._id}
                id={obj._id}
                title={obj.title}
                imageUrl={obj.illustrationUrl ? `http://localhost:3001/uploads/${obj.illustrationUrl}` : ''}
                user={obj.user_author[0]}
                createdAt={obj.createdAt}
                viewsCount={obj.viewsCount}
                commentsCount={obj.comments.length}
                tags={isPostsLoading ? ['preparing', 'preparing', 'preparing'] : obj.tags}
                isEditable={userData?._id === obj.user}
                setTabsValue={setTabsValue}
              />
            )
          )}
        </Grid>
        <Grid xs={4} item>
          <TagsBlock
            items={isTagsLoading ? ['preparing', 'preparing', 'preparing'] : tags.items}
            isLoading={isTagsLoading}
            parent={`home`}
            setTabsValue={setTabsValue}
            setFilterTagvalue={setFilterTagvalue}
          />
          <CommentsBlock
            isPostsLoading={isPostsLoading}
            items={
              !comments.items.length
                ? [
                    {
                      user: {
                        fullName: 'Вася Пупкин',
                        avatarUrl: 'https://mui.com/static/images/avatar/1.jpg',
                      },
                      text: 'Это тестовый комментарий',
                    },
                    {
                      user: {
                        fullName: 'Иван Иванов',
                        avatarUrl: 'https://mui.com/static/images/avatar/2.jpg',
                      },
                      text: 'When displaying three lines or more, the avatar is not aligned at the top. You should set the prop to align the avatar at the top',
                    },
                  ]
                : comments.items
            }
            isLoading={isCommentsLoading}
          />
        </Grid>
      </Grid>
    </>
  );
};
