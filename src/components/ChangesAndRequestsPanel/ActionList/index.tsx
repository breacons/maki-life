import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  EllipsisOutlined,
  PlayCircleOutlined,
} from '@ant-design/icons';
import { Button, Divider, Space, Tag, Timeline, Tooltip, Typography } from 'antd';
import classNames from 'classnames';
import dayjs from 'dayjs';
import _ from 'lodash-es';
import React, { useMemo } from 'react';
import { useParams } from 'react-router';
import { Link } from 'react-router-dom';

import { useDiscussion } from '../../../hooks/discussions';
import { useSpaceMember } from '../../../hooks/use-space';
import { useIsEditor } from '../../../hooks/use-user';
import {
  DiscussionActionType,
  DiscussionChange,
  DiscussionChangeStatus,
  DiscussionRequest,
  DiscussionRequestStatus,
} from '../../../interfaces/discussions';
import {
  getDiscussionChangeCreateUrl,
  getDiscussionChangeDetailsUrl,
  getDiscussionChangeUrl,
  getDiscussionRequestCreateUrl,
  getDiscussionRequestDetailsUrl,
  getDiscussionRequestUrl,
} from '../../../urls';
import If from '../../If';
import PanelHeader from '../../PanelHeader';
import UserDetailsTooltip from '../../UserDetailsTooltip';
import styles from './styles.module.less';

interface Props {}

const icons = {
  [DiscussionRequestStatus.Open]: <PlayCircleOutlined />,
  [DiscussionRequestStatus.InProgress]: <ClockCircleOutlined />,
  [DiscussionRequestStatus.Revoked]: <CloseCircleOutlined />,
  [DiscussionRequestStatus.Completed]: <CheckCircleOutlined />,
  [DiscussionChangeStatus.Published]: <CheckCircleOutlined />,
};

const colors = {
  [DiscussionRequestStatus.Open]: 'default',
  [DiscussionRequestStatus.InProgress]: 'processing',
  [DiscussionRequestStatus.Revoked]: 'gray',
  [DiscussionRequestStatus.Completed]: 'success',
  [DiscussionChangeStatus.Published]: 'success',
};

const ItemFooter = ({ action }: { action: DiscussionChange | DiscussionRequest }) => {
  const { member } = useSpaceMember(action.authorUserId);

  return (
    <div style={{ marginTop: 2 }}>
      <Typography.Text type="secondary">
        <Tag style={{ marginRight: 0 }} color={colors[action.status]}>
          {icons[action.status]}
        </Tag>
        <Divider type="vertical" />
        <UserDetailsTooltip member={member} />
        <Divider type="vertical" />
        {dayjs.unix(action.time).format('YYYY.MM.DD.')}
      </Typography.Text>
      {/*<Tag>{action.status}</Tag>*/}
    </div>
  );
};

export const ActionList = ({}: Props) => {
  const isEditor = useIsEditor();
  const { spaceId, discussionId, changeId, requestId } = useParams<{
    discussionId: string;
    spaceId: string;
    requestId: string;
    changeId: string;
  }>();

  const { discussion } = useDiscussion();

  const actions = useMemo(() => {
    if (!discussion) {
      return null;
    }

    return _.sortBy(
      [...Object.values(discussion.changes || {}), ...Object.values(discussion.requests || {})],
      'time',
    ).reverse();
  }, [discussion]);

  if (!discussion || !actions) {
    return <div>Select a discussion</div>;
  }

  return (
    <div>
      <PanelHeader title={'Timeline'} />

      <Timeline>
        <Timeline.Item>
          <Space direction="horizontal">
            <If
              condition={isEditor}
              then={() => (
                <Link to={getDiscussionChangeCreateUrl(spaceId, discussionId)}>
                  <Button type="primary" size="small">
                    Publish version
                  </Button>
                </Link>
              )}
            />

            <Link to={getDiscussionRequestCreateUrl(spaceId, discussionId)}>
              <Button type="primary" size="small">
                Add request
              </Button>
            </Link>
          </Space>
        </Timeline.Item>
        {actions.map((action: DiscussionRequest | DiscussionChange) => {
          return (
            <If
              condition={action?.type === DiscussionActionType.Change}
              then={() => (
                <Timeline.Item color={action.id === changeId ? '#658dfc' : '#FD6F63'}>
                  <div>
                    <div
                      className={classNames([
                        styles.itemHeader,
                        { [styles.itemHeaderActive]: action.id === changeId },
                      ])}
                    >
                      <Link to={getDiscussionChangeUrl(spaceId, discussion.id, action.id)}>
                        {action.title}
                      </Link>
                      <Tooltip title="Details">
                        <Link to={getDiscussionChangeDetailsUrl(spaceId, discussion.id, action.id)}>
                          <Button
                            type="default"
                            shape="circle"
                            icon={<EllipsisOutlined />}
                            size="small"
                          />
                        </Link>
                      </Tooltip>
                    </div>
                    <ItemFooter action={action} />
                  </div>
                </Timeline.Item>
              )}
              else={() => (
                <Timeline.Item color={action.id === requestId ? '#658dfc' : '#FECE63'}>
                  <div>
                    <div
                      className={classNames([
                        styles.itemHeader,
                        { [styles.itemHeaderActive]: action.id === requestId },
                      ])}
                    >
                      <Link to={getDiscussionRequestUrl(spaceId, discussion.id, action.id)}>
                        {action.title}
                      </Link>

                      <Tooltip title="Details">
                        <Link
                          to={getDiscussionRequestDetailsUrl(spaceId, discussion.id, action.id)}
                        >
                          <Button
                            type="default"
                            shape="circle"
                            icon={<EllipsisOutlined />}
                            size="small"
                          />
                        </Link>
                      </Tooltip>
                    </div>
                    <ItemFooter action={action} />
                  </div>
                </Timeline.Item>
              )}
              key={action.id}
            />
          );
        })}
        <Timeline.Item>Discussion was created</Timeline.Item>
      </Timeline>
    </div>
  );
};

export default ActionList;
