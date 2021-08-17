import React from 'react';
import { useParams } from 'react-router';
import { Redirect, Route, Switch } from 'react-router-dom';

import SpaceLayout from '../../components/Layout/SpaceLayout';
import SpaceLandingPage from '../../pages/SpaceLandingPage';
import {
  URL_SPACE_CHANGE,
  URL_SPACE_CHANGE_CREATE,
  URL_SPACE_CHANGE_DETAILS,
  URL_SPACE_CHANGE_EDIT,
  URL_SPACE_DETAILS,
  URL_SPACE_DISCUSSION_DETAIL,
  URL_SPACE_REQUEST,
  URL_SPACE_REQUEST_CREATE,
  URL_SPACE_REQUEST_DETAILS,
  URL_SPACE_REQUEST_EDIT,
  URL_SPACES,
} from '../../urls';

interface Props {}

export const SpaceDetailsRouter = ({}: Props) => {
  const { spaceId } = useParams<{ spaceId: string | undefined }>();

  console.log('SpaceDetailsRouter', spaceId);

  // TODO: check for space exists, isLoaded
  if (!spaceId) {
    return <Redirect to={URL_SPACES} />;
  }

  return (
    <SpaceLayout>
      <Switch>
        <Route path={URL_SPACE_CHANGE_CREATE} component={SpaceLandingPage} exact />
        <Route path={URL_SPACE_CHANGE_EDIT} component={SpaceLandingPage} exact />
        <Route path={URL_SPACE_REQUEST_CREATE} component={SpaceLandingPage} exact />
        <Route path={URL_SPACE_REQUEST_EDIT} component={SpaceLandingPage} exact />
        <Route path={URL_SPACE_CHANGE_DETAILS} component={SpaceLandingPage} />
        <Route path={URL_SPACE_REQUEST_DETAILS} component={SpaceLandingPage} />
        <Route path={URL_SPACE_CHANGE} component={SpaceLandingPage} />
        <Route path={URL_SPACE_REQUEST} component={SpaceLandingPage} />
        <Route path={URL_SPACE_DISCUSSION_DETAIL} component={SpaceLandingPage} />
        <Route path={URL_SPACE_DETAILS} component={SpaceLandingPage} />
      </Switch>
    </SpaceLayout>
  );
};

export default SpaceDetailsRouter;
