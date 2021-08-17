import classNames from 'classnames';
import React, { useEffect } from 'react';
import { useHistory, useRouteMatch } from 'react-router';

import ChangesAndRequestsPanel from '../../components/ChangesAndRequestsPanel';
import DiscussionsPanel from '../../components/DiscussionsPanel';
import { PageTitle } from '../../components/Header';
import MainMap from '../../components/MainMap';
import ObjectivesPanel from '../../components/ObjectivesPanel';
import { SpinnerOverlay } from '../../components/SpinnerOverlay';
import {
  useCurrentDiscussion,
  useDiscussionRequest,
  useDiscussions,
} from '../../hooks/discussions';
import { useSpaceId } from '../../hooks/use-space';
import { useProfile } from '../../hooks/use-user';
import { Discussion } from '../../interfaces/discussions';
import { setSelectGraphics, unsetSelectGraphics } from '../../redux/graphics';
import { useAppDispatch } from '../../redux/store';
import {
  URL_SPACE_CHANGE_CREATE,
  URL_SPACE_CHANGE_EDIT,
  URL_SPACE_REQUEST_CREATE,
  URL_SPACE_REQUEST_EDIT,
  URL_SPACES,
} from '../../urls';
import styles from './styles.module.less';

interface Props {}

export const discussions: Discussion[] = [];

export const SpaceLandingPage = ({}: Props) => {
  const spaceId = useSpaceId();
  const { isLoaded } = useDiscussions();
  const dispatch = useAppDispatch();
  const profile = useProfile();
  const history = useHistory();
  const { discussion } = useCurrentDiscussion();
  const { request } = useDiscussionRequest();

  const isEditingRequest = !!(
    useRouteMatch(URL_SPACE_REQUEST_EDIT) || useRouteMatch(URL_SPACE_REQUEST_CREATE)
  );
  const isEditingChange = !!(
    useRouteMatch(URL_SPACE_CHANGE_EDIT) || useRouteMatch(URL_SPACE_CHANGE_CREATE)
  );

  useEffect(() => {
    if (request && request.graphics) {
      dispatch(setSelectGraphics(request.graphics));
    } else {
      dispatch(unsetSelectGraphics());
    }
  }, [request]);

  useEffect(() => {
    if (profile && profile.spaceIds && !profile.spaceIds[spaceId]) {
      history.replace(URL_SPACES);
    }
  }, [profile, spaceId]);

  if (!isLoaded) {
    return <SpinnerOverlay spinning />;
  }

  return (
    <div className={styles.container}>
      <PageTitle title="Discussions" />
      <div className={styles.panels}>
        <div className={styles.panelLeft}>
          <div className={classNames([styles.panel, styles.discussionPanel])}>
            <DiscussionsPanel />
          </div>
          <div className={classNames([styles.panel, styles.objectivesPanel])}>
            <ObjectivesPanel />
          </div>
        </div>
        <div
          className={classNames([
            styles.panelRight,
            {
              [styles.isEditingRequest]: isEditingRequest,
              [styles.isEditingChange]: isEditingChange,
            },
          ])}
        >
          <div className={classNames([styles.panel])}>
            <ChangesAndRequestsPanel />
          </div>
        </div>
      </div>

      <MainMap
        config={discussion?.map}
        isEditingRequest={isEditingRequest}
        isEditingChange={isEditingChange}
      />
    </div>
  );
};

export default SpaceLandingPage;
