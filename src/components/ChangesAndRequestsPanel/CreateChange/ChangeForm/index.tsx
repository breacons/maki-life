import { Button } from 'antd';
import _ from 'lodash-es';
import React, { Fragment, useMemo } from 'react';
import { Field } from 'react-final-form';

import { useCurrentDiscussion } from '../../../../hooks/discussions';
import { DiscussionChange } from '../../../../interfaces/discussions';
import { joi } from '../../../../lib/joi';
import { Form } from '../../../Form';
import Input, { TextArea } from '../../../Form/Input';
import Select, { Option } from '../../../Form/Select';
import { validateSchema } from '../../../Form/validation';

interface Props {
  onSubmit: (values: CreateChangeValues) => void;
  change?: DiscussionChange;
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

export interface CreateChangeValues {
  title: string;
  description: string;
  solvedRequestIds: Record<string, boolean>;
}

export const ChangeForm = ({ onSubmit, change, loading }: Props) => {
  const { discussion } = useCurrentDiscussion();

  const solvableRequests = useMemo(() => {
    if (!discussion || !discussion.requests) {
      return [];
    }

    return Object.values(discussion?.requests);

    //   .filter(
    //   (request) => request.status === DiscussionRequestStatus.Open,
    // );
  }, [discussion?.requests]);

  const submit = (values: any) => {
    const final = {
      ...values,
      solvedRequestIds: _.mapValues(_.keyBy(values.solvedRequestIds), () => true),
    };

    onSubmit(final);
  };

  return (
    <Form
      onSubmit={submit}
      key="edit-request"
      validator={validator}
      initialValues={{
        ..._.pick(change, ['title', 'description']),
        solvedRequestIds: Object.keys(change?.solvedRequestIds || {}),
      }}
      preventPrompt={false}
      loading={loading}
    >
      {({ valid }) => (
        <Fragment>
          <Field
            name="title"
            component={Input}
            type="text"
            label="Version Title"
            placeholder="Request for correction"
          />
          <Field
            name="description"
            component={TextArea}
            type="text"
            label="Description"
            style={{ height: 200 }}
            placeholder="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus interdum ligula non metus viverra, a posuere justo cursus. Fusce pulvinar accumsan aliquam. Phasellus vitae efficitur velit. Cras euismod est eget dolor vestibulum, nec hendrerit est gravida. Praesent in tristique eros. Sed molestie quam at neque cursus pharetra. Curabitur vel justo congue, mollis erat sed, hendrerit dolor. Maecenas ac tincidunt tellus. Duis non justo lacus. Aenean eu dapibus nibh, id vehicula orci. Pellentesque vitae placerat felis. Mauris in ultrices dui, ut consectetur libero. Sed nisi arcu, tincidunt vel leo in, imperdiet finibus nunc. Curabitur orci velit, placerat sit amet magna ac, sagittis elementum orci. Phasellus feugiat laoreet laoreet. Ut at massa vitae massa vehicula iaculis."
          />
          <Field
            name="solvedRequestIds"
            component={Select}
            type="text"
            label="Solved requests"
            mode="multiple"
          >
            {solvableRequests.map((request) => (
              <Option value={request.id} key={request.id}>
                {request.title}
              </Option>
            ))}
          </Field>
          <Button disabled={!valid} type="primary" block size="large" htmlType="submit">
            Save Version
          </Button>
        </Fragment>
      )}
    </Form>
  );
};

export default ChangeForm;
