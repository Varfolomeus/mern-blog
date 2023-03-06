import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import axios from '../../axios';

export const fetchPosts = createAsyncThunk('posts/fetchPosts', async () => {
  const { data } = await axios.get('/posts');
  return data;
});
export const fetchTags = createAsyncThunk('posts/fetchTags', async () => {
  const { data } = await axios.get('/tags');
  return data;
});
export const fetchPage = createAsyncThunk('posts/fetchPage', async ({matchto, page, pageSize }) => {
  // console.log('matchto',matchto);
  const { data } = await axios.get(`/pages?matchto=${matchto}&page=${page}&pagesize=${pageSize}`);
  // console.log("data", data);
  return data;
});
export const fetchPostOnId = createAsyncThunk('posts/fetchOnePost', async (id) => {
  const { data } = await axios.get(`/posts/${id}`);
  return data;
});
export const fetchPostsOnTags = createAsyncThunk('posts/fetchPostsOnTags', async (id) => {
  // console.log('Hello tag filter',id);
  const { data } = await axios.get(`/tags/${id}`);
  return data;
});
export const fetchSortByCreation = createAsyncThunk('posts/fetchSortByCreation', async () => {
  const { data } = await axios.get('/postssortbycreation');
  return data;
});
export const fetchSortByViews = createAsyncThunk('posts/fetchSortByViews', async () => {
  const { data } = await axios.get('/postssortbyviews');
  return data;
});
export const fetchRemovePost = createAsyncThunk('posts/fetchRemovePost', async (id) => {
  await axios.delete(`/posts/${id}`);
});
const initialState = {
  posts: {
    items: [],
    pageSize: 3,
    count:null,
    pageNumber: null,
    status: 'loading',
  },
  tags: {
    items: [],
    status: 'loading',
  },
};
const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {},
  extraReducers: {
    [fetchPostOnId.pending]: (state) => {
      state.posts.items = [];
      state.posts.status = 'loading';
    },
    [fetchPostOnId.fulfilled]: (state, action) => {
      state.posts.items = action.payload;
      state.posts.status = 'loaded';
    },
    [fetchPostOnId.rejected]: (state) => {
      state.posts.items = [];
      state.posts.status = 'error';
    },
    [fetchPosts.pending]: (state) => {
      state.posts.items = [];
      state.posts.status = 'loading';
    },
    [fetchPosts.fulfilled]: (state, action) => {
      state.posts.items = action.payload;
      state.posts.status = 'loaded';
    },
    [fetchPosts.rejected]: (state) => {
      state.posts.items = [];
      state.posts.status = 'error';
    },
    [fetchPage.pending]: (state) => {
      state.posts.items = [];
      state.posts.status = 'loading';
    },
    [fetchPage.fulfilled]: (state, action) => {
      state.posts.items = action.payload.posts;
      state.posts.count = action.payload.count;
      state.posts.status = 'loaded';
    },
    [fetchPage.rejected]: (state) => {
      state.posts.items = [];
      state.posts.status = 'error';
    },
    [fetchPostsOnTags.pending]: (state) => {
      state.posts.items = [];
      state.posts.status = 'loading';
    },
    [fetchPostsOnTags.fulfilled]: (state, action) => {
      state.posts.items = action.payload;
      state.posts.status = 'loaded';
    },
    [fetchPostsOnTags.rejected]: (state) => {
      state.posts.items = [];
      state.posts.status = 'error';
    },
    [fetchSortByCreation.pending]: (state) => {
      state.posts.items = [];
      state.posts.status = 'loading';
    },
    [fetchSortByCreation.fulfilled]: (state, action) => {
      state.posts.items = action.payload;
      state.posts.status = 'loaded';
    },
    [fetchSortByCreation.rejected]: (state) => {
      state.posts.items = [];
      state.posts.status = 'error';
    },
    [fetchSortByViews.pending]: (state) => {
      state.posts.items = [];
      state.posts.status = 'loading';
    },
    [fetchSortByViews.fulfilled]: (state, action) => {
      state.posts.items = action.payload;
      state.posts.status = 'loaded';
    },
    [fetchSortByViews.rejected]: (state) => {
      state.posts.items = [];
      state.posts.status = 'error';
    },
    // tags receiving
    [fetchTags.pending]: (state) => {
      state.tags.items = [];
      state.tags.status = 'loading';
    },
    [fetchTags.fulfilled]: (state, action) => {
      state.tags.items = action.payload;
      state.tags.status = 'loaded';
    },
    [fetchTags.rejected]: (state) => {
      state.tags.items = [];
      state.tags.status = 'error';
    },
    //remove article
    [fetchRemovePost.pending]: (state, action) => {
      state.posts.items = state.posts.items.filter((obj) => obj._id !== action.meta.arg);
      state.tags.status = 'loading';
    },
    [fetchRemovePost.rejected]: (state) => {
      state.posts.status = 'error';
    },
  },
});
export const postsReducer = postsSlice.reducer;
