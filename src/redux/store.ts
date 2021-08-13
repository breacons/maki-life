import 'firebase/database';
import 'firebase/auth';

import { configureStore } from '@reduxjs/toolkit';
import firebase from 'firebase/app';
import { useDispatch } from 'react-redux';
import { actionTypes } from 'react-redux-firebase';

import { fbConfig } from '../config';
import { rootReducer } from './reducers';

const rrfConfig = {
  userProfile: 'users',
};

firebase.initializeApp(fbConfig);

export const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV === 'development',
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [actionTypes.LOGIN],
      },
    }),
});

export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const rrfProps = {
  firebase,
  config: rrfConfig,
  dispatch: store.dispatch,
};
