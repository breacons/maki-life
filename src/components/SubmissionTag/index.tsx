import React from 'react';
import styles from './styles.module.less';
import { Tag } from 'antd';

interface Props {
  status: string;
}

const colors = {
  sent: 'processing',
  completed: 'success',
  declined: 'error',
};

const dictionary = {
  sent: 'Waiting',
  completed: 'Signed',
  declined: 'Declined',
};

export const SubmissionTag = ({ status }: Props) => {
  return <Tag color={(colors as any)[status]}>{(dictionary as any)[status]}</Tag>;
};

export default SubmissionTag;
