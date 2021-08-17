import { ArrowLeftOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Divider, Tooltip, Typography } from 'antd';
import classNames from 'classnames';
import React from 'react';
import { Link } from 'react-router-dom';

import If from '../If';
import styles from './styles.module.less';

interface Props {
  title?: string | null;
  backUrl?: string | null;
  rightUrl?: string | null;
  rightComponent?: any;
  centerComponent?: any;
  footer?: any;
}

export const PanelHeader = ({
  title,
  backUrl,
  rightUrl,
  rightComponent,
  footer,
  centerComponent,
}: Props) => {
  return (
    <div>
      <If
        condition={backUrl || rightUrl || rightComponent || true}
        then={() => (
          <div className={classNames([styles.topContainer, styles.header])}>
            <If
              condition={backUrl}
              then={() => (
                <Link to={backUrl as string}>
                  <ArrowLeftOutlined />
                </Link>
              )}
            />
            <If
              condition={rightUrl}
              then={() => (
                <Link to={rightUrl as string}>
                  <Tooltip title="Edit">
                    <Button type="primary" shape="circle" icon={<EditOutlined />} />
                  </Tooltip>
                </Link>
              )}
            />
            <If condition={rightComponent} then={() => rightComponent} />
          </div>
        )}
      />

      <div className={styles.topContainer}>
        <If condition={title} then={() => <Typography.Title level={3}>{title}</Typography.Title>} />
        <If condition={centerComponent} then={() => centerComponent} />
      </div>
      <If condition={footer} then={() => footer} />
      <Divider />
    </div>
  );
};

export default PanelHeader;
