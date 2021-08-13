import React from 'react';
import { Link } from 'react-router-dom';
import styles from './styles.module.less';
import { Tag } from 'antd';
import { getDiscussionChangeDetailsUrl } from '../../urls';

interface Props {
  discussionId: string;
  changeId: string;
  spaceId: string;
}

export const ChangeTag = ({ spaceId, discussionId, changeId }: Props) => {
  return (
    <Link to={getDiscussionChangeDetailsUrl(spaceId, discussionId, changeId)}>
      <Tag>Version #{changeId.slice(0, 8)}</Tag>
    </Link>
  );
};

export default ChangeTag;
