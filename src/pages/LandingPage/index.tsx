import React from 'react';
import styles from './styles.module.less';
import SpaceLayout from '../../components/Layout/SpaceLayout';
import { PageTitle } from '../../components/Header';
import landingImage from './images/landing-logo.png';
import landingScreen from './images/maki-landing-screen.png';
import { Col, Row, Image, Layout, Typography } from 'antd';

interface Props {}

export const LandingPage = ({}: Props) => {
  return (
    <SpaceLayout hideHeaderSelect={true} hideLogo>
      <div className={styles.page}>
        <PageTitle title={'Welcome'} />
        <Layout.Content className={styles.container}>
          <Row>
            <Col span={9}>
              <Image preview={false} src={landingImage} width={320} />
              {/*<Typography.Title level={4} className={styles.subTitle}>*/}
              {/*  Digital collaborative conservation planning platform.*/}
              {/*</Typography.Title>*/}
            </Col>
            <Col span={15}>
              <Image
                preview={false}
                src={landingScreen}
                style={{ width: '100%' }}
                className={styles.screenshot}
              />
            </Col>
          </Row>
        </Layout.Content>
      </div>
    </SpaceLayout>
  );
};

export default LandingPage;
