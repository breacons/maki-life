import { FirebaseReducer, firebaseReducer } from 'react-redux-firebase';
import { combineReducers } from 'redux';
import graphics, { GraphicsState } from './graphics';
import comments, { CommentsState } from './comments';

import { Discussion } from '../interfaces/discussions';
import { User } from '../interfaces/users';
import { Space } from '../interfaces/spaces';
import { Envelope } from '../interfaces/docusign';

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
