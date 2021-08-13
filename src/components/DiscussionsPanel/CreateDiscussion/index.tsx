import React, { Fragment, useState } from 'react';
import {Button, Modal, Tooltip} from 'antd';
import { useSpaceId } from '../../../hooks/use-space';
import { v4 as uuidv4 } from 'uuid';
import { DiscussionStatus } from '../../../interfaces/discussions';
import firebase from 'firebase';
import { getDiscussionDetailUrl } from '../../../urls';
import { useHistory } from 'react-router';
import DiscussionForm from './DiscussionForm';
import {EditOutlined, PlusOutlined} from "@ant-design/icons";
import dayjs from "dayjs";

interface Props {}

export const CreateDiscussion = ({}: Props) => {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const spaceId = useSpaceId();
  const history = useHistory();

  const onSubmit = async (values: any) => {
    const id = uuidv4();
    const final = {
      ...values,
      id,
      spaceId,
      status: DiscussionStatus.Open,
      time: dayjs().unix()
    };

    setLoading(true);
    const path = `discussions/${id}`;
    await firebase.database().ref(path).set(final);

    setLoading(false);
    setShowModal(false);
    history.replace(getDiscussionDetailUrl(spaceId, id));
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
        <DiscussionForm onSubmit={onSubmit} loading={loading} />
      </Modal>

      <Tooltip title="Create">
        <Button
          type="primary"
          shape="circle"
          onClick={() => setShowModal(true)}
          icon={<PlusOutlined />}
        />
      </Tooltip>
    </Fragment>
  );
};

export default CreateDiscussion;
