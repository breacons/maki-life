import { FirebaseReducer, firebaseReducer } from 'react-redux-firebase';
import { combineReducers } from 'redux';

import { Discussion } from '../interfaces/discussions';
import { Envelope } from '../interfaces/docusign';
import { Space } from '../interfaces/spaces';
import { User } from '../interfaces/users';
import comments, { CommentsState } from './comments';
import graphics, { GraphicsState } from './graphics';

interface Schema {
  discussions: Discussion;
  currentSpace: Space;
  editedSpace: Space;
  users: User;
  currentDiscussion: Discussion;
  spaces: Space;
  envelopes: Envelope;
}

export interface RootState {
  firebase: FirebaseReducer.Reducer<User, Schema>;
  graphics: GraphicsState;
  comments: CommentsState;
}

export const rootReducer = combineReducers<RootState>({
  firebase: firebaseReducer,
  graphics,
  comments,
});
