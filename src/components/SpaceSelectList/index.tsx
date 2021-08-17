import { Alert, Menu } from 'antd';
import React from 'react';

import { useSpaces } from '../../hooks/use-space';
import SpaceItem from '../SpaceItem';
import { SpinnerOverlay } from '../SpinnerOverlay';
import styles from './styles.module.less';

interface Props {
  hideMembers?: boolean;
}

export const SpaceSelectList = ({ hideMembers = false }: Props) => {
  const { spaces, isLoaded, isEmpty } = useSpaces();

  if (!isLoaded) {
    return <SpinnerOverlay spinning />;
  }

  if (isEmpty && isLoaded) {
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
          <SpaceItem space={space} hideMembers={hideMembers} />
        </Menu.Item>
      ))}
    </Menu>
  );
};

export default SpaceSelectList;
