import { Alert } from 'antd';
import React from 'react';

import PanelHeader from '../../PanelHeader';

interface Props {}

export const Empty = ({}: Props) => {
  return (
    <div>
      <PanelHeader title={'Timeline'} />
      <Alert message="Select a discussion to get started with the timeline." type="info" showIcon />
    </div>
  );
};

export default Empty;
