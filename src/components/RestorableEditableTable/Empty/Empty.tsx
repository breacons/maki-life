import { MehOutlined, ReloadOutlined } from '@ant-design/icons';
import { Button, Result } from 'antd';
import React, { ReactElement } from 'react';
import { FormattedMessage } from 'react-intl';
interface Props {
  isLoading: boolean;
  error: Error | null;
}
export function ProductGroupsListPageListEmpty({ isLoading, error }: Props): ReactElement {
  if (isLoading) {
    return (
      <FormattedMessage
        id="ProductGroupsListPage.List.LoadingMessage"
        defaultMessage="Loading in progress..."
      />
    );
  }
  if (error) {
    return (
      <Result
        status="warning"
        title={
          <FormattedMessage
            id="ProductGroupsListPage.List.Error.FailedToLoad"
            defaultMessage="An error happened while fetching data."
          />
        }
        subTitle={
          <FormattedMessage
            id="ProductGroupsListPage.List.Error.Description"
            defaultMessage="Please try to refresh the page."
          />
        }
        extra={
          <Button icon={<ReloadOutlined />} type="primary" key="refresh">
            <FormattedMessage
              id="ProductGroupsListPage.List.Error.RefreshButton"
              defaultMessage="Refresh"
            />
          </Button>
        }
      />
    );
  }
  return (
    <Result
      icon={<MehOutlined />}
      title={
        <FormattedMessage
          id="ProductGroupsListPage.List.Empty.Title"
          defaultMessage="Empty space"
        />
      }
      subTitle={
        <FormattedMessage
          id="ProductGroupsListPage.List.Empty.Description"
          defaultMessage="There is nothing here so far."
        />
      }
    />
  );
}

export default ProductGroupsListPageListEmpty;
