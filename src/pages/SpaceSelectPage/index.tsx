import { PlusOutlined } from '@ant-design/icons';
import { Button, Divider, Space, Typography } from 'antd';
import React from 'react';
import { Link } from 'react-router-dom';

import { PageTitle } from '../../components/Header';
import SpaceLayout from '../../components/Layout/SpaceLayout';
import SpaceSelectList from '../../components/SpaceSelectList';
import { URL_CREATE_SPACE } from '../../urls';
import styles from './styles.module.less';

interface Props {}

export const SpaceSelectPage = ({}: Props) => {
  return (
    <SpaceLayout hideHeaderSelect>
      <PageTitle title="Spaces" />
      <div className={styles.container}>
        <div className={styles.inner}>
          <Typography.Title level={2} style={{ textAlign: 'center' }}>
            Your spaces
          </Typography.Title>
          <Divider />
          <Space direction="vertical" size={16} style={{ width: '100%' }}>
            <SpaceSelectList />

            <Link to={URL_CREATE_SPACE}>
              <Button icon={<PlusOutlined />} type="default" block size="large">
                Create Space
              </Button>
            </Link>
          </Space>
        </div>
      </div>
    </SpaceLayout>
  );
};

export default SpaceSelectPage;
