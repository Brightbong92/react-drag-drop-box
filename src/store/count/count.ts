import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '..';
import { ICount } from './count.d';

const initialState: ICount = {
  value: 0,
};

export const countSlice = createSlice({
  name: 'count',
  initialState,
  reducers: {
    setCount: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const { setCount } = countSlice.actions;

export const selectCount = (state: RootState) => state.count;

export default countSlice.reducer;
