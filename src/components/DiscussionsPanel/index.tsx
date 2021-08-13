import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import {
  URL_SPACE_DETAILS,
  URL_SPACE_DISCUSSION_DETAIL,
  URL_SPACE_DISCUSSION_SUBMISSION_DETAIL,
  URL_SPACE_DISCUSSION_SUBMISSIONS,
  URL_SPACE_DISCUSSIONS,
} from '../../urls';
import DiscussionDetails from './DiscussionDetails';
import DiscussionsList from './DiscussionsList';
import SubmissionDetails from './SubmissionDetails';

interface Props {}

export const DiscussionsPanel = ({}: Props) => {
  // const { discussionId } = useParams<{ discussionId: string | undefined }>();

  return (
    <Switch>
      <Route path={URL_SPACE_DISCUSSION_SUBMISSION_DETAIL} component={SubmissionDetails} exact />
      <Route path={URL_SPACE_DISCUSSION_DETAIL} component={DiscussionDetails} />
      <Route path={URL_SPACE_DISCUSSIONS} component={DiscussionsList} />
      <Route path={URL_SPACE_DETAILS} component={DiscussionsList} />
      <Redirect from={URL_SPACE_DISCUSSION_SUBMISSIONS} to={URL_SPACE_DISCUSSIONS} />
    </Switch>
  );
};

export default DiscussionsPanel;
