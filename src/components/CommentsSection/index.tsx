import React from 'react';
import styles from './styles.module.less';
import { Comment } from '../../interfaces/comments';
import CommentsDisplay from './CommentsDisplay';
import WriteComment from './WriteComment';
import { Divider, Typography } from 'antd';
import { SectionTitle } from '../SectionTitle';

interface Props {
  comments: Record<string, Comment> | undefined;
  startPath: string;
}

export const CommentsSection = ({ comments, startPath }: Props) => {
  return (
    <div>
      <div className={styles.titleRow}>
        <SectionTitle>Comments</SectionTitle>
        <WriteComment rootPath={startPath} />
      </div>
      <div className={styles.display}>
        <CommentsDisplay comments={comments} startPath={startPath} />
      </div>
    </div>
  );
};

export default CommentsSection;
