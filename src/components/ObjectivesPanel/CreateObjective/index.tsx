import React, { Fragment, useState } from 'react';
import styles from './styles.module.less';
import { useSpaceId } from '../../../hooks/use-space';
import { useHistory } from 'react-router';
import { v4 as uuidv4 } from 'uuid';
import { DiscussionStatus } from '../../../interfaces/discussions';
import dayjs from 'dayjs';
import firebase from 'firebase';
import { getDiscussionDetailUrl } from '../../../urls';
import { Button, Modal, Tooltip } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import ObjectiveForm from '../ObjectiveForm';

interface Props {}

export const CreateObjective = ({}: Props) => {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const spaceId = useSpaceId();
  const history = useHistory();

  const onSubmit = async (values: any) => {
    const id = uuidv4();
    const final = {
      ...values,
      id,
    };

    setLoading(true);
    const path = `spaces/${spaceId}/objectives/${id}`;
    await firebase.database().ref(path).set(final);

    setLoading(false);
    setShowModal(false);
  };

  return (
    <Fragment>
      <Modal
        visible={showModal}
        title={<strong>Create Objective</strong>}
        footer={null}
        width={900}
        onCancel={() => setShowModal(false)}
        centered
      >
        <ObjectiveForm onSubmit={onSubmit} loading={loading} />
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

export default CreateObjective;
