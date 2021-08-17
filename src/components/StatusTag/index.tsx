import { Dropdown, Menu, Modal, Tag, Typography } from 'antd';
import firebase from 'firebase';
import React, { Fragment, useState } from 'react';

import { useCurrentDiscussion } from '../../hooks/discussions';
import { DiscussionRequest, DiscussionRequestStatus } from '../../interfaces/discussions';
import { SectionTitle } from '../SectionTitle';
import SolutionModalContent from './SolutionModalContent';

interface Props {
  request: DiscussionRequest;
  discussionId: string;
}

const menu = (onSelect: (status: DiscussionRequestStatus) => void) => (
  <Menu onClick={(event) => onSelect(event.key as DiscussionRequestStatus)}>
    {[
      DiscussionRequestStatus.Open,
      DiscussionRequestStatus.InProgress,
      DiscussionRequestStatus.Completed,
      DiscussionRequestStatus.Revoked,
    ].map((status) => (
      <Menu.Item key={status} accessKey={status}>
        {dictionary[status]}
      </Menu.Item>
    ))}
  </Menu>
);

const dictionary = {
  [DiscussionRequestStatus.Open]: 'Open',
  [DiscussionRequestStatus.InProgress]: 'In Progress',
  [DiscussionRequestStatus.Revoked]: 'Revoked',
  [DiscussionRequestStatus.Completed]: 'Completed',
};

const colors = {
  [DiscussionRequestStatus.Open]: 'default',
  [DiscussionRequestStatus.InProgress]: 'processing',
  [DiscussionRequestStatus.Revoked]: 'gray',
  [DiscussionRequestStatus.Completed]: 'success',
};

export const StatusTag = ({ request, discussionId }: Props) => {
  const [showSolutionModal, setShowSolutionModal] = useState(false);
  const [solution, setSolution] = useState<string | null>();
  const { discussion } = useCurrentDiscussion();

  const onSelect = async (status: DiscussionRequestStatus) => {
    const path = `discussions/${discussionId}/requests/${request.id}`;
    await firebase.database().ref(path).update({ status });

    if (Object.values(discussion?.changes || {}).length !== 0) {
      if (
        request.status !== DiscussionRequestStatus.Completed &&
        status === DiscussionRequestStatus.Completed
      ) {
        setShowSolutionModal(true);
      }
    }
  };

  const saveSolution = async () => {
    const path = `discussions/${discussionId}/requests/${request.id}`;
    await firebase.database().ref(path).update({ solutionChangeId: solution });

    const changePath = `discussions/${discussionId}/changes/${solution}/solvedRequestIds`;
    await firebase
      .database()
      .ref(changePath)
      .update({ [request.id]: true });

    setShowSolutionModal(false);
    setSolution(null);
  };

  return (
    <Fragment>
      <Dropdown overlay={() => menu(onSelect)}>
        <Tag color={colors[request.status]}>{dictionary[request.status]}</Tag>
      </Dropdown>
      <Modal
        visible={showSolutionModal}
        okButtonProps={{
          disabled: !solution && Object.values(discussion?.changes || {}).length !== 0,
        }}
        onOk={saveSolution}
        onCancel={() => setShowSolutionModal(false)}
        title={null}
      >
        <SectionTitle form>Related Version</SectionTitle>
        <Typography.Text type="secondary">
          You can assign a related map version as a solution to this request.
        </Typography.Text>
        <br />
        <br />
        <SolutionModalContent setSolution={setSolution} />
      </Modal>
    </Fragment>
  );
};

export default StatusTag;
