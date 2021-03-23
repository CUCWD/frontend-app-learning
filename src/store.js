import { configureStore } from '@reduxjs/toolkit';
import { reducer as courseHomeReducer } from './course-home/data';
import { reducer as coursewareReducer } from './data';
import { reducer as modelsReducer } from './model-store';

const store = configureStore({
  reducer: {
    models: modelsReducer,
    courseware: coursewareReducer,
    courseHome: courseHomeReducer,
  },
});

export default store;
