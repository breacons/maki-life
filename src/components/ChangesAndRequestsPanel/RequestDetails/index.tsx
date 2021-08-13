import React from 'react';
import { useParams } from 'react-router';

import { getDiscussionRequestEditUrl, getDiscussionRequestUrl } from '../../../urls';
import { useDiscussionRequest } from '../../../hooks/discussions';
import StatusTag from '../../StatusTag';
import { DiscussionRequest, DiscussionRequestStatus } from '../../../interfaces/discussions';
import AuthorAvatars from '../../AuthorAvatars';
import CommentsSection from '../../CommentsSection';
import ChangeTag from '../../ChangeTag';
import { useUserId } from '../../../hooks/use-user';
import PanelHeader from '../../PanelHeader';
import Description from '../../Description';
import { SectionTitle } from '../../SectionTitle';
import styles from './styles.module.less';

interface Props {}

export const RequestDetails = ({}: Props) => {
  const { spaceId, discussionId, requestId } = useParams<{
    discussionId: string;
    spaceId: string;
    requestId: string;
  }>();

  const userId = useUserId();
  const { request } = useDiscussionRequest();

  if (!request) {
    return <div>Loading...</div>;
  }
  return (
    <div>
      <PanelHeader
        title={request?.title}
        backUrl={getDiscussionRequestUrl(spaceId, discussionId, requestId)}
        rightUrl={
          (request.status === DiscussionRequestStatus.Open ||
            request.status === DiscussionRequestStatus.InProgress) &&
          request.authorUserId === userId
            ? getDiscussionRequestEditUrl(spaceId, discussionId, requestId)
            : null
        }
        footer={
          <div className={styles.headerFooter}>
            <div>
              <StatusTag request={request as DiscussionRequest} discussionId={discussionId} />
            </div>
            <AuthorAvatars request={request as DiscussionRequest} discussionId={discussionId} />
          </div>
        }
      />
      <Description text={request?.description} fullHeight />
      <SectionTitle>Related map version</SectionTitle>
      {request.solutionChangeId ? (
        <ChangeTag
          discussionId={discussionId}
          changeId={request.solutionChangeId}
          spaceId={spaceId}
        />
      ) : (
        'Not linked to map version.'
      )}

      <br />
      <br />
      <CommentsSection
        comments={request.comments}
        startPath={`discussions/${discussionId}/requests/${requestId}/comments`}
      />
    </div>
  );
};

export default RequestDetails;
