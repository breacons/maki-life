import { Button, Col, Divider, Dropdown, Image, Layout, Menu, Row, Space, Typography } from 'antd';
import classNames from 'classnames';
import firebase from 'firebase/app';
import React, { Fragment, PropsWithChildren } from 'react';
import { useSelector } from 'react-redux';
import { isEmpty, isLoaded } from 'react-redux-firebase';
import { useHistory } from 'react-router';
import { Link } from 'react-router-dom';

import { useSpace } from '../../../hooks/use-space';
import { RootState } from '../../../redux/reducers';
import { URL_LANDING, URL_LOGIN, URL_SPACES } from '../../../urls';
import If from '../../If';
import Logo from '../../Logo';
import SpaceItem from '../../SpaceItem';
import SpaceSelectList from '../../SpaceSelectList';
import { BaseLayout } from '../BaseLayout';
import styles from './Landing.module.less';
import logo from './logo.svg';
import UserAvatar from '../../UserAvatar';

const { Content, Footer, Header } = Layout;

// import Head from 'next/head';
interface Props {
  title?: string;
  hideHeaderSelect?: boolean;
  hideLogo?: true;
}

export default function SpaceLayout(props: PropsWithChildren<Props>) {
  const profile = useSelector((state: RootState) => state.firebase.profile);
  const history = useHistory();
  const { space } = useSpace();

  const handleSignOut = async () => {
    await firebase.auth().signOut();
    history.replace(URL_LANDING);
  };

  return (
    // <BaseLayout className={styles.layout}>
    <Fragment>
      <Header className={classNames([styles.container, styles.header])}>
        <div className={styles.headerLeft}>
          <If
            condition={!props.hideLogo}
            then={() => (
              <Link to={URL_LANDING} className={styles.logoContainer}>
                <Logo height={34} />
              </Link>
            )}
          />
          <If
            condition={!props.hideHeaderSelect}
            then={() => (
              <Fragment>
                <Divider type="vertical" className={styles.headerDivider} />
                <Dropdown placement="bottomLeft" overlay={<SpaceSelectList hideMembers />}>
                  <div>
                    <SpaceItem space={space} hideMembers />
                  </div>
                </Dropdown>
              </Fragment>
            )}
          />
        </div>
        <If
          condition={!isEmpty(profile)}
          then={() => (
            <Link to={URL_SPACES}>
              <Dropdown
                placement="bottomRight"
                arrow
                overlay={
                  <Menu>
                    <Menu.Item>
                      <Link to={URL_SPACES}>Spaces</Link>
                    </Menu.Item>
                    <Menu.Item>
                      <Link to={URL_SPACES}>Profile</Link>
                    </Menu.Item>
                    <Menu.Item>
                      <span onClick={handleSignOut}>Sign Out</span>
                    </Menu.Item>
                  </Menu>
                }
              >
                <Button type="link" className={styles.userName}>
                  <Space direction="horizontal" size={8}>
                    <UserAvatar user={profile} />
                    <strong>
                      {profile.firstName} {profile.lastName}
                    </strong>
                  </Space>
                </Button>
              </Dropdown>
            </Link>
          )}
          else={() => (
            <Link to={isEmpty(profile) ? URL_LOGIN : URL_SPACES}>
              <Button type="primary" className={styles.signInButton} loading={!isLoaded(profile)}>
                {isEmpty(profile) ? 'Log in' : 'Dashboard'}
              </Button>
            </Link>
          )}
        />
      </Header>
      {props.children}
    </Fragment>
  );
}
