import {
  CloseOutlined,
  DeleteOutlined,
  PlusOutlined,
  StopOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Avatar, Button, Dropdown, Menu, Space, Tooltip, Typography } from 'antd';
import React, { Fragment, useMemo } from 'react';

import {
  useFetchedSpaceMember,
  useSpace,
  useSpaceMember,
  useSpaceMembers,
} from '../../hooks/use-space';
import { DiscussionRequest, DiscussionRequestStatus } from '../../interfaces/discussions';
import { User, UserType } from '../../interfaces/users';
import UserAvatar from '../UserAvatar';
import If from '../If';
import firebase from 'firebase';
import styles from './styles.module.less';
import { useCurrentDiscussion } from '../../hooks/discussions';

interface Props {
  request: DiscussionRequest;
  discussionId: string;
}

const menu = (
  members: User[],
  selectedAuthors: string[],
  onSelect: (userId: string, selected: boolean) => void,
) => (
  <Menu>
    {members.map((member) => (
      <Menu.Item key={member.id}>
        <div className={styles.memberRow}>
          <div>
            <Space direction="horizontal">
              <If
                condition={member.avatar}
                then={() => <UserAvatar user={member} />}
                else={() => <Avatar icon={<UserOutlined />} />}
              />
              <div className={styles.memberDetails}>
                <Typography.Text>
                  {member.firstName} {member.lastName}
                </Typography.Text>
                {/*<Typography.Text type="secondary" className={styles.role}>*/}
                {/*  {member?.organisation}*/}
                {/*</Typography.Text>*/}
              </div>
            </Space>
          </div>
          {selectedAuthors.includes(member.id) ? (
            <Tooltip title="Remove assignee">
              <Button
                onClick={() => onSelect(member.id, false)}
                type="primary"
                shape="circle"
                size="small"
                icon={<DeleteOutlined />}
              />
            </Tooltip>
          ) : (
            <Tooltip title="Add assignee">
              <Button
                onClick={() => onSelect(member.id, true)}
                type="primary"
                shape="circle"
                size="small"
                icon={<PlusOutlined />}
              />
            </Tooltip>
          )}
        </div>
      </Menu.Item>
    ))}
  </Menu>
);

const FetchedUserAvatar = ({ userId }: { userId: string }) => {
  const { member, isLoaded } = useFetchedSpaceMember(userId);

  if (!isLoaded || !member) {
    return <Avatar icon={<UserOutlined />} />;
  }

  return <UserAvatar user={member} />;
};

export const AuthorAvatars = ({ request, discussionId }: Props) => {
  // const { members } = useSpaceMembers(UserType.Editor);
  const { members } = useSpaceMembers();
  const { space } = useSpace();

  const assignedUserIds = useMemo(() => {
    const users = request.assignedUserIds;
    return users ? Object.keys(users).filter((key) => users[key]) : [];
  }, [request]);

  const onSelect = async (userId: string, selected: boolean) => {
    const path = `discussions/${discussionId}/requests/${request.id}/assignedUserIds`;
    await firebase
      .database()
      .ref(path)
      .update({ [userId]: selected });
  };

  return (
    <Dropdown
      overlay={() =>
        menu(
          members.filter((member) => Object.keys(space?.memberIds || {}).includes(member.id)),
          assignedUserIds,
          onSelect,
        )
      }
      placement="bottomCenter"
      arrow
    >
      {!assignedUserIds || assignedUserIds.length === 0 ? (
        <Avatar icon={<StopOutlined />} />
      ) : (
        // <Avatar.Group maxCount={2} maxStyle={{ color: '#f56a00', backgroundColor: '#fde3cf' }}>
        <div>
          {assignedUserIds.map((memberId: string, index) => (
            <UserAvatar
              user={members.find((m) => m.id === memberId) as User}
              key={index}
              bordered
            />
          ))}
        </div>
        // </Avatar.Group>
      )}
    </Dropdown>
  );
};

export default AuthorAvatars;

/*
{!assignedUserIds || assignedUserIds.length === 0 ? (
        <Avatar icon={<StopOutlined />} />
      ) : (
        <Avatar.Group maxCount={2} maxStyle={{ color: '#f56a00', backgroundColor: '#fde3cf' }}>
          {assignedUserIds.map((member: string) => (
            <FetchedUserAvatar userId={member} key={member} />
          ))}
        </Avatar.Group>
      )}

 */
