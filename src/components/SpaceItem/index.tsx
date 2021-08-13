import React from 'react';
import styles from './styles.module.less';
import { Space } from '../../interfaces/spaces';
import { getSpaceDetailsUrl } from '../../urls';
import { Link } from 'react-router-dom';
import EditSpaceMembers from '../EditSpaceMembers';
import If from '../If';

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
