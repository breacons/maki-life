import React, { Fragment, useEffect, useState } from 'react';
import styles from './styles.module.less';
import { Form } from '../../Form/Form';
import _ from 'lodash-es';
import { Field } from 'react-final-form';
import Input, { TextArea } from '../../Form/Input';
import { Alert, Button, Tooltip, Typography } from 'antd';
import { Link } from 'react-router-dom';
import { CreateRequestValues } from '../../ChangesAndRequestsPanel/CreateRequest/RequestForm';
import { joi } from '../../../lib/joi';
import { validateSchema } from '../../Form/validation';
import { useSelector } from 'react-redux';
import {
  getEditedComment,
  getRepliedComment,
  unsetEditedComment,
  unsetRepliedComment,
} from '../../../redux/comments';
import If from '../../If';
import firebase from 'firebase';
import { v4 as uuidv4 } from 'uuid';
import { useUserId } from '../../../hooks/use-user';
import dayjs from 'dayjs';
import { useAppDispatch } from '../../../redux/store';
import { CloseOutlined, PlusOutlined, SendOutlined } from '@ant-design/icons';
import { useSpaceMember } from '../../../hooks/use-space';

interface Props {
  rootPath: string;
}

const requestSchema = joi
  .object({
    content: joi.string().required(),
  })
  .unknown(true)
  .required();
const validator = validateSchema(requestSchema);

const MemberName = ({ memberId }: { memberId: string }) => {
  const { member } = useSpaceMember(memberId);

  return (
    <Fragment>
      {member?.firstName} {member?.lastName}
    </Fragment>
  );
};

export const WriteComment = ({ rootPath }: Props) => {
  const [loading, setLoading] = useState(false);
  const editedComment = useSelector(getEditedComment);
  const repliedComment = useSelector(getRepliedComment);
  const [writingComment, setWritingComment] = useState(false);
  const userId = useUserId();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (editedComment || repliedComment) {
      setWritingComment(true);
    } else {
      setWritingComment(false);
    }
  }, [editedComment, repliedComment]);

  const onSubmit = async (values: any, form: any) => {
    setLoading(true);

    const id = editedComment?.id || uuidv4();
    const final = {
      id,
      authorId: userId,
      content: values.content,
      time: editedComment?.time || dayjs().unix(),
      lastUpdated: dayjs().unix(),
    };

    let path = `${rootPath}/${id}`;

    if (repliedComment) {
      path = `${repliedComment.path}/replies/${id}`;
    }

    if (editedComment) {
      path = editedComment.path as string;
    }

    await firebase.database().ref(path).update(final);

    form.initialize({ content: '' });
    form.resetFieldState('content');

    dispatch(unsetRepliedComment());
    dispatch(unsetEditedComment());
    setWritingComment(false);

    setLoading(false);
  };

  const closeWriting = () => {
    dispatch(unsetRepliedComment());
    dispatch(unsetEditedComment());
    setWritingComment(false);

    setLoading(false);
  };

  return (
    <Fragment>
      <Tooltip title="Comment">
        <Button
          type="primary"
          shape="circle"
          icon={<PlusOutlined />}
          onClick={() => setWritingComment(true)}
        />
      </Tooltip>
      <If
        condition={writingComment}
        then={() => (
          <div className={styles.writingContainer}>
            <div className={styles.writingMeta}>
              <If
                condition={repliedComment}
                then={() => (
                  <Typography.Text type="secondary">
                    Replying to <MemberName memberId={repliedComment?.authorId as string} />.
                  </Typography.Text>
                )}
              />
              <If
                condition={editedComment}
                then={() => (
                  <Typography.Text type="secondary">Editing your comment.</Typography.Text>
                )}
              />
            </div>
            <Form
              onSubmit={(values, form) => onSubmit(values as CreateRequestValues, form)}
              key="edit-request"
              validator={validator}
              initialValues={{ content: editedComment?.content || null }}
              preventPrompt={false}
              loading={loading}
            >
              {({ valid, pristine }) => (
                <div className={styles.form}>
                  <Field
                    name="content"
                    component={TextArea}
                    type="text"
                    // label="Content"
                    placeholder="Start typing your comment..."
                    style={{ height: 100, fontSize: 14, resize: 'none' }}
                  />
                  <div className={styles.formButtons}>
                    <Button
                      type="dashed"
                      block
                      size="middle"
                      shape="circle"
                      icon={<CloseOutlined />}
                      onClick={closeWriting}
                    />
                    <Button
                      disabled={!valid}
                      type="primary"
                      block
                      size="middle"
                      htmlType="submit"
                      shape="circle"
                      icon={<SendOutlined />}
                    />
                  </div>
                </div>
              )}
            </Form>
          </div>
        )}
      />
    </Fragment>
  );
};

export default WriteComment;
