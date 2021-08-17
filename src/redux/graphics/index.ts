import {
  createEntityAdapter,
  createSelector,
  createSlice,
  EntityState,
  PayloadAction,
} from '@reduxjs/toolkit';

import { GraphicJSON } from '../../interfaces/esri';
import { RootState } from '../reducers';

export const graphicsAdapter = createEntityAdapter<GraphicJSON[]>({
  // Assume IDs are stored in a field other than `book.id`
  // selectId: (graphic) => {
  //   return graphic.id;
  // },
  // sortComparer: (a, b) => a.id.localeCompare(b.id),
});

type ExtraState = {
  error: Error | null;
  isLoading: boolean;
  selectedGraphics: GraphicJSON[] | null;
  screenShotPath: null | string;
  screenShotUrl: null | string;
};
export type GraphicsState = EntityState<GraphicJSON> & ExtraState;

const initialState: GraphicsState = graphicsAdapter.getInitialState<ExtraState>({
  isLoading: false,
  error: null,
  selectedGraphics: null,
  screenShotPath: null,
  screenShotUrl: null,
});

const graphicsSlice = createSlice({
  name: 'graphics',
  initialState,
  reducers: {
    setSelectGraphics: (state, action: PayloadAction<GraphicJSON>) => {
      state.selectedGraphics = action.payload;
    },
    unsetSelectGraphics: (state) => {
      state.selectedGraphics = null;
    },
    setScreenShotPath: (state, action: PayloadAction<{ path: string | null }>) => {
      state.screenShotPath = action.payload.path;
    },
    setScreenShotUrl: (state, action: PayloadAction<{ path: string | null }>) => {
      state.screenShotUrl = action.payload.path;
    },
  },
  extraReducers: {},
});

export const selectGraphics = (state: RootState) => state.graphics;

export const getGraphicsLoading = createSelector(selectGraphics, (state) => state.isLoading);

export const getGraphicsError = createSelector(selectGraphics, (state) => state.error);

export const graphicsSelectors = graphicsAdapter.getSelectors((state: RootState) => state.graphics);

export const getSelectedGraphics = createSelector(
  selectGraphics,
  (state) => state.selectedGraphics,
);
export const getScreenShotPath = createSelector(selectGraphics, (state) => state.screenShotPath);
export const getScreenShotUrl = createSelector(selectGraphics, (state) => state.screenShotUrl);

export default graphicsSlice.reducer;
export const { setSelectGraphics, unsetSelectGraphics, setScreenShotPath } = graphicsSlice.actions;
