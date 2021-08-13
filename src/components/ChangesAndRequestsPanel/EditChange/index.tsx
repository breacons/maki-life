import firebase from 'firebase';
import _ from 'lodash-es';
import React, { useState } from 'react';
import { useHistory, useParams } from 'react-router';
import { Link } from 'react-router-dom';

import { useDiscussionChange } from '../../../hooks/discussions';
import { useUserId } from '../../../hooks/use-user';
import { DiscussionChange, DiscussionRequestStatus } from '../../../interfaces/discussions';
import { getDiscussionChangeDetailsUrl } from '../../../urls';
import ChangeForm, { CreateChangeValues } from '../CreateChange/ChangeForm';
import PanelHeader from '../../PanelHeader';
import { setScreenShotPath } from '../../../redux/graphics';
import { useAppDispatch } from '../../../redux/store';

interface Props {}

export const EditChange = ({}: Props) => {
  const { spaceId, discussionId, changeId } = useParams<{
    discussionId: string;
    spaceId: string;
    changeId: string;
  }>();
  const userId = useUserId();
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const backUrl = getDiscussionChangeDetailsUrl(spaceId, discussionId, changeId);
  const dispatch = useAppDispatch();

  const { change } = useDiscussionChange();

  const onSubmit = async (values: CreateChangeValues) => {
    if (!change) {
      return;
    }

    const currentSolvedRequests = Object.keys(change.solvedRequestIds || {});
    const newSolvedRequests = Object.keys(values.solvedRequestIds || {});

    const final: Partial<DiscussionChange> = {
      ...values,
    };

    setLoading(true);
    const path = `discussions/${discussionId}/changes/${change?.id}`;
    await firebase.database().ref(path).update(final);

    if (!_.isEqual(currentSolvedRequests, newSolvedRequests)) {
      const removedRequests = currentSolvedRequests.filter(
        (current) => !newSolvedRequests.includes(current),
      );

      const addedRequests = newSolvedRequests.filter(
        (newR) => !currentSolvedRequests.includes(newR),
      );

      const removePromises = removedRequests.map((requestId) => {
        const path = `discussions/${discussionId}/requests/${requestId}`;
        return firebase
          .database()
          .ref(path)
          .update({ solutionChangeId: null, status: DiscussionRequestStatus.InProgress });
      });

      const addPromises = addedRequests.map((requestId) => {
        const path = `discussions/${discussionId}/requests/${requestId}`;
        return firebase
          .database()
          .ref(path)
          .update({ solutionChangeId: changeId, status: DiscussionRequestStatus.Completed });
      });

      await Promise.all([...removePromises, ...addPromises]);
    }

    dispatch(setScreenShotPath({ path: `screenshots/${change.id}.jpg` }));

    setLoading(false);
    history.replace(backUrl);
  };

  return (
    <div>
      <PanelHeader title="Edit version" backUrl={backUrl} />
      <ChangeForm
        onSubmit={onSubmit}
        loading={loading}
        backUrl={backUrl}
        change={change as DiscussionChange}
      />
    </div>
  );
};

export default EditChange;
