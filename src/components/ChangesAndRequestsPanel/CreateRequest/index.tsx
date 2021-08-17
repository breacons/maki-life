import dayjs from 'dayjs';
import firebase from 'firebase';
import React, { useState } from 'react';
import { useHistory, useParams } from 'react-router';
import { v4 as uuidv4 } from 'uuid';

import { useUserId } from '../../../hooks/use-user';
import {
  DiscussionActionType,
  DiscussionRequest,
  DiscussionRequestStatus,
} from '../../../interfaces/discussions';
import { GraphicJSON } from '../../../interfaces/esri';
import { getSelectedGraphics, setScreenShotPath } from '../../../redux/graphics';
import { store, useAppDispatch } from '../../../redux/store';
import { getDiscussionDetailUrl, getDiscussionRequestDetailsUrl } from '../../../urls';
import PanelHeader from '../../PanelHeader';
import RequestForm, { CreateRequestValues } from './RequestForm';

interface Props {}

export const CreateRequest = ({}: Props) => {
  const { spaceId, discussionId } = useParams<{
    discussionId: string;
    spaceId: string;
  }>();
  const userId = useUserId();
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();

  const onSubmit = async (values: CreateRequestValues) => {
    const graphics: GraphicJSON[] | null = getSelectedGraphics(store.getState());
    const id = uuidv4();
    const final: DiscussionRequest = {
      ...values,
      id,
      status: DiscussionRequestStatus.Open,
      authorUserId: userId,
      time: dayjs().unix(),
      type: DiscussionActionType.Request,
    };

    if (graphics) {
      final.graphics = graphics;
    }
    setLoading(true);
    const path = `discussions/${discussionId}/requests/${id}`;
    await firebase.database().ref(path).set(final);

    dispatch(setScreenShotPath({ path: `screenshots/${id}.jpg` }));

    setLoading(false);

    history.replace(getDiscussionRequestDetailsUrl(spaceId, discussionId, id));
  };

  const backUrl = getDiscussionDetailUrl(spaceId, discussionId);
  return (
    <div>
      <PanelHeader title="Create Request" backUrl={backUrl} />
      <RequestForm onSubmit={onSubmit} loading={loading} backUrl={backUrl} />
    </div>
  );
};

export default CreateRequest;
