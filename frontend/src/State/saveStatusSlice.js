import { createSlice } from '@reduxjs/toolkit';

const saveStatusSlice = createSlice({
  name: 'saveStatus',
  initialState: true,
  reducers: {
    startSaving: () => {
      return false;
    },
    finishSaving: () => {
      return true;
    },
  }
});

export const { startSaving, finishSaving } = saveStatusSlice.actions;
export default saveStatusSlice.reducer;
