import { Image } from 'antd';
import React from 'react';

import logo from './maki-logo.svg';

export const Logo = (props: any) => {
  return <Image src={logo} preview={false} {...props} />;
};

export default Logo;
