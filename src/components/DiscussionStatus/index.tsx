import { Tag } from 'antd';
import React from 'react';

import { Discussion, DiscussionStatus } from '../../interfaces/discussions';

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

export const DiscussionStatusTag = ({ discussion }: Props) => {
  if (!discussion) {
    return null;
  }
  return <Tag color={colors[discussion.status]}>{dictionary[discussion?.status]}</Tag>;
};

export default DiscussionStatusTag;
