import React, { useEffect, useMemo } from 'react';
import { useHistory, useParams, useRouteMatch } from 'react-router';

import ChangesAndRequestsPanel from '../../components/ChangesAndRequestsPanel';
import DiscussionsPanel from '../../components/DiscussionsPanel';
import MainMap from '../../components/MainMap';
import ObjectivesPanel from '../../components/ObjectivesPanel';
import {
  useCurrentDiscussion,
  useDiscussionChange,
  useDiscussionRequest,
  useDiscussions,
} from '../../hooks/discussions';
import { useSpace, useSpaceId, useSpaceMembers } from '../../hooks/use-space';
import { Discussion } from '../../interfaces/discussions';
import { useAppDispatch } from '../../redux/store';
import { setSelectGraphics, unsetSelectGraphics } from '../../redux/graphics';
import { useProfile } from '../../hooks/use-user';
import {
  URL_SPACE_CHANGE_CREATE,
  URL_SPACE_CHANGE_EDIT,
  URL_SPACE_REQUEST_CREATE,
  URL_SPACE_REQUEST_EDIT,
  URL_SPACES,
} from '../../urls';
import { UserType } from '../../interfaces/users';
import EditSpaceMembers from '../../components/EditSpaceMembers';
import styles from './styles.module.less';
import classNames from 'classnames';
import {SpinnerOverlay} from "../../components/SpinnerOverlay";
import {PageTitle} from "../../components/Header";

interface Props {}
//s

// console.log(JSON.stringify(discussions));

export const discussions: Discussion[] = [];

export const SpaceLandingPage = ({}: Props) => {
  const spaceId = useSpaceId();
  const { discussions, isLoaded, isEmpty } = useDiscussions();
  const dispatch = useAppDispatch();
  const { space } = useSpace();
  const profile = useProfile();
  const history = useHistory();
  const { discussion } = useCurrentDiscussion();
  const { request } = useDiscussionRequest();
  const { change } = useDiscussionChange();

  const isEditingRequest = !!(
    useRouteMatch(URL_SPACE_REQUEST_EDIT) || useRouteMatch(URL_SPACE_REQUEST_CREATE)
  );
  const isEditingChange = !!(
    useRouteMatch(URL_SPACE_CHANGE_EDIT) || useRouteMatch(URL_SPACE_CHANGE_CREATE)
  );

  // const { members } = useSpaceMembers();

  const { discussionId, requestId, changeId } = useParams<{
    discussionId: string | undefined;
    requestId: string | undefined;
    changeId: string | undefined;
  }>();

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

  // console.log(isLoaded, discussions)
  if (!isLoaded) {
    return <SpinnerOverlay spinning/>;
  }

  return (
    <div className={styles.container}>
      <PageTitle title='Discussions' />
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
      {/*<EditorMap />*/}
    </div>
  );
};

export default SpaceLandingPage;
