import { Alert, Button, Divider, Image, List, Space, Typography } from 'antd';
import axios from 'axios';
import React, { useEffect, useMemo, useState } from 'react';
import { useHistory, useParams } from 'react-router';

import { firebaseApiUrl } from '../../../config';
import { useCurrentDiscussion } from '../../../hooks/discussions';
import { useQuery } from '../../../hooks/query';
import { useSpaceId } from '../../../hooks/use-space';
import { useUserId } from '../../../hooks/use-user';
import { Discussion } from '../../../interfaces/discussions';
import { getDiscussionDetailUrl } from '../../../urls';
import CustomSpinner from '../../CustomSpinner';
import If from '../../If';
import PanelHeader from '../../PanelHeader';
import { SectionTitle } from '../../SectionTitle';
import SubmissionTag from '../../SubmissionTag';
import docuSignLogo from './image/DocuSign_Logo.svg';
import styles from './styles.module.less';

interface Props {}

// TODO: warning it takes a few minutes to verify the signatures
export const SubmissionDetails = ({}: Props) => {
  const { discussion } = useCurrentDiscussion();
  const spaceId = useSpaceId();
  const history = useHistory();
  const userId = useUserId();
  const [loading, setLoading] = useState(false);

  const query = useQuery();

  const { submissionId } = useParams<{ submissionId: string }>();

  useEffect(() => {
    if (discussion) {
      if (!discussion.submissions || !(submissionId in discussion.submissions)) {
        history.replace(getDiscussionDetailUrl(spaceId, discussion.id));
      }
    }
  }, [submissionId, discussion]);

  const submission = useMemo(() => {
    if (!discussion || !submissionId) {
      return null;
    }

    return discussion.submissions[submissionId];
  }, [submissionId, discussion]);

  const signatureResult = useMemo(() => {
    if (!query) return null;

    const event = query.get('event');

    return {
      signed: event === 'signing_complete',
      declined: event === 'decline',
      userId: query.get('signerId'),
    };
  }, [query]);

  const canSign = useMemo(() => {
    if (signatureResult && signatureResult.signed) {
      return false;
    }

    if (userId && submission && submission.envelope && submission.envelope.recipients) {
      const me = submission.envelope.recipients.signers.find(
        (recipient) => recipient.clientUserId === userId,
      );

      if (me && me.status === 'sent') {
        return true;
      }
    }

    return false;
  }, [discussion, userId, signatureResult]);

  // useEffect(() => {
  //   if (query.get('event')) {
  //     setTimeout(() => {
  //       history.replace(
  //         getSubmissionDetailUrl(spaceId, (discussion as Discussion).id, submissionId),
  //       );
  //     }, 5000);
  //   }
  // }, [query]);

  const signDiscussion = async () => {
    if (!discussion) {
      return;
    }

    setLoading(true);
    const result = await axios.post(`${firebaseApiUrl}/requestSigning`, {
      discussionId: discussion.id,
      submissionId: submissionId,
      userId,
    });
    const { url } = result.data;
    console.log('finished', result.data);
    window.location.replace(url);

    setLoading(false);
    // history.push(
    //   getSubmissionDetailUrl(spaceId, (discussion as Discussion).id, submissionId.toString()),
    // );
  };

  return (
    <div>
      <PanelHeader
        title={`Submission #${submissionId}`}
        backUrl={discussion ? getDiscussionDetailUrl(spaceId, (discussion as Discussion).id) : '#'}
      />
      <If
        condition={submission && submission.envelope && submission.envelope.status === 'completed'}
        then={() => (
          <Space direction="vertical" size={12}>
            <Alert message="An agreement was reached for this discussion." type="success" />
            <Button loading={loading} block type="primary" size="large">
              Download Signed Document
            </Button>
          </Space>
        )}
      />
      <If
        condition={canSign}
        then={() => (
          <Space direction="vertical" size={12}>
            <Alert message="This submission is waiting for your signature!" type="success" />
            <Button onClick={signDiscussion} loading={loading} block type="primary" size="large">
              Sign Document
            </Button>
            <Divider />
          </Space>
        )}
      />
      <If
        condition={signatureResult && signatureResult.signed}
        then={() => (
          <Alert
            message="Signature completed, it might take a few seconds to update the submission status."
            type="success"
          />
        )}
      />
      <If
        condition={signatureResult && signatureResult.declined && canSign}
        then={() => <Alert message="You declined this submission." type="error" />}
      />
      <If
        condition={submission && submission.envelope && submission.envelope.recipients}
        then={() => (
          <div>
            <SectionTitle form>Recipients</SectionTitle>
            <List
              dataSource={submission?.envelope.recipients.signers}
              itemLayout="horizontal"
              renderItem={(signer) => (
                <List.Item>
                  <List.Item.Meta
                    title={
                      <Typography.Text key={signer.clientUserId}>
                        {signer.name}
                        <Divider type="vertical" />
                        <SubmissionTag status={signer.status} />
                      </Typography.Text>
                    }
                    description={signer.email}
                  />
                </List.Item>
              )}
            />
          </div>
        )}
        else={() => (
          <div className={styles.docusignLoading}>
            <CustomSpinner size={44} />

            <Image src={docuSignLogo} preview={false} width={140} />
            <Typography.Title level={5}>
              The document is currently being created with Docusign.
            </Typography.Title>
          </div>
        )}
      />
    </div>
  );
};

export default SubmissionDetails;
