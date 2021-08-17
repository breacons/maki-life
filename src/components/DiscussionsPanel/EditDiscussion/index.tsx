import { EditOutlined } from '@ant-design/icons';
import { Button, Modal, Tooltip } from 'antd';
import firebase from 'firebase';
import React, { Fragment, useState } from 'react';
import { useHistory } from 'react-router';

import { useCurrentDiscussion } from '../../../hooks/discussions';
import { useSpaceId } from '../../../hooks/use-space';
import { getDiscussionDetailUrl } from '../../../urls';
import DiscussionForm from '../CreateDiscussion/DiscussionForm';

interface Props {}

export const EditDiscussion = ({}: Props) => {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const { discussion } = useCurrentDiscussion();

  const spaceId = useSpaceId();
  const history = useHistory();

  const onSubmit = async (values: any) => {
    if (!discussion) {
      return;
    }

    const final = {
      ...values,
    };

    setLoading(true);
    const path = `discussions/${discussion.id}`;
    await firebase.database().ref(path).update(final);

    setLoading(false);
    setShowModal(false);
    history.replace(getDiscussionDetailUrl(spaceId, discussion.id));
  };

  return (
    <Fragment>
      <Modal
        visible={showModal}
        title={null}
        footer={null}
        width={900}
        onCancel={() => setShowModal(false)}
        centered
      >
        <DiscussionForm onSubmit={onSubmit} loading={loading} discussion={discussion} />
      </Modal>

      <Tooltip title="Edit">
        <Button
          type="primary"
          shape="circle"
          onClick={() => setShowModal(true)}
          icon={<EditOutlined />}
        />
      </Tooltip>
    </Fragment>
  );
};

export default EditDiscussion;
