import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import axios from '../../axios';
export const fetchComments = createAsyncThunk(
  'comments/fetchComments',
  async () => {
    const { data } = await axios.get('/comments');
    return data;
  }
);
export const fetchremoveCommentsRefToPost = createAsyncThunk(
  'comments/fetchremoveCommentsRefToPost',
  async (id) => {
    const { data } = await axios.delete(`/comments/${id}`);
    return data;
  }
);
export const commentOnPostWithUserInfo = createAsyncThunk(
  'comments/commentOnPostWithUserInfo',
  async (id) => {
    // console.log(id);
    const { data } = await axios.get(`/comments/${id}`);
    return data;
  }
);

const initialState = {
  comments: {
    items: [],
    status: 'loading',
  },
};
const commentsSlice = createSlice({
  name: 'comments',
  initialState,
  reducers: {},
  extraReducers: {
    //reseiving comments
    [fetchComments.pending]: (state) => {
      state.comments.items = [];
      state.comments.status = 'loading';
    },
    [fetchComments.fulfilled]: (state, action) => {
      state.comments.items = action.payload;
      state.comments.status = 'loaded';
    },
    [fetchComments.rejected]: (state) => {
      state.comments.items = [];
      state.comments.status = 'error';
    },
    [commentOnPostWithUserInfo.pending]: (state) => {
      state.comments.items = [];
      state.comments.status = 'loading';
    },
    [commentOnPostWithUserInfo.fulfilled]: (state, action) => {
      state.comments.items = action.payload;
      state.comments.status = 'loaded';
    },
    [commentOnPostWithUserInfo.rejected]: (state) => {
      state.comments.items = [];
      state.comments.status = 'error';
    },
    //remove comment
    [fetchremoveCommentsRefToPost.pending]: (state, action) => {
      state.comments.items = state.comments.items.filter(
        (obj) => obj._id !== action.meta.arg
      );
      state.comments.status = 'loading';
    },
    [fetchremoveCommentsRefToPost.rejected]: (state) => {
      state.comments.status = 'error';
    },
  },
});
export const commentsReducer = commentsSlice.reducer;
