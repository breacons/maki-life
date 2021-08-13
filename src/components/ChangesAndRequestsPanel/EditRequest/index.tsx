import React, { useState } from 'react';
import { useHistory, useParams } from 'react-router';
import { useUserId } from '../../../hooks/use-user';
import RequestForm, { CreateRequestValues } from '../CreateRequest/RequestForm';
import { GraphicJSON } from '../../../interfaces/esri';
import { getSelectedGraphics, setScreenShotPath } from '../../../redux/graphics';
import { store, useAppDispatch } from '../../../redux/store';
import { DiscussionRequest } from '../../../interfaces/discussions';
import firebase from 'firebase';
import { getDiscussionRequestDetailsUrl } from '../../../urls';
import { Link } from 'react-router-dom';
import { useDiscussionRequest } from '../../../hooks/discussions';
import PanelHeader from "../../PanelHeader";

interface Props {}

export const EditRequest = ({}: Props) => {
  const { spaceId, discussionId, requestId } = useParams<{
    discussionId: string;
    spaceId: string;
    requestId: string;
  }>();
  const userId = useUserId();
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const backUrl = getDiscussionRequestDetailsUrl(spaceId, discussionId, requestId);
  const dispatch = useAppDispatch();

  const { request } = useDiscussionRequest();

  const onSubmit = async (values: CreateRequestValues) => {
    if (!request) {
      return;
    }

    const graphics: GraphicJSON[] | null = getSelectedGraphics(store.getState());
    const final: Partial<DiscussionRequest> = {
      ...values,
    };

    if (graphics) {
      final.graphics = graphics;
    }

    setLoading(true);
    const path = `discussions/${discussionId}/requests/${request?.id}`;
    await firebase.database().ref(path).update(final);

    dispatch(setScreenShotPath({ path: `screenshots/${request.id}.jpg` }));

    setLoading(false);
    history.replace(backUrl);
  };

  return (
    <div>
      <PanelHeader title='Edit request' backUrl={backUrl}/>
      <RequestForm
        onSubmit={onSubmit}
        loading={loading}
        backUrl={backUrl}
        request={request as DiscussionRequest}
      />
    </div>
  );
};

export default EditRequest;
