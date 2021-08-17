import { List, Typography } from 'antd';
import _ from 'lodash-es';
import React, { Fragment } from 'react';
import { useParams } from 'react-router';
import { Link } from 'react-router-dom';

import { useDiscussions } from '../../../hooks/discussions';
import { getDiscussionDetailUrl } from '../../../urls';
import DiscussionStatusTag from '../../DiscussionStatus';
import PanelHeader from '../../PanelHeader';
import CreateDiscussion from '../CreateDiscussion';
import styles from './styles.module.less';

interface Props {}

export const DiscussionsList = ({}: Props) => {
  const { discussions } = useDiscussions();
  const { spaceId } = useParams<{
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
