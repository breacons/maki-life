import React from 'react';
import { Link } from 'react-router-dom';

import { Space } from '../../interfaces/spaces';
import { getSpaceDetailsUrl } from '../../urls';
import EditSpaceMembers from '../EditSpaceMembers';
import If from '../If';
import styles from './styles.module.less';

interface Props {
  space: Space | null;
  hideMembers?: boolean;
}

export const SpaceItem = ({ space, hideMembers }: Props) => {
  if (!space) {
    return null;
  }
  return (
    <div className={styles.row}>
      <div className={styles.headerLeft}>
        <div className={styles.spaceLogo}>🌍</div>
        <div className={styles.spaceName}>
          <Link to={getSpaceDetailsUrl(space.id)}>{space?.name}</Link>
        </div>
      </div>
      <If condition={!hideMembers} then={() => <EditSpaceMembers id={space.id} />} />
    </div>
  );
};

export default SpaceItem;
