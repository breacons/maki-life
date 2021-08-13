import {
  createEntityAdapter,
  createSelector,
  createSlice,
  EntityState,
  PayloadAction,
} from '@reduxjs/toolkit';
import { RootState } from '../reducers';
import { Comment } from '../../interfaces/comments';
import { selectGraphics } from '../graphics';

export const commentsAdapter = createEntityAdapter<Comment[]>({
  // Assume IDs are stored in a field other than `book.id`
  // selectId: (graphic) => {
  //   return graphic.id;
  // },
  // sortComparer: (a, b) => a.id.localeCompare(b.id),
});

type ExtraState = {
  error: Error | null;
  isLoading: boolean;
  editedComment: (Comment & { path?: string }) | null;
  repliedComment: (Comment & { path?: string }) | null;
};
export type CommentsState = EntityState<Comment[]> & ExtraState;

const initialState: CommentsState = commentsAdapter.getInitialState<ExtraState>({
  isLoading: false,
  error: null,
  repliedComment: null,
  editedComment: null,
});

const commentsSlice = createSlice({
  name: 'comments',
  initialState,
  reducers: {
    setEditedComment: (state, action: PayloadAction<Comment & { path: string }>) => {
      state.editedComment = action.payload;
      state.repliedComment = null;
    },
    unsetEditedComment: (state) => {
      state.editedComment = null;
    },
    setRepliedComment: (state, action: PayloadAction<Comment & { path: string }>) => {
      state.repliedComment = action.payload;
      state.editedComment = null;
    },
    unsetRepliedComment: (state) => {
      state.repliedComment = null;
    },
  },
  extraReducers: {},
});

export const selectComments = (state: RootState) => state.comments;

export const getCommentsLoading = createSelector(selectComments, (state) => state.isLoading);

export const getCommentsError = createSelector(selectComments, (state) => state.error);

export const commentsSelectors = commentsAdapter.getSelectors((state: RootState) => state.comments);

export const getEditedComment = createSelector(selectComments, (state) => state.editedComment);
export const getRepliedComment = createSelector(selectComments, (state) => state.repliedComment);

export default commentsSlice.reducer;
export const {
  setEditedComment,
  unsetEditedComment,
  setRepliedComment,
  unsetRepliedComment,
} = commentsSlice.actions;
