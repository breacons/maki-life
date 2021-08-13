import { Button } from 'antd';
import React, { Fragment } from 'react';
import { useParams } from 'react-router';
import { Link, Route, Switch } from 'react-router-dom';

import { Discussion } from '../../interfaces/discussions';
import {
  getDiscussionChangeCreateUrl,
  getDiscussionRequestCreateUrl,
  URL_SPACE_CHANGE,
  URL_SPACE_CHANGE_CREATE,
  URL_SPACE_CHANGE_DETAILS,
  URL_SPACE_CHANGE_EDIT,
  URL_SPACE_DISCUSSION_DETAIL,
  URL_SPACE_REQUEST,
  URL_SPACE_REQUEST_CREATE,
  URL_SPACE_REQUEST_DETAILS,
  URL_SPACE_REQUEST_EDIT,
} from '../../urls';
import ActionList from './ActionList';
import ChangeDetails from './ChangeDetails';
import CreateChange from './CreateChange';
import CreateRequest from './CreateRequest';
import Empty from './Empty';
import RequestDetails from './RequestDetails';
import EditRequest from "./EditRequest";
import EditChange from "./EditChange";

interface Props {}

export const ChangesAndRequestsPanel = ({}: Props) => {
  return (
    <Fragment>
      <Switch>
        <Route path={URL_SPACE_CHANGE_CREATE} component={CreateChange} exact />
        <Route path={URL_SPACE_CHANGE_EDIT} component={EditChange} exact />
        <Route path={URL_SPACE_REQUEST_CREATE} component={CreateRequest} exact />
        <Route path={URL_SPACE_REQUEST_EDIT} component={EditRequest} exact />
        <Route path={URL_SPACE_CHANGE_DETAILS} component={ChangeDetails} exact />
        <Route path={URL_SPACE_REQUEST_DETAILS} component={RequestDetails} exact />
        <Route path={URL_SPACE_CHANGE} component={ActionList} />
        <Route path={URL_SPACE_REQUEST} component={ActionList} />
        <Route path={URL_SPACE_DISCUSSION_DETAIL} component={ActionList} />
        <Route component={Empty} />
      </Switch>
    </Fragment>
  );
};

export default ChangesAndRequestsPanel;
