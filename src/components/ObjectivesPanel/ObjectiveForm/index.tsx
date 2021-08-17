import { FlagFilled } from '@ant-design/icons';
import { Button } from 'antd';
import React, { Fragment } from 'react';
import { Field } from 'react-final-form';

import { Objective } from '../../../interfaces/objectives';
import { joi } from '../../../lib/joi';
import { Form } from '../../Form';
import Input, { TextArea } from '../../Form/Input';
import Select, { Option } from '../../Form/Select';
import { validateSchema } from '../../Form/validation';
import styles from './styles.module.less';

interface Props {
  onSubmit: (values: any) => void;
  loading: boolean;
  objective?: Objective | null;
}

export const priorityIcons: any = {
  1: <FlagFilled style={{ color: '#AAAAAA' }} />,
  2: <FlagFilled style={{ color: '#4D69FF' }} />,
  3: <FlagFilled style={{ color: '#7BAA7C' }} />,
  4: <FlagFilled style={{ color: '#FFFA78' }} />,
  5: <FlagFilled style={{ color: '#FD4E28' }} />,
};

const objectiveSchema = joi
  .object({
    title: joi.string().required(),
    description: joi.string().required(),
    priority: joi.number().required(),
  })
  .unknown(true)
  .required();
const validator = validateSchema(objectiveSchema);

export const ObjectiveForm = ({ onSubmit, loading }: Props) => {
  return (
    <Form
      validator={validator}
      onSubmit={(values) => {
        onSubmit({
          ...values,
        });
      }}
      keepDirtyOnReinitialize={true}
      isLoading={loading}
    >
      {({ valid }) => (
        <Fragment>
          <Field
            name="title"
            component={Input}
            type="text"
            label="Objective Title"
            placeholder="What we want to achieve"
          />
          <Field
            name="description"
            component={TextArea}
            type="text"
            label="Description"
            placeholder="Lorem ipsum dolor sit amet."
            style={{ height: 60 }}
          />
          <Field name="priority" component={Select} type="text" label="Priority">
            <Option value={1}>{priorityIcons[1]} Very Low Priority</Option>
            <Option value={2}>{priorityIcons[2]} Low Priority</Option>
            <Option value={3}>{priorityIcons[3]} Normal Priority</Option>
            <Option value={4}>{priorityIcons[4]} High Priority</Option>
            <Option value={5}>{priorityIcons[5]} Urgent Priority</Option>
          </Field>
          <div className={styles.buttonContainer}>
            <Button disabled={!valid} type="primary" htmlType="submit">
              Save Objective
            </Button>
          </div>
        </Fragment>
      )}
    </Form>
  );
};

export default ObjectiveForm;
