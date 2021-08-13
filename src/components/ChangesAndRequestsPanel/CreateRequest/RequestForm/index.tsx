import React, { Fragment } from 'react';
import styles from './styles.module.less';
import { DiscussionRequest } from '../../../../interfaces/discussions';
import { Form } from '../../../Form';
import { joi } from '../../../../lib/joi';
import { validateSchema } from '../../../Form/validation';
import { Field } from 'react-final-form';
import Input, { TextArea } from '../../../Form/Input';
import { Alert, Button, Space } from 'antd';
import _ from 'lodash-es';
import { Link } from 'react-router-dom';

interface Props {
  onSubmit: (values: CreateRequestValues) => void;
  request?: DiscussionRequest;
  loading: boolean;
  backUrl: string;
}

const requestSchema = joi
  .object({
    title: joi.string().required(),
    description: joi.string().required(),
  })
  .unknown(true)
  .required();
const validator = validateSchema(requestSchema);

export interface CreateRequestValues {
  title: string;
  description: string;
}

export const RequestForm = ({ onSubmit, request, loading, backUrl }: Props) => {
  return (
    <Form
      onSubmit={(values) => onSubmit(values as CreateRequestValues)}
      key="edit-request"
      validator={validator}
      initialValues={{ ..._.pick(request, ['title', 'description']) }}
      preventPrompt={false}
      loading={loading}
    >
      {({ valid, pristine }) => (
        <Fragment>
          <Field
            name="title"
            component={Input}
            type="text"
            label="Request Title"
            placeholder="Request for correction"
          />
          <Field
            name="description"
            component={TextArea}
            type="text"
            label="Description"
            placeholder="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
            style={{ height: 200 }}
          />
          <Space direction="vertical" size={24}>
            <Alert
              message={'You can add graphics to this request by drawing on the map.'}
              type="info"
              showIcon
            />
            <Button disabled={!valid} type="primary" block size="large" htmlType="submit">
              Save Request
            </Button>
          </Space>
        </Fragment>
      )}
    </Form>
  );
};

export default RequestForm;
