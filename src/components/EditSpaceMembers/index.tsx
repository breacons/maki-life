import React, { useState } from 'react';
import styles from './styles.module.less';
import { useSpaces } from '../../hooks/use-space';
import { Button, Modal } from 'antd';
import EditSpaceMembersForm from './EditSpaceMembersForm';
import {UsergroupAddOutlined, UserOutlined} from "@ant-design/icons";

interface Props {
  id: string
}

export const EditSpaceMembers = ({id}: Props) => {
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
        <EditSpaceMembersForm spaceId={id}/>
      </Modal>
      <Button onClick={() => setShowModal(true)} icon={<UserOutlined />} shape='circle'/>
    </div>
  );
};

export default EditSpaceMembers;
