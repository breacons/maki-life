import React, { Fragment, useMemo, useState } from 'react';
import styles from './styles.module.less';
import EditDiscussion from '../EditDiscussion';
import { Link } from 'react-router-dom';
import { useSpaceId, useSpaceMember } from '../../../hooks/use-space';
import { getSpaceDiscussionsUrl, getSubmissionDetailUrl } from '../../../urls';
import { useCurrentDiscussion } from '../../../hooks/discussions';
import dayjs from 'dayjs';
import SubmissionsList from '../SubmissionsList';
import { Alert, Button, Space, Tag, Typography } from 'antd';
import {
  Discussion,
  DiscussionRequestStatus,
  DiscussionStatus,
} from '../../../interfaces/discussions';
import If from '../../If';
import axios from 'axios';
import { firebaseApiUrl } from '../../../config';
import { useHistory } from 'react-router';
import _ from 'lodash-es';
import PanelHeader from '../../PanelHeader';
import Description from '../../Description';
import { SectionTitle } from '../../SectionTitle';
import DiscussionStatusTag from '../../DiscussionStatus';
interface Props {}

export const DiscussionDetails = ({}: Props) => {
  const spaceId = useSpaceId();
  const { discussion } = useCurrentDiscussion();
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  const submitDiscussion = async () => {
    if (!discussion) {
      return;
    }

    const submissionId = Object.keys(discussion.submissions || {}).length + 1;

    setLoading(true);
    const result = await axios.post(`${firebaseApiUrl}/submitDiscussion`, {
      discussionId: discussion.id,
      submissionId,
    });

    setLoading(false);
    history.push(
      getSubmissionDetailUrl(spaceId, (discussion as Discussion).id, submissionId.toString()),
    );
  };

  const canSubmit = useMemo(() => {
    if (
      Object.keys(discussion?.requests || {}).length === 0 &&
      Object.keys(discussion?.changes || {}).length === 0
    ) {
      return false;
    }

    const unresolvedRequests = Object.values(discussion?.requests || {}).filter(
      (request) =>
        request.status === DiscussionRequestStatus.Open ||
        request.status === DiscussionRequestStatus.InProgress,
    );

    return discussion?.status === DiscussionStatus.Open && unresolvedRequests.length === 0;
  }, [discussion]);

  return (
    <div>
      <PanelHeader
        title={discussion?.title}
        backUrl={getSpaceDiscussionsUrl(spaceId)}
        rightComponent={<EditDiscussion />}
        footer={
          <Fragment>
            <DiscussionStatusTag discussion={discussion} />
            <If
              condition={canSubmit}
              then={() => <Tag color="processing">Ready for Signing</Tag>}
            />
          </Fragment>
        }
      />
      <SectionTitle>Description</SectionTitle>
      <Description text={discussion?.description} fullHeight />
      <SectionTitle>Submissions</SectionTitle>
      <Space direction="vertical" size={16}>
        <SubmissionsList discussion={discussion} />
        <If
          condition={canSubmit}
          then={() => (
            <Button
              loading={loading}
              onClick={() => submitDiscussion()}
              type="primary"
              size="large"
              block
            >
              Submit for Signing
            </Button>
          )}
          else={() => (
            <If
              condition={Object.keys(discussion?.submissions || {}).length === 0}
              then={() => (
                <Alert
                  message="Not yet submittable"
                  description="Make sure that at least one new version or request was created, and all of them are resolved!"
                  type="warning"
                />
              )}
            />
          )}
        />
      </Space>
    </div>
  );
};

export default DiscussionDetails;
