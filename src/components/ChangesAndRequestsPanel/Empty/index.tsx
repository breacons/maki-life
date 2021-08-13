import React from 'react';

import styles from './styles.module.less';
import PanelHeader from '../../PanelHeader';
import {Alert} from "antd";

interface Props {}

export const Empty = ({}: Props) => {
  return (
    <div>
      <PanelHeader title={'Timeline'} />
      <Alert message='Select a discussion to get started with the timeline.' type='info' showIcon/>
    </div>
  );
};

export default Empty;
