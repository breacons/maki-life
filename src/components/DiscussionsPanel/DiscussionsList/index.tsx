import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';

import { getDiscussionDetailUrl } from '../../../urls';
import CreateDiscussion from '../CreateDiscussion';
import styles from './styles.module.less';
import { useDiscussions } from '../../../hooks/discussions';
import { useParams } from 'react-router';
import { List, Tag, Typography } from 'antd';
import PanelHeader from '../../PanelHeader';
import DiscussionStatusTag from '../../DiscussionStatus';
import _ from 'lodash-es';
interface Props {}

export const DiscussionsList = ({}: Props) => {
  const { discussions } = useDiscussions();
  const { discussionId, spaceId } = useParams<{
    discussionId: string | undefined;
    spaceId: string;
  }>();

  return (
    <div>
      <PanelHeader title="Discussions" centerComponent={<CreateDiscussion />} />
      <List
        itemLayout="horizontal"
        dataSource={_.sortBy(discussions, 'time').reverse()}
        className={styles.list}
        size="large"
        renderItem={(discussion) => (
          <Link to={getDiscussionDetailUrl(spaceId, discussion.id)}>
            <List.Item
              // actions={[
              //   <Link to={getDiscussionDetailUrl(spaceId, discussion.id)} key="details">
              //     Details
              //   </Link>,
              // ]}
              className={styles.listItem}
            >
              <List.Item.Meta
                title={
                  <Link to={getDiscussionDetailUrl(spaceId, discussion.id)}>
                    <Typography.Text>{discussion.title}</Typography.Text>
                  </Link>
                }
                description={
                  <Fragment>
                    <DiscussionStatusTag discussion={discussion} />
                  </Fragment>
                }
              />
            </List.Item>
          </Link>
        )}
      />
    </div>
  );
};

export default DiscussionsList;
