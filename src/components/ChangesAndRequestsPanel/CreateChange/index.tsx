import dayjs from 'dayjs';
import firebase from 'firebase';
import React, { useState } from 'react';
import { useHistory, useParams } from 'react-router';
import { v4 as uuidv4 } from 'uuid';

import { useUserId } from '../../../hooks/use-user';
import {
  DiscussionActionType,
  DiscussionChange,
  DiscussionChangeStatus,
  DiscussionRequestStatus,
} from '../../../interfaces/discussions';
import { setScreenShotPath } from '../../../redux/graphics';
import { useAppDispatch } from '../../../redux/store';
import { getDiscussionChangeDetailsUrl, getDiscussionDetailUrl } from '../../../urls';
import PanelHeader from '../../PanelHeader';
import ChangeForm, { CreateChangeValues } from './ChangeForm';

interface Props {}

export const CreateChange = ({}: Props) => {
  const { spaceId, discussionId } = useParams<{
    discussionId: string;
    spaceId: string;
  }>();
  const userId = useUserId();
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();

  const onSubmit = async (values: CreateChangeValues) => {
    const id = uuidv4();
    const final: DiscussionChange = {
      ...values,
      id,
      status: DiscussionChangeStatus.Published,
      authorUserId: userId,
      time: dayjs().unix(),
      type: DiscussionActionType.Change,
    };

    setLoading(true);
    const path = `discussions/${discussionId}/changes/${id}`;
    await firebase.database().ref(path).set(final);

    const addPromises = Object.keys(values.solvedRequestIds || {}).map((requestId) => {
      const path = `discussions/${discussionId}/requests/${requestId}`;
      return firebase
        .database()
        .ref(path)
        .update({ solutionChangeId: id, status: DiscussionRequestStatus.Completed });
    });

    await Promise.all([...addPromises]);

    dispatch(setScreenShotPath({ path: `screenshots/${id}.jpg` }));

    setLoading(false);

    history.replace(getDiscussionChangeDetailsUrl(spaceId, discussionId, id));
  };

  const backUrl = getDiscussionDetailUrl(spaceId, discussionId);
  return (
    <div>
      <PanelHeader title="Create Version" backUrl={backUrl} />
      <ChangeForm onSubmit={onSubmit} loading={loading} backUrl={backUrl} />
    </div>
  );
};

export default CreateChange;
