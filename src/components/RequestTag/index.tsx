import React from 'react';
import { Link } from 'react-router-dom';
import styles from './styles.module.less';
import { Tag } from 'antd';
import {getDiscussionChangeDetailsUrl, getDiscussionRequestDetailsUrl} from '../../urls';

interface Props {
  discussionId: string;
  requestId: string;
  spaceId: string;
}

export const RequestTag = ({ spaceId, discussionId, requestId }: Props) => {
  return (
    <Link to={getDiscussionRequestDetailsUrl(spaceId, discussionId, requestId)}>
      <Tag>Request #{requestId.slice(0, 8)}</Tag>
    </Link>
  );
};

export default RequestTag;
