import { LoadingOutlined } from '@ant-design/icons';
import React from 'react';

export const CustomSpinner = ({ size = 24 }: any) => (
  <LoadingOutlined style={{ fontSize: size }} spin />
);

export default CustomSpinner;
