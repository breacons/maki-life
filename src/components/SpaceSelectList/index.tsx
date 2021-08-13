import React from 'react';
import styles from './styles.module.less';
import { useSpaces } from '../../hooks/use-space';
import { Alert, Menu, Spin } from 'antd';
import { Link } from 'react-router-dom';
import { getSpaceDetailsUrl } from '../../urls';
import SpaceItem from '../SpaceItem';
import { SpinnerOverlay } from '../SpinnerOverlay';

interface Props {
  hideMembers?: boolean
}

export const SpaceSelectList = ({hideMembers = false}: Props) => {
  const { spaces, isLoaded, isEmpty } = useSpaces();

  if (!isLoaded) {
    return <SpinnerOverlay spinning />;
  }

  if ((isEmpty && isLoaded)) {
    return (
      <Alert
        message="You don't have access to any spaces yet."
        description="Get invited or creat a new one!"
        type="info"
        showIcon
      />
    );
  }

  return (
    <Menu className={styles.container}>
      {spaces.map((space) => (
        <Menu.Item key={space.id}>
          <SpaceItem space={space} hideMembers={hideMembers}/>
        </Menu.Item>
      ))}
    </Menu>
  );
};

export default SpaceSelectList;
