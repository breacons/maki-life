import { UserOutlined } from '@ant-design/icons';
import { Button, Modal } from 'antd';
import React, { useState } from 'react';

import EditSpaceMembersForm from './EditSpaceMembersForm';

interface Props {
  id: string;
}

export const EditSpaceMembers = ({ id }: Props) => {
  const [showModal, setShowModal] = useState(false);
  return (
    <div>
      <Modal
        visible={showModal}
        onOk={() => setShowModal(false)}
        onCancel={() => setShowModal(false)}
        width={900}
        okText="Finish"
        centered
      >
        <EditSpaceMembersForm spaceId={id} />
      </Modal>
      <Button onClick={() => setShowModal(true)} icon={<UserOutlined />} shape="circle" />
    </div>
  );
};

export default EditSpaceMembers;
