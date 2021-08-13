import React from 'react';
import styles from './styles.module.less';
import { Discussion, DiscussionStatus } from '../../interfaces/discussions';
import { Tag } from 'antd';
import { CheckCircleOutlined, SyncOutlined, ClockCircleOutlined } from '@ant-design/icons';

interface Props {
  discussion: Discussion | null | undefined;
}

const dictionary = {
  [DiscussionStatus.Open]: 'Open',
  [DiscussionStatus.Submitted]: 'Submitted for Signatures',
  [DiscussionStatus.Agreed]: 'Agreement reached',
};

const colors = {
  [DiscussionStatus.Open]: 'default',
  [DiscussionStatus.Submitted]: 'processing',
  [DiscussionStatus.Agreed]: 'success',
};

const icons = {
  [DiscussionStatus.Open]: <ClockCircleOutlined />,
  [DiscussionStatus.Submitted]: <SyncOutlined />,
  [DiscussionStatus.Agreed]: <CheckCircleOutlined />,
};

export const DiscussionStatusTag = ({ discussion }: Props) => {
  if (!discussion) {
    return null;
  }
  return <Tag color={colors[discussion.status]}>{dictionary[discussion?.status]}</Tag>;
};

export default DiscussionStatusTag;
