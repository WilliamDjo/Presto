import {configureStore} from "@reduxjs/toolkit";
import presentationsReducer from "./presentationsSlice"
import saveStatusReducer from "./saveStatusSlice"

export const store = configureStore({
  reducer: {
    presentations: presentationsReducer,
    saveStatus: saveStatusReducer
  }
});
