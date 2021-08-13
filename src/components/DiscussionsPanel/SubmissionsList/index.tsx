import React, { useMemo } from 'react';
import styles from './styles.module.less';
import { Discussion } from '../../../interfaces/discussions';
import dayjs from 'dayjs';
import { firebaseObjectToArray } from '../../../utils/firebase-transformers';
import _ from 'lodash-es';
import {getDiscussionChangeDetailsUrl, getDiscussionChangeUrl, getSubmissionDetailUrl} from '../../../urls';
import { Link } from 'react-router-dom';
import { useSpaceId } from '../../../hooks/use-space';
import {Button, Divider, Tag, Tooltip, Typography} from 'antd';
import UserDetailsTooltip from '../../UserDetailsTooltip';
import SubmissionTag from '../../SubmissionTag';
import classNames from "classnames";
import {EllipsisOutlined} from "@ant-design/icons";
interface Props {
  discussion: Discussion | undefined | null;
}

export const SubmissionsList = ({ discussion }: Props) => {
  const spaceId = useSpaceId();
  const submissions = useMemo(() => {
    if (!discussion || !discussion.submissions) {
      return [];
    }

    return _.sortBy(
      firebaseObjectToArray(discussion.submissions).map((submission) => ({
        ...submission,
        time: dayjs(submission.envelope.createdDateTime),
      })),
      'time',
    ).reverse();
  }, [discussion]);

  return (
    <div>
      {submissions.map((submission) => (
        <div key={submission.id}>
          <div
            className={classNames([
              styles.itemHeader,
            ])}
          >
            <Link to={getSubmissionDetailUrl(spaceId, (discussion as Discussion).id, submission.id)}>
              <strong>Submission #{submission.id}</strong>
            </Link>
            <Tooltip title="Details">
              <Link to={getSubmissionDetailUrl(spaceId, (discussion as Discussion).id, submission.id)}>
                <Button
                  type="default"
                  shape="circle"
                  icon={<EllipsisOutlined />}
                  size="small"
                />
              </Link>
            </Tooltip>
          </div>

          <div>
            <Typography.Text type="secondary">
              <SubmissionTag status={submission.envelope.status} />
              <Divider type="vertical" />
              {submission.time.format('YYYY.MM.DD. HH:mm')}
            </Typography.Text>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SubmissionsList;
