import { Avatar } from 'antd';
import { AvatarProps } from 'antd/es/avatar';
import React from 'react';
import { User } from '../../interfaces/users';
import { UserOutlined } from '@ant-design/icons';
import styles from './styles.module.less';
import classNames from 'classnames';

interface UserAvatarProps {
  user: User | null;
  bordered?: boolean;
}

const UserAvatar: React.FC<UserAvatarProps & Partial<AvatarProps>> = ({
  user,
  bordered,
  ...rest
}: UserAvatarProps & Partial<AvatarProps>) => {
  if (!user) {
    return <Avatar icon={<UserOutlined />} />;
  }

  const name = [user.firstName || '', user.lastName || '']
    .map((n) => n.slice(0, 1))
    .join('')
    .toUpperCase();

  return (
    <>
      {user.avatar ? (
        <Avatar
          key="avatar"
          src={user.avatar}
          {...rest}
          className={classNames({ [styles.bordered]: bordered })}
        />
      ) : (
        <Avatar key="avatar" {...rest} className={classNames({ [styles.bordered]: bordered })}>
          {name}
        </Avatar>
      )}
    </>
  );
};

export default UserAvatar;
