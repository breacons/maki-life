import { Alert } from 'antd';
import React, { Fragment, useMemo } from 'react';
import { useParams } from 'react-router';
import { Redirect } from 'react-router-dom';

import { useDiscussionChange } from '../../../hooks/discussions';
import {
  getDiscussionChangeEditUrl,
  getDiscussionChangeUrl,
  getDiscussionDetailUrl,
} from '../../../urls';
import CommentsSection from '../../CommentsSection';
import Description from '../../Description';
import If from '../../If';
import PanelHeader from '../../PanelHeader';
import RequestTag from '../../RequestTag';
import { SectionTitle } from '../../SectionTitle/SectionTitle';

interface Props {}

export const ChangeDetails = ({}: Props) => {
  const { spaceId, discussionId, changeId } = useParams<{
    discussionId: string;
    spaceId: string;
    changeId: string;
  }>();

  const backUrl = useMemo(() => getDiscussionChangeUrl(spaceId, discussionId, changeId), []);

  const { change, isLoaded } = useDiscussionChange();

  if (isLoaded && !change) {
    return <Redirect to={getDiscussionDetailUrl(spaceId, discussionId)} />;
  }

  return (
    <div>
      <PanelHeader
        title={change?.title}
        backUrl={backUrl}
        rightUrl={getDiscussionChangeEditUrl(spaceId, discussionId, changeId)}
      />

      <Description text={change?.description} fullHeight />

      <SectionTitle>Solved requests</SectionTitle>
      <If
        condition={change?.solvedRequestIds}
        then={() => (
          <Fragment>
            {Object.keys(change?.solvedRequestIds || {}).map((requestId) => (
              <RequestTag
                spaceId={spaceId}
                discussionId={discussionId}
                requestId={requestId}
                key={requestId}
              />
            ))}
          </Fragment>
        )}
        else={() => <Alert type="info" message="No requests were linked to this version yet." />}
      />
      <CommentsSection
        comments={change?.comments}
        startPath={`discussions/${discussionId}/changes/${changeId}/comments`}
      />
    </div>
  );
};

export default ChangeDetails;
