import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  filter: {
    value: '',
    status: 'loading',
  },
};
const filterSlice = createSlice({
  name: 'filter',
  initialState,
  reducers: {
    placeFilter: (state, action) => {
      // console.log('filter.action.payload', action.payload);
      state.filter.value = action.payload;
      state.filter.status = 'changed';
    },
  },
});
export const { placeFilter } = filterSlice.actions;
export const filterReducer = filterSlice.reducer;
